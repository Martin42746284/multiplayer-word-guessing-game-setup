import { useEffect, useState } from 'react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  showWarning?: boolean;
  warningThreshold?: number;
}

export function Timer({
  initialSeconds,
  onTimeUp,
  showWarning = true,
  warningThreshold = 3,
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev - 1;
        if (newSeconds <= 0) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const isWarning = showWarning && seconds <= warningThreshold;

  return (
    <div
      className={`text-4xl font-bold tabular-nums transition-all duration-300 ${
        isWarning ? 'text-red-500 animate-pulse' : 'text-white'
      }`}
    >
      {minutes}:{displaySeconds.toString().padStart(2, '0')}
    </div>
  );
}
