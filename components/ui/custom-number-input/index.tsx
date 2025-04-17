import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NumericKeyboard } from "./numeric-keyboard";

// Define the component props interface
interface CustomNumberInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  allowDecimal?: boolean;
  enableFormatting?: boolean;
  maxLength?: number;
  inputId?: string;
  minValue?: number;
  className?: string;
}

export default function CustomNumberInput({
  value: externalValue = "",
  onValueChange = (val: string) => {},
  onSubmit = (val: string) => {},
  placeholder = "Enter number",
  allowDecimal = true,
  inputId,
  enableFormatting = true,
  maxLength = 20,
  minValue = 0,
  className,
}: CustomNumberInputProps) {
  const [internalValue, setInternalValue] = useState<string>(externalValue);
  const [formattedValue, setFormattedValue] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Update internal state when external value changes
  useEffect(() => {
    setInternalValue(externalValue);
    setFormattedValue(
      enableFormatting ? formatNumber(externalValue) : externalValue
    );
  }, [externalValue, enableFormatting]);

  // Format number with commas and handle decimals
  const formatNumber = (num: string): string => {
    if (!num) return "";

    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  };

  // Transform formatted value back to raw number
  const unformatNumber = (formattedNum: string): string => {
    return formattedNum.replace(/,/g, "");
  };

  // Calculate cursor position adjustment for formatted values
  const getAdjustedCursorPosition = (
    value: string,
    rawValue: string,
    cursorPos: number
  ): number => {
    if (!enableFormatting) return cursorPos;

    // Count commas before the cursor in the formatted value
    let commaCount = 0;
    for (let i = 0; i < cursorPos && i < value.length; i++) {
      if (value[i] === ",") commaCount++;
    }

    return cursorPos - commaCount;
  };

  // Calculate cursor position for formatted values
  const getFormattedCursorPosition = (
    rawValue: string,
    formattedValue: string,
    rawCursorPos: number
  ): number => {
    if (!enableFormatting) return rawCursorPos;

    // Count digits and calculate where the cursor should be in formatted value
    let digitsBeforeCursor = 0;
    let formattedPos = 0;

    for (let i = 0; i < rawValue.length; i++) {
      if (i === rawCursorPos) break;
      digitsBeforeCursor++;
    }

    // Find the corresponding position in formatted value
    let countedDigits = 0;
    for (let i = 0; i < formattedValue.length; i++) {
      if (formattedValue[i] !== ",") countedDigits++;
      if (countedDigits > digitsBeforeCursor) break;
      formattedPos++;
    }

    return formattedPos;
  };

  // Handle value updates with proper propagation and cursor position
  const updateValue = (newValue: string, newCursorPosition?: number): void => {
    // Apply min value constraint
    if (parseFloat(newValue) < minValue && newValue !== "") {
      newValue = minValue.toString();
    }

    // Apply max length constraint
    if (newValue.length > maxLength) return;

    const formattedNewValue = enableFormatting
      ? formatNumber(newValue)
      : newValue;

    // Calculate cursor position in formatted value
    const updatedCursorPos =
      newCursorPosition !== undefined
        ? getFormattedCursorPosition(
            newValue,
            formattedNewValue,
            newCursorPosition
          )
        : formattedNewValue.length;

    setInternalValue(newValue);
    setFormattedValue(formattedNewValue);
    setCursorPosition(updatedCursorPos);
    onValueChange(newValue);

    // Set the cursor position after DOM update
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = updatedCursorPos;
        inputRef.current.selectionEnd = updatedCursorPos;
      }
    }, 0);
  };

  // Handle regular keyboard input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const rawValue = enableFormatting
      ? unformatNumber(e.target.value)
      : e.target.value;

    // Get cursor position accounting for formatting
    const cursorPos = e.target.selectionStart || 0;
    const adjustedCursorPos = getAdjustedCursorPosition(
      e.target.value,
      rawValue,
      cursorPos
    );

    // Create the regex pattern based on allowDecimal
    const regexPattern = allowDecimal ? /[^\d.]/g : /[^\d]/g;

    // Filter out non-numeric and (optionally) non-decimal characters
    const filteredValue = rawValue.replace(regexPattern, "");

    // Ensure only one decimal point if decimals are allowed
    if (allowDecimal) {
      const decimalCount = (filteredValue.match(/\./g) || []).length;
      if (decimalCount > 1) return;
    }

    updateValue(filteredValue, adjustedCursorPos);
  };

  // Handle input from custom keyboard
  const handleKeyboardInput = (input: string): void => {
    let newValue: string;
    let newCursorPos: number;

    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;

      // Get the raw value (without formatting)
      const currentRawValue = unformatNumber(formattedValue);

      // Calculate the cursor position in the raw value
      const rawStart = getAdjustedCursorPosition(
        formattedValue,
        currentRawValue,
        start
      );

      // Insert the new input at cursor position
      newValue =
        currentRawValue.substring(0, rawStart) +
        input +
        currentRawValue.substring(
          end === start
            ? rawStart
            : getAdjustedCursorPosition(formattedValue, currentRawValue, end)
        );

      // Calculate new cursor position
      newCursorPos = rawStart + input.length;
    } else {
      newValue = internalValue + input;
      newCursorPos = newValue.length;
    }

    // Handle decimal input validation
    if (input === "." && !allowDecimal) return;
    if (input === "." && internalValue.includes(".")) return;

    updateValue(newValue, newCursorPos);

    // Focus the input after updating
    inputRef.current?.focus();
  };

  const handleBackspace = (): void => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;

      // Get the raw value (without formatting)
      const currentRawValue = unformatNumber(formattedValue);

      // Calculate the cursor position in the raw value
      const rawStart = getAdjustedCursorPosition(
        formattedValue,
        currentRawValue,
        start
      );
      const rawEnd = getAdjustedCursorPosition(
        formattedValue,
        currentRawValue,
        end
      );

      let newValue: string;
      let newCursorPos: number;

      if (start === end) {
        // No selection, just delete one character before cursor
        if (start > 0) {
          newValue =
            currentRawValue.substring(0, rawStart - 1) +
            currentRawValue.substring(rawStart);
          newCursorPos = rawStart - 1;
        } else {
          // Cursor at beginning, nothing to delete
          return;
        }
      } else {
        // Delete the selected text
        newValue =
          currentRawValue.substring(0, rawStart) +
          currentRawValue.substring(rawEnd);
        newCursorPos = rawStart;
      }

      updateValue(newValue, newCursorPos);
    } else {
      // Fallback if input ref not available
      const newValue = internalValue.slice(0, -1);
      updateValue(newValue);
    }

    // Focus the input after updating
    inputRef.current?.focus();
  };

  const handleClear = (): void => {
    updateValue("");
    inputRef.current?.focus();
  };

  const handleSubmit = (): void => {
    onSubmit(internalValue);
    setIsKeyboardVisible(false);
  };

  const toggleKeyboard = (): void => {
    setIsKeyboardVisible((prev) => !prev);
  };

  // Update cursor position on input focus/click
  const handleInputFocus = () => {
    if (isMobile) {
      setIsKeyboardVisible(true);
    }

    // Save current cursor position
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleInputClick = () => {
    // Save current cursor position
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  // Close keyboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        keyboardRef.current &&
        !keyboardRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsKeyboardVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
      <div className="w-full relative">
        <Input
          ref={inputRef}
          type="text"
          inputMode={isMobile ? "none" : allowDecimal ? "decimal" : "numeric"}
          value={formattedValue}
          id={inputId}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
          onClick={handleInputClick}
          className={cn("font-medium", className)}
          placeholder={placeholder}
          min={minValue}
        />
        {!isMobile && (
          <Popover modal={true} open={isKeyboardVisible}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={toggleKeyboard}
              >
                <Calculator className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80"
              ref={keyboardRef}
              align="end"
              sideOffset={8}
            >
              <NumericKeyboard
                onDigitClick={handleKeyboardInput}
                onBackspace={handleBackspace}
                onClear={handleClear}
                onSubmit={handleSubmit}
                onClose={() => setIsKeyboardVisible(false)}
                allowDecimal={allowDecimal}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {isKeyboardVisible && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50" ref={keyboardRef}>
          <NumericKeyboard
            onDigitClick={handleKeyboardInput}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onSubmit={handleSubmit}
            onClose={() => setIsKeyboardVisible(false)}
            allowDecimal={allowDecimal}
            className="rounded-b-none"
          />
        </div>
      )}
    </div>
  );
}
