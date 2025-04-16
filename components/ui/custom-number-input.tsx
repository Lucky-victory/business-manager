import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Delete, Calculator, CornerDownLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

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
  const inputRef = useRef<HTMLDivElement>(null);
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

  // Handle value updates with proper propagation
  const updateValue = (newValue: string): void => {
    // Apply max length constraint
    if (newValue.length <= minValue) newValue = minValue + "";
    if (newValue.length > maxLength) return;

    setInternalValue(newValue);
    setFormattedValue(enableFormatting ? formatNumber(newValue) : newValue);
    onValueChange(newValue);
  };

  // Handle regular keyboard input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    // Create the regex pattern based on allowDecimal
    const regexPattern = allowDecimal ? /[^\d.]/g : /[^\d]/g;

    // Filter out non-numeric and (optionally) non-decimal characters
    const filteredValue = inputValue.replace(regexPattern, "");

    // Ensure only one decimal point if decimals are allowed
    if (allowDecimal) {
      const decimalCount = (filteredValue.match(/\./g) || []).length;
      if (decimalCount > 1) return;
    }

    updateValue(filteredValue);
  };

  const handleButtonClick = (digit: string): void => {
    // If decimal is not allowed and digit is a decimal point, ignore
    if (!allowDecimal && digit === ".") {
      return;
    }

    // Handle decimal point
    if (digit === "." && internalValue.includes(".")) {
      return;
    }

    const newValue = internalValue + digit;
    updateValue(newValue);
  };

  const handleBackspace = (): void => {
    const newValue = internalValue.slice(0, -1);
    updateValue(newValue);
  };

  const handleClear = (): void => {
    updateValue("");
  };

  const handleSubmit = (): void => {
    onSubmit(internalValue);
    setIsKeyboardVisible(false);
  };

  const toggleKeyboard = (): void => {
    setIsKeyboardVisible((prev) => !prev);
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

  const keyboardContent = (
    <Card
      className={`p-2 w-full shadow-lg animate-in fade-in ${
        isMobile
          ? "fixed bottom-0 left-0 right-0 max-w-full rounded-b-none z-50"
          : "relative"
      }`}
      ref={keyboardRef}
    >
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Button
            key={digit}
            variant="outline"
            className="h-16 text-2xl font-semibold hover:bg-gray-100"
            onClick={() => handleButtonClick(digit.toString())}
          >
            {digit}
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-16 flex items-center justify-center hover:bg-gray-100"
          onClick={() => handleButtonClick(".")}
          disabled={!allowDecimal}
        >
          .
        </Button>
        <Button
          variant="outline"
          className="h-16 text-2xl font-semibold hover:bg-gray-100"
          onClick={() => handleButtonClick("0")}
        >
          0
        </Button>
        <Button
          variant="outline"
          className="h-16 flex items-center justify-center hover:bg-gray-100"
          onClick={handleBackspace}
        >
          <Delete className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={() => setIsKeyboardVisible(false)}
        >
          Close
        </Button>
        <Button
          className="flex-1 h-12 text-lg font-medium"
          onClick={handleSubmit}
        >
          <CornerDownLeft className="mr-2 h-5 w-5" /> Submit
        </Button>
      </div>
    </Card>
  );
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
      <div className="w-full relative" ref={inputRef}>
        <Input
          type="text"
          inputMode={isMobile ? "none" : allowDecimal ? "decimal" : "numeric"}
          value={formattedValue}
          id={inputId}
          onChange={handleInputChange}
          className={cn("font-medium", className)}
          placeholder={placeholder}
          min={minValue}
          onFocus={() => isMobile && setIsKeyboardVisible(true)}
        />
        {!isMobile && (
          <Popover modal={true} open={isKeyboardVisible}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={toggleKeyboard}
              >
                <Calculator className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">{keyboardContent}</PopoverContent>
          </Popover>
        )}
      </div>

      {isKeyboardVisible && isMobile && <>{keyboardContent}</>}
    </div>
  );
}
