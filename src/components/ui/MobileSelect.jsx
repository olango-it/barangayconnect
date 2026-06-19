/**
 * MobileSelect — Renders a bottom-sheet Drawer on mobile,
 * falls back to the standard Radix Select on desktop.
 */
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";

/**
 * Props:
 *  value        - current value
 *  onValueChange - callback(value)
 *  placeholder  - placeholder string
 *  options      - [{ value, label }]
 *  className    - optional className for the trigger
 *  disabled     - boolean
 */
export default function MobileSelect({ value, onValueChange, placeholder = "Select…", options = [], className, disabled }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
          >
            <span className={selectedLabel ? "" : "text-muted-foreground"}>
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-sm text-muted-foreground">{placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="pb-6 px-4 space-y-1 max-h-[60vh] overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onValueChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors
                  ${opt.value === value ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
              >
                {opt.label}
                {opt.value === value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}