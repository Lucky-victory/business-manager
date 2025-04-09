import { useStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DebtorSelectorProps = {
  debtorId: string;
  onSelect: (debtorId: string, debtorName: string) => void;
};

export function DebtorSelector({ debtorId, onSelect }: DebtorSelectorProps) {
  const { debtors } = useStore();

  return (
    <Select
      value={debtorId}
      onValueChange={(value) => {
        const debtor = debtors.find((d) => d.id === value);
        onSelect(value, debtor?.name || "");
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select debtor" />
      </SelectTrigger>
      <SelectContent>
        {debtors.map((debtor) => (
          <SelectItem key={debtor.id} value={debtor.id}>
            {debtor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
