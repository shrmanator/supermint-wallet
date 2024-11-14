import React, { useState, useEffect, useRef } from "react";

interface FlickeringAsciiBannerProps {
  onAnimationComplete?: () => void;
  loopCount?: number;
  textSpacing?: string; // Custom spacing class
}

const asciiBanner = `
        _____                    _____                 
       /\\    \\                  /\\    \\                
      /::\\    \\                /::\\____\\               
     /::::\\    \\              /::::|   |               
    /::::::\\    \\            /:::::|   |               
   /:::/\\:::\\    \\          /::::::|   |               
  /:::/__\\:::\\    \\        /:::/|::|   |               
  \\:::\\   \\:::\\    \\      /:::/ |::|   |               
___\\:::\\   \\:::\\    \\    /:::/  |::|___|______         
/\\   \\:::\\   \\:::\\    \\  /:::/   |::::::::\\    \\        
/::\\   \\:::\\   \\:::\\____\\/:::/    |:::::::::\\____\\      
\\:::\\   \\:::\\   \\::/    /\\::/    / ~~~~~/:::/    /      
 \\:::\\   \\:::\\   \\/____/  \\/____/      /:::/    /       
  \\:::\\   \\:::\\    \\                  /:::/    /        
   \\:::\\   \\:::\\____\\                /:::/    /         
    \\:::\\  /:::/    /               /:::/    /          
     \\:::\\/:::/    /               /:::/    /           
      \\::::::/    /               /:::/    /            
       \\::::/    /               /:::/    /             
        \\::/    /                \\::/    /              
         \\/____/                  \\/____/               
`;

const FlickeringAsciiBanner: React.FC<FlickeringAsciiBannerProps> = ({
  onAnimationComplete,
  loopCount = Infinity,
  textSpacing = "-mt-12", // Default negative margin to bring text closer
}) => {
  const [activeChars, setActiveChars] = useState<Set<number>>(new Set());
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = asciiBanner.split("");
    const flickerableIndices = chars.reduce((acc, char, index) => {
      if (char !== " " && char !== "\n") acc.push(index);
      return acc;
    }, [] as number[]);

    let currentLoop = 0;
    const intervalId = setInterval(() => {
      setActiveChars((prev) => {
        const newSet = new Set(prev);
        const randomIndex = Math.floor(
          Math.random() * flickerableIndices.length
        );
        const charIndex = flickerableIndices[randomIndex];

        if (newSet.has(charIndex)) {
          newSet.delete(charIndex);
        } else {
          newSet.add(charIndex);
        }

        return newSet;
      });

      currentLoop++;
      if (currentLoop >= loopCount) {
        clearInterval(intervalId);
        if (onAnimationComplete) onAnimationComplete();
      }
    }, 4);

    return () => clearInterval(intervalId);
  }, [onAnimationComplete, loopCount]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const aspectRatio = containerWidth / containerHeight;
        const targetAspectRatio = 2; // Adjust this value to change the target aspect ratio

        let newScale;
        if (aspectRatio > targetAspectRatio) {
          newScale = containerHeight / 400; // Adjust 400 based on your ASCII art's original height
        } else {
          newScale = containerWidth / 800; // Adjust 800 based on your ASCII art's original width
        }

        setScale(Math.min(newScale, 1)); // Limit the maximum scale to 1
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <div
          className="transform origin-center"
          style={{ transform: `scale(${scale})` }}
        >
          <pre
            className="font-mono inline-block p-3 whitespace-pre text-center"
            style={{
              fontSize: "11px",
              lineHeight: "1em",
            }}
          >
            {asciiBanner.split("").map((char, index) => (
              <span
                key={index}
                style={{ color: activeChars.has(index) ? "white" : "black" }}
              >
                {char}
              </span>
            ))}
          </pre>
        </div>
        <div
          className={`text-white font-poppins text-center w-full text-sm sm:text-base md:text-lg ${textSpacing}`}
        >
          Loading, please wait...
        </div>
      </div>
    </div>
  );
};

export default FlickeringAsciiBanner;
