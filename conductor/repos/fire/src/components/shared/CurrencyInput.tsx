"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  id,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(value > 0 ? value.toLocaleString() : "");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, "");
      setDisplay(raw);
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        onChange(num);
      } else if (raw === "") {
        onChange(0);
      }
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    if (value > 0) {
      setDisplay(value.toLocaleString());
    } else {
      setDisplay("");
    }
  }, [value]);

  const handleFocus = useCallback(() => {
    if (value > 0) {
      setDisplay(String(value));
    }
  }, [value]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        $
      </span>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={`pl-7 ${className || ""}`}
      />
    </div>
  );
}
