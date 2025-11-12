import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(priority ? src : '');
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
    img.src = src;
  }, [src, priority]);

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
