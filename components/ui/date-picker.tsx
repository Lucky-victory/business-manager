import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { memo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "./calendar";
import { format } from "date-fns";

export const DatePickerField = memo(
  ({
    date,
    onDateChange,
  }: {
    date: Date | string;
    onDateChange: (date: Date) => void;
  }) => {
    const popoverTriggerBtnRef = useRef<HTMLButtonElement | null>(null);

    return (
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            ref={popoverTriggerBtnRef}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 bg-white">
          <Calendar
            mode="single"
            required
            id="date"
            selected={new Date(date)}
            onSelect={(selectedDate) => {
              if (selectedDate) onDateChange(selectedDate);
              popoverTriggerBtnRef.current?.click();
            }}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DatePickerField.displayName = "DatePickerField";
