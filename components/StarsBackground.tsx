"use client";

import { useEffect, useRef } from "react";

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: { x: number; y: number; radius: number; alpha: number; speed: number; direction: number }[] = [];
    const numStars = 120;

    function initStars() {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 2,
          alpha: Math.random(),
          speed: 0.005 + Math.random() * 0.02, // twinkling speed
          direction: Math.random() > 0.5 ? 1 : -1, // fade in/out
        });
      }
    }

    function drawStars() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.alpha += star.speed * star.direction;

        // reverse direction when hitting alpha bounds
        if (star.alpha <= 0.1) {
          star.alpha = 0.1;
          star.direction = 1;
        } else if (star.alpha >= 1) {
          star.alpha = 1;
          star.direction = -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(drawStars);
    }

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    resizeCanvas();
    drawStars();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-black"
    />
  );
}
