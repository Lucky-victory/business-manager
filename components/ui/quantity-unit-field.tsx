import { SaleInsert } from "@/lib/store";
import { memo, useMemo } from "react";
import CustomNumberInput from "./custom-number-input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { generateUUID } from "@/lib/utils";

const units = [
  {
    name: "Kilogram",
    value: "kg",
  },
  {
    name: "Gram",
    value: "g",
  },
  {
    name: "Liter",
    value: "ltr",
  },
  { name: "Pieces", value: "pcs" },
  {
    name: "Packs",
    value: "pks",
  },
  {
    name: "Bags",
    value: "bg",
  },
  {
    name: "Dozens",
    value: "dz",
  },
];
export const QuantityUnitField = memo(
  ({
    quantity,
    measurementUnit,
    onQuantityChange,
    onUnitChange,
  }: {
    quantity: number;
    measurementUnit: SaleInsert["measurementUnit"];
    onQuantityChange: (value: number) => void;
    onUnitChange: (value: string) => void;
  }) => {
    const { unitId, quantityId } = useMemo(() => {
      return {
        unitId: generateUUID(),
        quantityId: generateUUID(),
      };
    }, []);
    return (
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={quantityId}>Quantity</Label>
          <CustomNumberInput
            inputId={quantityId}
            placeholder="Quantity"
            enableFormatting={false}
            allowDecimal={false}
            value={quantity + ""}
            minValue={1}
            onValueChange={(val) => {
              onQuantityChange(
                isNaN(parseInt(val, 10)) ? 1 : parseInt(val, 10)
              );
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={unitId}>Unit</Label>
          <Select
            value={measurementUnit as string}
            onValueChange={onUnitChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent id={unitId}>
              {units.map((unit) => {
                return (
                  <SelectItem value={unit.value} key={unit.value}>
                    {unit.name}
                    {`(${unit.value})`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
);
QuantityUnitField.displayName = "QuantityUnitField";
