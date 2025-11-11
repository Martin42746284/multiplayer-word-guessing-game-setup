import { useEffect, useState } from 'react';

interface AnswerRevealProps {
  answer: string;
  duration?: number;
  isCorrect?: boolean;
}

export function AnswerReveal({
  answer,
  duration = 2000,
  isCorrect = true,
}: AnswerRevealProps) {
  const [revealedLetters, setRevealedLetters] = useState(0);

  useEffect(() => {
    const letterDelay = duration / answer.length;
    let currentLetter = 0;

    const interval = setInterval(() => {
      currentLetter += 1;
      setRevealedLetters(currentLetter);

      if (currentLetter >= answer.length) {
        clearInterval(interval);
      }
    }, letterDelay);

    return () => clearInterval(interval);
  }, [answer, duration]);

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {answer.split('').map((letter, index) => (
        <div
          key={index}
          className={`w-12 h-12 flex items-center justify-center border-2 font-bold text-lg transition-all duration-300 ${
            index < revealedLetters
              ? `bg-green-100 border-green-500 text-green-700`
              : `bg-gray-100 border-gray-300 text-gray-300`
          }`}
        >
          {index < revealedLetters ? letter.toUpperCase() : ''}
        </div>
      ))}
    </div>
  );
}
