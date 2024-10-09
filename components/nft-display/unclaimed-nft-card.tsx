import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import styles from "./unclaimed-nft-card.module.css";

interface UnclaimedNftCardProps {
  charityName: string;
  backgroundImageUrl: string;
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

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.05 + Math.random() * 0.1,
      size: Math.random() * 2 + 0.5,
    }));

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
      className={styles.card}
      onClick={handleCardClick}
      style={
        {
          "--background-image": `url(${backgroundImageUrl})`,
        } as React.CSSProperties
      } // Set CSS variable here
    >
      <div className={styles.pixelatedBackground} />
      <div className={styles.overlay} />
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <CardContent className={styles.cardContent}>
        <motion.div animate={controls} className={styles.lockIcon}>
          <Lock />
        </motion.div>
        <p className={styles.title}>Missing NFT</p>
        <p className={styles.charityMessage}>
          Donate to {charityName} for a chance to claim this NFT and complete
          the set.
        </p>
        <p className={styles.limitedText}>Limited availability</p>
      </CardContent>
    </Card>
  );
};

export default UnclaimedNftCard;
