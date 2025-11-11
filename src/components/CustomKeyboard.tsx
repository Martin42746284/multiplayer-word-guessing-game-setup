import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CustomKeyboardProps {
  onInput: (letter: string) => void;
  onSubmit: () => void;
  onBackspace: () => void;
  isSubmitDisabled?: boolean;
  answerLength?: number;
  correctAnswerLength?: number;
}

export function CustomKeyboard({
  onInput,
  onSubmit,
  onBackspace,
  isSubmitDisabled = true,
  answerLength = 0,
  correctAnswerLength = 0,
}: CustomKeyboardProps) {
  const [canSubmit, setCanSubmit] = useState(!isSubmitDisabled);

  useEffect(() => {
    setCanSubmit(!isSubmitDisabled && answerLength === correctAnswerLength);
  }, [isSubmitDisabled, answerLength, correctAnswerLength]);

  const rows = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
    ['U', 'V', 'W', 'X', 'Y', 'Z', ' ', '0', '1', '2'],
    ['3\', \'4\', \'5\', \'6\', \'7\', \'8\', \'9\', "-", "\'", ".'],
  ];

  const handleKeyPress = (letter: string) => {
    onInput(letter);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg space-y-3">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center flex-wrap">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors duration-200 min-w-12 text-center"
            >
              {key === ' ' ? '␣' : key}
            </button>
          ))}
        </div>
      ))}

      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={onBackspace}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded transition-colors duration-200 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Effacer
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`px-8 py-2 font-semibold rounded transition-colors duration-200 ${
            canSubmit
              ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Valider
        </button>
      </div>

      {answerLength > 0 && correctAnswerLength > 0 && (
        <div className="text-center text-sm text-gray-600 mt-2">
          {answerLength} / {correctAnswerLength}
        </div>
      )}
    </div>
  );
}
