import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AppCard } from './AppCard';
import type { AppConfig, AppStatus, AppStats } from '../types';
import { Activity, LayoutGrid } from 'lucide-react';

// Connect to Backend
const socket = io('http://localhost:9999');

export const Dashboard: React.FC = () => {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>({});
  const [stats, setStats] = useState<Record<string, AppStats>>({});

  useEffect(() => {
    socket.on('config', (config: AppConfig[]) => {
      setApps(config);
    });

    socket.on('status', (status: AppStatus) => {
      setStatuses(prev => ({ ...prev, [status.appId]: status }));
    });

    socket.on('stats', (newStats: AppStats[]) => {
      const statsMap = newStats.reduce((acc, curr) => ({ ...acc, [curr.appId]: curr }), {});
      setStats(prev => ({ ...prev, ...statsMap }));
    });

    return () => {
      socket.off('config');
      socket.off('status');
      socket.off('stats');
    };
  }, []);

  const handleSpawn = (appId: string, mode: 'dev' | 'prod', customPort?: number) => {
    socket.emit('spawn', { appId, mode, customPort });
  };

  const handleStop = (appId: string) => {
    socket.emit('kill', { appId });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <LayoutGrid size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              T-Ecosystem Launcher
            </h1>
            <p className="text-sm text-slate-400">Local DevOps Control Center</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <Activity size={16} className="text-emerald-400 animate-pulse" />
            <span>System Active</span>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <AppCard 
            key={app.id} 
            config={app} 
            status={statuses[app.id]} 
            stats={stats[app.id]}
            socket={socket}
            onSpawn={handleSpawn}
            onStop={handleStop}
          />
        ))}
      </div>
    </div>
  );
};
