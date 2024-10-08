import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

interface UnclaimedNftCardProps {
  charityName: string;
  backgroundImageUrl: string; // New prop for background image
}

const UnclaimedNftCard: React.FC<UnclaimedNftCardProps> = ({
  charityName,
  backgroundImageUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      speed: number;
      size: number;
    }> = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.05 + Math.random() * 0.1,
        size: Math.random() * 2 + 0.5,
      });
    }

    function animate() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleCardClick = async () => {
    await controls.start({
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    });
  };

  return (
    <Card
      className="h-full relative overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Pixelated background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          filter: "blur(10px)",
          transform: "scale(1.1)", // Slightly scale up to avoid blur edges
        }}
      />
      {/* Darkening overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* Particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Card content */}
      <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center relative z-10">
        <motion.div animate={controls} className="mb-3">
          <Lock className="w-10 h-10 text-white" />
        </motion.div>
        <p className="font-semibold mb-2 text-white">Unclaimed NFT</p>
        <p className="text-xs text-gray-200 mb-2">
          Complete your set by donating to {charityName}
        </p>
        <p className="text-xs font-medium text-yellow-300">
          Limited availability
        </p>
      </CardContent>
    </Card>
  );
};

export default UnclaimedNftCard;
