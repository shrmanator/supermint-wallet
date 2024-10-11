import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface CondensedUnclaimedNftCardProps {
  charityName: string;
}

const CondensedUnclaimedNftCard: React.FC<
  CondensedUnclaimedNftCardProps
> = ({}) => {
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.03 + Math.random() * 0.06,
      size: Math.random() * 1 + 0.3,
    }));

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
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleCardClick = async () => {
    await controls.start({
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4 },
    });
  };

  return (
    <Card
      className={cn(
        "relative flex items-center justify-center w-full h-full cursor-pointer",
        "hover:shadow-md transition-shadow duration-200"
      )}
      onClick={handleCardClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-20"
      />
      <CardContent className="relative flex flex-col items-center justify-center text-center">
        <motion.div
          animate={controls}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full mb-2",
            "border border-muted-foreground/20"
          )}
        >
          <Lock className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        <p className="text-xs font-medium leading-tight text-muted-foreground">
          Donate to complete set
        </p>
      </CardContent>
    </Card>
  );
};

export default CondensedUnclaimedNftCard;
