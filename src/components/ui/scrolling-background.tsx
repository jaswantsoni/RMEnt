import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScrollingBackgroundProps {
  images: string[];
  interval?: number; // in milliseconds
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
}

export const ScrollingBackground = ({
  images,
  interval = 5000, // default to 5 seconds
  className,
  imageClassName,
  overlayClassName,
}: ScrollingBackgroundProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={cn("fixed inset-0 -z-10", className)}>
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt={`Background image ${index + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={cn("absolute inset-0 w-full h-full object-cover", imageClassName)}
        />
      </AnimatePresence>
      <div className={cn("absolute inset-0 bg-gradient-to-b from-black/50 via-background/80 to-background/95", overlayClassName)} />
    </div>
  );
};