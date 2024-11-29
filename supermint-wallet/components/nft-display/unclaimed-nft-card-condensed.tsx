import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCharityUrl } from "@/contexts/charity-context";

interface CondensedUnclaimedNftCardProps {
  charityName: string;
}

const CondensedUnclaimedNftCard: React.FC<CondensedUnclaimedNftCardProps> = ({
  charityName,
}) => {
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const charityUrl = useCharityUrl(charityName);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.03 + Math.random() * 0.06,
      size: Math.random() * 1 + 0.3,
    }));

    let animationFrame: number;

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        if (particle.y < 0) particle.y = canvas.height;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleCardClick = async () => {
    await controls.start({
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4 },
    });

    if (charityUrl) {
      window.open(charityUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      className={cn(
        "w-full h-full",
        "bg-black/40 border-white/10",
        "hover:shadow-md transition-shadow duration-200 cursor-pointer"
      )}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center max-w-[80%]">
            <motion.div
              animate={controls}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mb-2"
            >
              <ExternalLink className="h-4 w-4 text-white/60" />
            </motion.div>
            <p className="text-xs text-white/60 text-center">
              Donate to unlock an NFT
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CondensedUnclaimedNftCard;
