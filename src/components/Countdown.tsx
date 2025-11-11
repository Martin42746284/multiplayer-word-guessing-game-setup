import { useEffect, useState } from 'react';

interface CountdownProps {
  from: number;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function Countdown({ from, onComplete, size = 'md' }: CountdownProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (count <= 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-7xl',
    lg: 'text-9xl',
  };

  return (
    <div className={`${sizeClasses[size]} font-bold text-red-500 animate-bounce`}>
      {count}
    </div>
  );
}
