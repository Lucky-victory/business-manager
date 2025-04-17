// src/components/ui/custom-number-input/numeric-keyboard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Delete, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumericKeyboardProps {
  onDigitClick: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  onClose: () => void;
  allowDecimal?: boolean;
  className?: string;
}

export function NumericKeyboard({
  onDigitClick,
  onBackspace,
  onClear,
  onSubmit,
  onClose,
  allowDecimal = true,
  className,
}: NumericKeyboardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent keyboard events from propagating
    e.stopPropagation();

    // Handle numeric keys
    if (!isNaN(parseInt(e.key, 10))) {
      onDigitClick(e.key);
      return;
    }

    // Handle special keys
    switch (e.key) {
      case ".":
        if (allowDecimal) onDigitClick(".");
        break;
      case "Backspace":
        onBackspace();
        break;
      case "Enter":
        onSubmit();
        break;
      case "Escape":
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <Card
      className={cn("p-2 w-full shadow-lg animate-in fade-in", className)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <KeypadButton
            key={digit}
            onClick={() => onDigitClick(digit.toString())}
          >
            {digit}
          </KeypadButton>
        ))}
        <KeypadButton
          onClick={() => onDigitClick(".")}
          disabled={!allowDecimal}
        >
          .
        </KeypadButton>
        <KeypadButton onClick={() => onDigitClick("0")}>0</KeypadButton>
        <KeypadButton onClick={() => onDigitClick("00")}>00</KeypadButton>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="destructive"
          className="h-10"
          onClick={onClear}
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 flex items-center justify-center"
          onClick={onBackspace}
        >
          <Delete className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          className="h-10 flex items-center justify-center"
          onClick={onSubmit}
        >
          <CornerDownLeft className="h-5 w-5 mr-1" />
          Enter
        </Button>
      </div>
    </Card>
  );
}

interface KeypadButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function KeypadButton({
  children,
  onClick,
  disabled = false,
}: KeypadButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 text-2xl font-semibold hover:bg-gray-100"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
