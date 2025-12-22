import { cn } from "@/lib/utils";

interface BackgroundProps {
  imageUrl: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
}

export const Background = ({ imageUrl, alt, className, imageClassName, overlayClassName }: BackgroundProps) => {
  return (
    <div className={cn("absolute inset-0", className)}>
      <img
        src={imageUrl}
        alt={alt}
        className={cn("w-full h-full object-cover", imageClassName)}
      />
      <div className={cn("absolute inset-0 bg-gradient-to-b from-black/50 via-background/80 to-background", overlayClassName)} />
    </div>
  );
};