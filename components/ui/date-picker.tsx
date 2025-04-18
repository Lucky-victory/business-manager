import { cn, generateUUID } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { memo, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "./calendar";
import { format } from "date-fns";

export const DatePickerField = memo(
  ({
    date,
    onDateChange,
    minDate,
    id,
  }: {
    date: Date | string;
    id?: string;
    onDateChange: (date: Date) => void;
    minDate?: Date | number;
  }) => {
    const popoverTriggerBtnRef = useRef<HTMLButtonElement | null>(null);
    const _id = useMemo(() => id || generateUUID(), [id]);
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
            id={_id}
            fromDate={minDate ? new Date(minDate) : undefined}
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
