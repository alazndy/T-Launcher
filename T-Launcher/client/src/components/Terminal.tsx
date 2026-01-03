import React, { useEffect, useRef, useState } from 'react';

interface TerminalProps {
  appId: string;
  socket: any;
  isActive: boolean;
}

// Simple log viewer as xterm.js workaround
export const Terminal: React.FC<TerminalProps> = ({ appId, socket, isActive }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleOutput = ({ appId: id, data }: { appId: string, data: string }) => {
      if (id === appId) {
        setLogs(prev => {
          const newLogs = [...prev, data];
          // Keep last 500 lines
          if (newLogs.length > 500) {
            return newLogs.slice(-500);
          }
          return newLogs;
        });
      }
    };

    socket.on('output', handleOutput);

    return () => {
      socket.off('output', handleOutput);
    };
  }, [appId, socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      socket.emit('input', { appId, data: inputValue + '\n' });
      setInputValue('');
    }
  };

  // Focus input when active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0f] rounded-lg overflow-hidden">
      {/* Log Output */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic">Waiting for output...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="text-slate-300">
              {log}
            </div>
          ))
        )}
      </div>
      
      {/* Input */}
      <div className="border-t border-slate-800 p-2 flex items-center gap-2">
        <span className="text-emerald-400 font-mono text-xs">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command and press Enter..."
          className="flex-1 bg-transparent text-slate-300 text-xs font-mono outline-none placeholder-slate-600"
          title="Command input"
        />
      </div>
    </div>
  );
};
