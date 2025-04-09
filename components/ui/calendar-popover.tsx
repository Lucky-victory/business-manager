"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface CalendarFormProps {
  label?: string;
  onSelect: (date: Date | undefined) => void;
  name: string;
  defaultValue: Date | string;
  calendarProps: Partial<CalendarProps>;
}
export function CalendarForm({
  name,
  label,
  calendarProps,
  defaultValue,
  onSelect,
}: CalendarFormProps) {
  const [value, setValue] = useState(new Date(defaultValue));

  function handleDateSelect(date: Date | undefined) {
    (date: Date | undefined) => {
      setValue(date as Date);
      onSelect(date);
      console.log({
        date,
        value,
      });
    };
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? format(value, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        
        <Calendar
          mode="single"
          selected={value}
          required
          onSelect={handleDateSelect}
          initialFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
