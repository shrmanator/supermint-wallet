"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollText } from "lucide-react";

export default function ScrollingBanner({
  text = "🌟 Welcome to SuperMint - Transforming charitable giving through NFTs",
  className,
}) {
  return (
    <div
      className={cn("w-full overflow-hidden bg-muted/50 border-b", className)}
    >
      <motion.div
        className="whitespace-nowrap py-2"
        initial={{ x: "100%" }}
        animate={{
          x: "-100%",
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "linear",
        }}
      >
        <div className="inline-flex items-center gap-2 px-4">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">{text}</span>
        </div>
      </motion.div>
    </div>
  );
}
