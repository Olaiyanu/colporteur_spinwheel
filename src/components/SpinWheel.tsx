import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { WHEEL_COLORS, WHEEL_ITEMS, SOUND_EFFECTS } from '../constants';

interface SpinWheelProps {
  items: string[];
  onFinished: (result: string, index: number) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ items, onFinished, isSpinning, setIsSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  
  // Audio refs
  const spinAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);
  const tickAudio = useRef<HTMLAudioElement | null>(null);
  const lastTickIndex = useRef<number>(-1);

  useEffect(() => {
    spinAudio.current = new Audio(SOUND_EFFECTS.spin);
    winAudio.current = new Audio(SOUND_EFFECTS.win);
    tickAudio.current = new Audio(SOUND_EFFECTS.tick);
    
    if (spinAudio.current) spinAudio.current.loop = true;
    
    return () => {
      if (spinAudio.current) {
        spinAudio.current.pause();
        spinAudio.current = null;
      }
      winAudio.current = null;
      tickAudio.current = null;
    };
  }, []);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((item, i) => {
      const startAngle = i * sliceAngle + angle;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      
      // Truncate text if too long
      const displayText = item.length > 12 ? item.substring(0, 10) + '...' : item;
      ctx.fillText(displayText, radius - 20, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner circle shadow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(rotation);
  }, [rotation]);

  const spin = () => {
    const spinDuration = 5000; // 5 seconds
    const startRotation = rotationRef.current;
    const extraSpins = 5 + Math.random() * 5; // 5 to 10 full rotations
    const targetRotation = startRotation + extraSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    
    const startTime = performance.now();

    // Play spin sound
    if (spinAudio.current) {
      spinAudio.current.currentTime = 0;
      spinAudio.current.play().catch(e => console.log("Audio play failed:", e));
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function: easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
      rotationRef.current = currentRotation;
      setRotation(currentRotation);

      // Tick sound logic
      const sliceAngle = (2 * Math.PI) / items.length;
      const normalizedRotation = (currentRotation % (2 * Math.PI));
      const pointerAngle = -Math.PI / 2;
      let currentTickIndex = Math.floor((pointerAngle - normalizedRotation) / sliceAngle) % items.length;
      if (currentTickIndex < 0) currentTickIndex += items.length;

      if (currentTickIndex !== lastTickIndex.current) {
        lastTickIndex.current = currentTickIndex;
        if (tickAudio.current) {
          const clone = tickAudio.current.cloneNode() as HTMLAudioElement;
          clone.volume = 0.3 * (1 - progress); // Fade out tick volume as it slows down
          clone.play().catch(() => {});
        }
      }

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        requestRef.current = null;
        setIsSpinning(false);
        
        // Stop spin sound and play win sound
        if (spinAudio.current) {
          spinAudio.current.pause();
        }
        if (winAudio.current) {
          winAudio.current.currentTime = 0;
          winAudio.current.play().catch(() => {});
        }
        
        // Calculate result
        const normalizedRotation = (currentRotation % (2 * Math.PI));
        const sliceAngle = (2 * Math.PI) / items.length;
        
        const pointerAngle = -Math.PI / 2;
        let winningIndex = Math.floor((pointerAngle - normalizedRotation) / sliceAngle) % items.length;
        if (winningIndex < 0) winningIndex += items.length;
        
        onFinished(items[winningIndex], winningIndex);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  // Expose spin method to parent if needed, but here we'll use a button inside or outside
  // For now, let's keep the logic here and trigger it via prop change or ref
  useEffect(() => {
    if (isSpinning && requestRef.current === null) {
      spin();
    }
  }, [isSpinning]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Pointer */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="w-8 h-10 bg-red-600 clip-path-triangle shadow-lg border-2 border-white rounded-t-sm" 
             style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full h-auto drop-shadow-2xl rounded-full border-8 border-white bg-white"
      />
      
      <motion.button
        onClick={() => !isSpinning && setIsSpinning(true)}
        disabled={isSpinning}
        whileHover={!isSpinning ? { scale: 1.1, backgroundColor: "#f9fafb" } : {}}
        whileTap={!isSpinning ? { scale: 0.9 } : {}}
        animate={!isSpinning ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            "0 20px 25px -5px rgba(79, 70, 229, 0.3), 0 10px 10px -5px rgba(79, 70, 229, 0.2)",
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          ]
        } : {}}
        transition={!isSpinning ? {
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg shadow-xl z-20 ${
          isSpinning 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-800 cursor-pointer'
        }`}
      >
        SPIN
      </motion.button>
    </div>
  );
};

export default SpinWheel;
