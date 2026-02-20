import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Use theme-aware colors - subtle monochrome rain
    const isDark = document.documentElement.classList.contains('dark');
    
    const chars = 'IWALA99アイウエオカキクケコ0123456789ABCDEF';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      
      // Very subtle background fade
      ctx.fillStyle = isDarkNow 
        ? 'rgba(10, 13, 18, 0.06)' 
        : 'rgba(252, 252, 253, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px JetBrains Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Theme-aware color: muted foreground tone
        const alpha = Math.random() * 0.3 + 0.1;
        ctx.fillStyle = isDarkNow 
          ? `rgba(140, 150, 165, ${alpha})`
          : `rgba(80, 90, 110, ${alpha})`;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 transition-opacity duration-700"
      style={{ zIndex: 0 }}
    />
  );
};

export default MatrixRain;
