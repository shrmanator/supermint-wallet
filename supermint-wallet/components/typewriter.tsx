"use client";

import React, { useState, useEffect } from "react";

const TypeWriter = ({
  phrases = [
    "Welcome to my website",
    "Check out my portfolio",
    "Get in touch!",
  ],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (isPaused) {
          setIsPaused(false);
          setIsDeleting(true);
          return;
        }

        const currentPhrase = phrases[currentIndex];

        if (isDeleting) {
          setCurrentText(currentPhrase.substring(0, currentText.length - 1));

          if (currentText.length === 0) {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % phrases.length);
          }
        } else {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1));

          if (currentText.length === currentPhrase.length) {
            setIsPaused(true);
          }
        }
      },
      isPaused ? pauseDuration : isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentIndex,
    isDeleting,
    isPaused,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <div className="inline-block min-h-[1.5em]">
      <span className="text-lg font-mono">
        {currentText}
        <span className="animate-pulse">_</span>
      </span>
    </div>
  );
};

export default TypeWriter;
