const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const os = require('os');
const pty = require('node-pty');
const pidusage = require('pidusage');
const cors = require('cors');
const { apps } = require('./config');
const { checkPort, killPid } = require('./utils/portKiller');
const { readEnvFile, writeEnvFile } = require('./utils/envManager');
const { getGitInfo, gitPull } = require('./utils/gitManager');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active pty processes
const processes = new Map();

// Shell to use
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

// ========== REST API Endpoints ==========

// Get all apps config
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// Get env variables for an app
app.get('/api/apps/:appId/env', async (req, res) => {
  const appConfig = apps.find(a => a.id === req.params.appId);
  if (!appConfig) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  try {
    const envData = await readEnvFile(appConfig.path);
    res.json(envData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update env variables for an app
app.put('/api/apps/:appId/env', async (req, res) => {
  const appConfig = apps.find(a => a.id === req.params.appId);
  if (!appConfig) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  try {
    const { variables, useLocal = false } = req.body;
    await writeEnvFile(appConfig.path, variables, useLocal);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get git status for an app
app.get('/api/apps/:appId/git', async (req, res) => {
  const appConfig = apps.find(a => a.id === req.params.appId);
  if (!appConfig) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  try {
    const gitInfo = await getGitInfo(appConfig.path);
    res.json(gitInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Git pull for an app
app.post('/api/apps/:appId/git/pull', async (req, res) => {
  const appConfig = apps.find(a => a.id === req.params.appId);
  if (!appConfig) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  try {
    const result = await gitPull(appConfig.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== Socket.io Handlers ==========

io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial config
  socket.emit('config', apps);

  // Send initial status for all apps
  apps.forEach(app => {
    const proc = processes.get(app.id);
    socket.emit('status', {
      appId: app.id,
      status: proc ? 'running' : 'stopped',
      pid: proc ? proc.pid : null
    });
  });

  // Spawn Process
  socket.on('spawn', async ({ appId, mode = 'dev', customPort }) => {
    if (processes.has(appId)) return;

    const appConfig = apps.find(a => a.id === appId);
    if (!appConfig) return;

    const targetPort = customPort || appConfig.port;

    // Check and kill blocking process
    const busyPid = await checkPort(targetPort);
    if (busyPid) {
      console.log(`Port ${targetPort} is busy by PID ${busyPid}. Killing...`);
      await killPid(busyPid);
      await new Promise(r => setTimeout(r, 1000));
    }

    let command = appConfig.cmd[mode];
    
    const env = { ...process.env };
    env.PORT = targetPort;

    console.log(`Starting ${appId} on port ${targetPort} in ${mode} mode...`);

    // Use proper shell arguments
    const isWin = os.platform() === 'win32';
    const shellArgs = isWin 
      ? ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command]
      : ['-c', command];

    const ptyProcess = pty.spawn(shell, shellArgs, {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: appConfig.path,
      env: env
    });

    processes.set(appId, { pty: ptyProcess, pid: ptyProcess.pid });

    socket.emit('status', { appId, status: 'running', pid: ptyProcess.pid });

    ptyProcess.onData((data) => {
      io.emit('output', { appId, data });
    });

    ptyProcess.onExit(({ exitCode }) => {
      console.log(`${appId} exited with code ${exitCode}`);
      processes.delete(appId);
      io.emit('status', { appId, status: 'stopped', exitCode });
    });
  });

  // Kill Process
  socket.on('kill', ({ appId }) => {
    const proc = processes.get(appId);
    if (proc) {
      proc.pty.kill();
      processes.delete(appId);
      socket.emit('status', { appId, status: 'stopped' });
    }
  });

  // Terminal Input
  socket.on('input', ({ appId, data }) => {
    const proc = processes.get(appId);
    if (proc) {
      proc.pty.write(data);
    }
  });

  // Resize Terminal
  socket.on('resize', ({ appId, cols, rows }) => {
    const proc = processes.get(appId);
    if (proc) {
      proc.pty.resize(cols, rows);
    }
  });

  // Get Env (via Socket for real-time)
  socket.on('getEnv', async ({ appId }, callback) => {
    const appConfig = apps.find(a => a.id === appId);
    if (!appConfig) {
      callback({ error: 'App not found' });
      return;
    }
    
    try {
      const envData = await readEnvFile(appConfig.path);
      callback(envData);
    } catch (error) {
      callback({ error: error.message });
    }
  });

  // Save Env (via Socket)
  socket.on('saveEnv', async ({ appId, variables, useLocal }, callback) => {
    const appConfig = apps.find(a => a.id === appId);
    if (!appConfig) {
      callback({ error: 'App not found' });
      return;
    }
    
    try {
      await writeEnvFile(appConfig.path, variables, useLocal);
      callback({ success: true });
    } catch (error) {
      callback({ error: error.message });
    }
  });

  // Get Git Info (via Socket)
  socket.on('getGit', async ({ appId }, callback) => {
    const appConfig = apps.find(a => a.id === appId);
    if (!appConfig) {
      callback({ error: 'App not found' });
      return;
    }
    
    try {
      const gitInfo = await getGitInfo(appConfig.path);
      callback(gitInfo);
    } catch (error) {
      callback({ error: error.message });
    }
  });

  // Git Pull (via Socket)
  socket.on('gitPull', async ({ appId }, callback) => {
    const appConfig = apps.find(a => a.id === appId);
    if (!appConfig) {
      callback({ error: 'App not found' });
      return;
    }
    
    try {
      const result = await gitPull(appConfig.path);
      callback(result);
    } catch (error) {
      callback({ error: error.message });
    }
  });
});

// Resource Monitoring Loop
setInterval(async () => {
  const stats = [];
  for (const [appId, proc] of processes) {
    try {
      const stat = await pidusage(proc.pid);
      stats.push({ appId, cpu: stat.cpu, memory: stat.memory });
    } catch (e) {
      // Process might be dead
    }
  }
  if (stats.length > 0) {
    io.emit('stats', stats);
  }
}, 2000);

const PORT = 9999;
server.listen(PORT, () => {
  console.log(`T-Launcher Server running on port ${PORT}`);
});
