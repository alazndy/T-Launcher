# T-Launcher 🚀

**Unified DevOps Control Panel for T-Ecosystem**

T-Launcher is a centralized dashboard for managing all T-Ecosystem applications from a single interface. Start, stop, and monitor multiple applications with real-time logs, resource usage, and integrated DevOps tools.

![T-Launcher](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎮 **Multi-App Control** | Start/stop 6+ applications with one click |
| 🔄 **Dev/Prod Toggle** | Switch between development and production modes |
| 📊 **Real-time Monitoring** | Live CPU and RAM usage per application |
| 📝 **Log Streaming** | Real-time log output from all applications |
| 🔌 **Dynamic Ports** | Custom port assignment per application |
| ⚡ **Port Killer** | Auto-kill processes blocking required ports |
| 📁 **Env Editor** | Visual `.env` file editor for each app |
| 🔀 **Git Integration** | Branch status, pull, and sync |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**
- **Socket.io** - Real-time communication
- **node-pty** - Pseudo-terminal emulation
- **pidusage** - Process monitoring

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Fast dev server
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

---

## 📁 Project Structure

```
T-Launcher/
├── server/                    # Backend
│   ├── index.js              # Express + Socket.io server
│   ├── config.js             # App definitions (ports, commands)
│   └── utils/
│       ├── portKiller.js     # Port management utilities
│       ├── envManager.js     # .env file read/write
│       └── gitManager.js     # Git operations
│
└── client/                    # Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.tsx  # Main grid layout
    │   │   ├── AppCard.tsx    # Individual app card
    │   │   ├── Terminal.tsx   # Log viewer
    │   │   ├── EnvEditor.tsx  # Environment editor modal
    │   │   └── GitPanel.tsx   # Git status modal
    │   ├── types.ts           # TypeScript types
    │   └── index.css          # Tailwind styles
    ├── vite.config.ts
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/turhansel/t-launcher.git
cd t-launcher

# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### Running

**Terminal 1 - Backend:**
```bash
cd server
node index.js
# Server runs on http://localhost:9999
```

**Terminal 2 - Frontend:**
```bash
cd client
pnpm dev
# Dashboard at http://localhost:9000
```

---

## ⚙️ Configuration

Edit `server/config.js` to add/modify managed applications:

```javascript
module.exports = {
  apps: [
    {
      id: 'myapp',
      name: 'My Application',
      description: 'Description here',
      path: '/absolute/path/to/app',
      port: 3000,
      color: 'emerald', // emerald|violet|blue|rose|amber|fuchsia
      cmd: {
        dev: 'pnpm dev',
        prod: 'pnpm build; if ($?) { pnpm start }',
        install: 'pnpm install'
      }
    }
  ]
};
```

---

## 📖 API Reference

### Socket.io Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `spawn` | Client→Server | `{ appId, mode, customPort }` | Start an application |
| `kill` | Client→Server | `{ appId }` | Stop an application |
| `input` | Client→Server | `{ appId, data }` | Send terminal input |
| `output` | Server→Client | `{ appId, data }` | Receive terminal output |
| `status` | Server→Client | `{ appId, status, pid }` | App status update |
| `stats` | Server→Client | `[{ appId, cpu, memory }]` | Resource stats |
| `getEnv` | Client→Server | `{ appId }` | Get .env variables |
| `saveEnv` | Client→Server | `{ appId, variables }` | Save .env variables |
| `getGit` | Client→Server | `{ appId }` | Get git status |
| `gitPull` | Client→Server | `{ appId }` | Pull latest changes |

### REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/apps` | GET | List all applications |
| `/api/apps/:id/env` | GET | Get env variables |
| `/api/apps/:id/env` | PUT | Update env variables |
| `/api/apps/:id/git` | GET | Get git status |
| `/api/apps/:id/git/pull` | POST | Git pull |

---

## 🎨 Managed Applications

| App | Port | Description |
|-----|------|-------------|
| ENV-I | 3000 | Inventory Management |
| UPH | 3001 | Project Hub |
| t-Market | 3002 | E-Commerce Platform |
| Weave | 3004 | Fabric Design Tool |
| T-SA | 5173 | Spec Analyzer |
| RenderCi | 5174 | Batch Renderer |

---

## 🔧 Troubleshooting

### Port Already in Use
T-Launcher automatically detects and offers to kill processes blocking required ports.

### PowerShell Command Issues
Commands use PowerShell-compatible syntax (`; if ($?) { }` instead of `&&`).

### Application Won't Start
1. Check if dependencies are installed: `pnpm install` in app directory
2. Verify path in `config.js` is correct
3. Check terminal output for error messages

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ for T-Ecosystem**
