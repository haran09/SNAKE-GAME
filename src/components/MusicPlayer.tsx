import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex items-center px-8 gap-12 z-10">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-64 flex-shrink-0">
        <div className="w-12 h-12 bg-cyan-900/30 border border-cyan-400/20 rounded-lg overflow-hidden flex items-center justify-center group relative">
          <img src={currentTrack.cover} alt="" className="w-full h-full object-cover opacity-80" />
          <div className={`absolute inset-0 border-2 border-cyan-400 border-t-transparent rounded-full opacity-0 group-hover:opacity-100 ${isPlaying ? 'animate-spin' : ''}`} style={{ margin: '15%' }} />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
          <p className="text-[10px] uppercase tracking-widest text-white/50 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button 
            onClick={prevTrack} 
            className="text-white/40 hover:text-cyan-400 transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </button>
          <button 
            onClick={nextTrack} 
            className="text-white/40 hover:text-cyan-400 transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="w-full max-w-xl flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40">
            {formatTime(audioRef.current?.currentTime || 0)}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer">
             <div 
               className="absolute left-0 top-0 h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
               style={{ width: `${progress}%` }}
             />
          </div>
          <span className="text-[10px] font-mono text-white/40">
            {formatTime(audioRef.current?.duration || 180)}
          </span>
        </div>
      </div>

      {/* Right: Options/Volume */}
      <div className="w-64 flex justify-end items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-white/40" />
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-white/60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
