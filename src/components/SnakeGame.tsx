import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RefreshCw } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate?: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  });

  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: { x: 5, y: 5 },
      direction: 'UP',
      isGameOver: false,
      score: 0,
      highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    });
    setGameSpeed(INITIAL_SPEED);
    onScoreUpdate?.(0);
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        if (prev.score > prev.highScore) {
          localStorage.setItem('snakeHighScore', prev.score.toString());
        }
        return { ...prev, isGameOver: true, highScore: Math.max(prev.score, prev.highScore) };
      }

      // Check collisions with self
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        if (prev.score > prev.highScore) {
          localStorage.setItem('snakeHighScore', prev.score.toString());
        }
        return { ...prev, isGameOver: true, highScore: Math.max(prev.score, prev.highScore) };
      }

      const newSnake = [head, ...prev.snake];
      
      // Check if food eaten
      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newScore = prev.score + 10;
        setGameSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        onScoreUpdate?.(newScore);
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [gameState.isGameOver, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
      }
      setGameState(prev => {
        const currentDir = prev.direction;
        const key = e.key.toLowerCase();
        if ((key === 'arrowup' || key === 'w') && currentDir !== 'DOWN') return { ...prev, direction: 'UP' };
        if ((key === 'arrowdown' || key === 's') && currentDir !== 'UP') return { ...prev, direction: 'DOWN' };
        if ((key === 'arrowleft' || key === 'a') && currentDir !== 'RIGHT') return { ...prev, direction: 'LEFT' };
        if ((key === 'arrowright' || key === 'd') && currentDir !== 'LEFT') return { ...prev, direction: 'RIGHT' };
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(interval);
  }, [moveSnake, gameSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
    }

    // Draw Snake
    gameState.snake.forEach((segment, i) => {
      ctx.fillStyle = '#22d3ee'; // cyan-400
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#22d3ee';
      
      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const s = cellSize - 2;
      
      if (i === 0) {
        ctx.fillStyle = '#06b6d4'; // cyan-500
        ctx.shadowBlur = 12;
      }
      
      ctx.fillRect(x, y, s, s);
    });

    // Draw Food
    ctx.fillStyle = '#e879f9'; // fuchsia-400
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#e879f9';
    const fx = gameState.food.x * cellSize + cellSize/4;
    const fy = gameState.food.y * cellSize + cellSize/4;
    const fs = cellSize/2;
    
    // Pulse effect simulation on canvas
    const pulse = Math.sin(Date.now() / 200) * 2;
    ctx.beginPath();
    ctx.arc(fx + fs/2, fy + fs/2, (fs/2) + pulse, 0, Math.PI * 2);
    ctx.fill();

  }, [gameState]);

  return (
    <div className="relative group p-1 bg-cyan-500/20 rounded-sm">
      <canvas
        ref={canvasRef}
        width={440}
        height={440}
        className="block bg-black/80"
      />

      <AnimatePresence>
        {gameState.isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-8 text-center"
          >
            <div className="w-16 h-16 bg-fuchsia-500 rounded-sm shadow-[0_0_20px_rgba(217,70,239,0.5)] flex items-center justify-center mb-6 animate-pulse">
               <RefreshCw className="text-black" size={32} />
            </div>
            
            <h2 className="text-3xl font-black italic tracking-tighter text-white mb-2">
              NEURAL_COLLAPSE
            </h2>
            <div className="text-fuchsia-400 font-mono text-xl mb-8 tracking-widest">
              SCORE: {gameState.score.toString().padStart(4, '0')}
            </div>
            
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all text-xs"
            >
              Initialize Reboot
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex justify-between items-center px-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-white/40 tracking-[0.2em]">CONTROL_INPUT: ARROW_KEYS</span>
        <span className="text-[10px] text-white/40 tracking-[0.2em]">DIFFICULTY: {Math.round(100 - (gameSpeed / INITIAL_SPEED * 100))}%</span>
      </div>
    </div>
  );
};

export default SnakeGame;
