import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaymentTypeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PaymentTypeSelector({
  value,
  onChange,
}: PaymentTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select payment type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cash">Cash</SelectItem>
        <SelectItem value="card">Card</SelectItem>
        <SelectItem value="transfer">Bank Transfer</SelectItem>
        <SelectItem value="pos">POS</SelectItem>
      </SelectContent>
    </Select>
  );
}
