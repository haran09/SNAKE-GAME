/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState<string[]>(['NEURAL_LINK_ESTABLISHED', 'GRID_SYNCHRONIZED', 'SYSTEM_STATUS_NOMINAL']);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('snakeHighScore') || '0'));

  useEffect(() => {
    const logInterval = setInterval(() => {
      const messages = [
        'BPM_STABILIZED_128',
        'SYNCING_GRID_VERTICES',
        'AUDIO_BUFFER_NOMINAL',
        'CALIBRATING_SENSORS',
        'UPLINK_STABLE_99%'
      ];
      setLogs(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev].slice(0, 5));
    }, 5000);

    const scoreCheck = setInterval(() => {
      const currentHigh = parseInt(localStorage.getItem('snakeHighScore') || '0');
      if (currentHigh !== highScore) setHighScore(currentHigh);
    }, 1000);

    return () => {
      clearInterval(logInterval);
      clearInterval(scoreCheck);
    };
  }, [highScore]);

  // We'll use a custom event or shared state for score later if needed, 
  // for now we'll just let the components manage their own inner state 
  // as per "preserve functionality" but we'll try to align the visuals.

  return (
    <div className="w-full h-screen bg-[#05060f] text-slate-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="crt-overlay" />
      <div className="scanlines" />

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-cyan-500/20 bg-black/40 flex items-center justify-between px-8 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center justify-center">
            <span className="text-black font-black italic text-xs">SS</span>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white">SYNTH<span className="text-cyan-400">SNAKE</span></h1>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-cyan-400/60">Current Score</span>
            <span className="text-2xl font-mono leading-none font-bold text-cyan-400">
               {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-fuchsia-400/60">High Score</span>
            <span className="text-2xl font-mono leading-none font-bold text-fuchsia-400">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Playlist & Logs */}
        <aside className="w-72 bg-black/20 border-r border-white/5 flex flex-col z-30">
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">Neural Data Nodes</h2>
            
            <div className="flex-1 overflow-y-auto space-y-2 mb-6 pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1 - (i * 0.2), x: 0 }}
                    className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg flex gap-3 items-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-tighter text-cyan-300/80">{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-auto p-4 rounded-xl border border-white/10 bg-white/5">
              <p class="text-[10px] uppercase text-center text-white/40 mb-2">System Status</p>
              <div class="flex justify-between text-[11px] font-mono font-bold">
                <span class="text-cyan-400">BPM: 128</span>
                <span class="text-fuchsia-400">LVL: 04</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Game Area */}
        <section className="flex-1 snake-grid-bg p-8 flex items-center justify-center relative overflow-hidden">
          <div className="relative p-1 bg-cyan-500/10 rounded-sm shadow-[0_0_50px_rgba(6,182,212,0.05)]">
             <SnakeGame onScoreUpdate={setScore} />
          </div>
          
          {/* Ambient Grid Lines Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#ffffff11_1px,transparent_1px),linear-gradient(to_bottom,#ffffff11_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </section>

        {/* Right Sidebar: Waveform & Info */}
        <aside className="w-72 bg-black/20 border-l border-white/5 p-6 flex flex-col z-30">
          <h2 className="text-xs uppercase tracking-widest text-white/40 mb-6">Waveform Analysis</h2>
          <div className="flex items-end gap-1 h-32 mb-8 px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ['40%', '90%', '50%', '100%', '30%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="flex-1 bg-cyan-400/40 rounded-t-sm"
              />
            ))}
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase text-white/40 mb-2">Simulation Stats</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Algorithm State</span>
                  <span className="font-mono text-cyan-400">STABLE</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Latency</span>
                  <span className="font-mono text-cyan-400">4ms</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase text-white/40 mb-4">Neural Interface</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-start-2 w-8 h-8 border border-white/20 rounded flex items-center justify-center text-[10px] text-white/40 font-bold">W</div>
                <div className="w-8 h-8 border border-white/20 rounded flex items-center justify-center text-[10px] text-white/40 font-bold">A</div>
                <div className="w-8 h-8 border border-cyan-500 rounded flex items-center justify-center text-[10px] text-cyan-400 font-bold">S</div>
                <div className="w-8 h-8 border border-white/20 rounded flex items-center justify-center text-[10px] text-white/40 font-bold">D</div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Footer: Music Player */}
      <footer className="h-24 bg-black border-t border-cyan-500/30">
        <MusicPlayer />
      </footer>
    </div>
  );
}

