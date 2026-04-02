import { useEffect, useRef } from "react";

const COLORS = [
  "#fbbf24",
  "#f472b6",
  "#60a5fa",
  "#34d399",
  "#f87171",
  "#a78bfa",
];

function spawnParticle(x, y, W) {
  // Spread angle: shoot mostly upward with horizontal spread
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
  const speed = Math.random() * 14 + 8;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    w: Math.random() * 9 + 4,
    h: Math.random() * 5 + 3,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.25,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: 1,
  };
}

export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);

    const GRAVITY = 0.45;
    const DRAG = 0.99; // velocity multiplier per frame (air resistance)

    // Two cannons at bottom-left and bottom-right corners
    const particles = [
      ...Array.from({ length: 50 }, () => spawnParticle(W * 0.1, H, W)),
      ...Array.from({ length: 50 }, () => spawnParticle(W * 0.9, H, W)),
    ];

    let raf;

    function tick() {
      ctx.clearRect(0, 0, W, H);

      let anyAlive = false;

      for (const p of particles) {
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Fade out after peak (when falling)
        if (p.vy > 1) p.opacity -= 0.014;

        if (p.opacity > 0 && p.y < H + 30) {
          anyAlive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (anyAlive) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
