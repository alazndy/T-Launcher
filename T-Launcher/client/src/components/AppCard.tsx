import React, { useState } from 'react';
import { Play, Square, Terminal as TerminalIcon, ExternalLink, RefreshCw, Cpu, Activity, AlertCircle, FileText, GitBranch } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AppConfig, AppStatus, AppStats } from '../types';
import { Terminal } from './Terminal';
import { EnvEditor } from './EnvEditor';
import { GitPanel } from './GitPanel';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AppCardProps {
  config: AppConfig;
  status?: AppStatus;
  stats?: AppStats;
  socket: any;
  onSpawn: (appId: string, mode: 'dev' | 'prod', customPort?: number) => void;
  onStop: (appId: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ config, status, stats, socket, onSpawn, onStop }) => {
  const [showTerminal, setShowTerminal] = useState(false);
  const [customPort, setCustomPort] = useState<string>(config.port.toString());
  const [mode, setMode] = useState<'dev' | 'prod'>('dev');
  const [showEnvEditor, setShowEnvEditor] = useState(false);
  const [showGitPanel, setShowGitPanel] = useState(false);

  const isRunning = status?.status === 'running';
  
  // Color mapping for dynamic styles
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20 hover:border-violet-500/50',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50',
    fuchsia: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20 hover:border-fuchsia-500/50',
  };

  const themeClass = colorMap[config.color] || colorMap.blue;

  const handleStart = () => {
    const port = parseInt(customPort);
    onSpawn(config.id, mode, isNaN(port) ? undefined : port);
    setShowTerminal(true);
  };

  // Memory formatter
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 MB';
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <>
      <div className={cn("rounded-xl border transition-all duration-300 overflow-hidden flex flex-col h-[400px]", themeClass, isRunning ? "shadow-[0_0_20px_-5px_var(--shadow-color)]" : "opacity-80 hover:opacity-100")}>
         
         {/* Header */}
         <div className="p-4 border-b border-white/5 flex items-start justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
               <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold bg-white/5", config.color === 'emerald' ? 'text-emerald-400' : `text-${config.color}-400`)}>
                  {config.name.substring(0, 2).toUpperCase()}
               </div>
               <div>
                  <h3 className="font-bold text-lg leading-tight">{config.name}</h3>
                  <p className="text-xs text-slate-400">{config.description}</p>
               </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
               <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border", isRunning ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400")}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", isRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-500")} />
                  {isRunning ? 'RUNNING' : 'STOPPED'}
               </div>
               {isRunning && stats && (
                   <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Cpu size={10} /> {Math.round(stats.cpu)}%</span>
                      <span className="flex items-center gap-1"><Activity size={10} /> {formatBytes(stats.memory)}</span>
                   </div>
               )}
            </div>
         </div>

         {/* Content Area (Terminal or Controls) */}
         <div className="flex-1 bg-slate-950/80 relative group">
            <AnimatePresence mode="wait">
              {!showTerminal ? (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-4"
                 >
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <div className="space-y-1">
                          <label className="text-xs text-slate-400 ml-1">Mode</label>
                          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                             {['dev', 'prod'].map((m) => (
                                <button
                                  key={m}
                                  onClick={() => setMode(m as 'dev' | 'prod')}
                                  className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize", mode === m ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300")}
                                >
                                  {m}
                                </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="space-y-1">
                          <label className="text-xs text-slate-400 ml-1">Port</label>
                          <input 
                            type="text" 
                            value={customPort}
                            onChange={(e) => setCustomPort(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                            title="Custom port number"
                            placeholder="3000"
                          />
                       </div>
                    </div>

                    <button 
                       onClick={handleStart}
                       disabled={isRunning}
                       className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <Play size={18} fill="currentColor" />
                       {isRunning ? 'Running...' : 'Start Application'}
                    </button>
                    
                    {status?.status === 'error' && (
                       <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg w-full">
                          <AlertCircle size={14} />
                          Process exited with code {status.exitCode}
                       </div>
                    )}
                 </motion.div>
              ) : (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 pb-12"
                 >
                   <Terminal appId={config.id} socket={socket} isActive={showTerminal} />
                 </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-900/90 backdrop-blur border-t border-white/5 flex items-center justify-between px-3">
               <button 
                 onClick={() => setShowTerminal(!showTerminal)}
                 className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors", showTerminal ? "text-indigo-400" : "text-slate-400 hover:text-white")}
               >
                  <TerminalIcon size={12} />
                  {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
               </button>

               <div className="flex items-center gap-1">
                  {/* Env Editor Button */}
                  <button 
                    onClick={() => setShowEnvEditor(true)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors rounded-md hover:bg-white/5"
                    title="Edit Environment Variables"
                  >
                    <FileText size={14} />
                  </button>

                  {/* Git Panel Button */}
                  <button 
                    onClick={() => setShowGitPanel(true)}
                    className="p-1.5 text-slate-400 hover:text-violet-400 transition-colors rounded-md hover:bg-white/5"
                    title="Git Status"
                  >
                    <GitBranch size={14} />
                  </button>

                  {isRunning && (
                      <button 
                        onClick={() => window.open(`http://localhost:${customPort}`, '_blank')}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors rounded-md hover:bg-white/5"
                        title="Open in Browser"
                      >
                          <ExternalLink size={14} />
                      </button>
                  )}
                  
                  {isRunning ? (
                      <button 
                         onClick={() => onStop(config.id)}
                         className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
                         title="Stop Process"
                      >
                         <Square size={14} fill="currentColor" />
                      </button>
                  ) : (
                      <button 
                         onClick={handleStart}
                         className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors rounded-md hover:bg-white/5"
                         title="Quick Start"
                      >
                         <RefreshCw size={14} />
                      </button>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Modals */}
      {showEnvEditor && (
        <EnvEditor 
          appId={config.id} 
          appName={config.name} 
          socket={socket} 
          onClose={() => setShowEnvEditor(false)} 
        />
      )}

      {showGitPanel && (
        <GitPanel 
          appId={config.id} 
          appName={config.name} 
          socket={socket} 
          onClose={() => setShowGitPanel(false)} 
        />
      )}
    </>
  );
};
