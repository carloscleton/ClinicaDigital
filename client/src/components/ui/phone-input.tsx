import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export function PhoneInput({ value = "", onChange, placeholder = "55(84) 9 99807-1213", className, id, disabled }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Format number for display: 5584998071213 -> 55(84) 9 99807-1213
  const formatPhoneDisplay = (rawValue: string): string => {
    // Remove all non-digits
    let digits = rawValue.replace(/\D/g, "");
    
    // Always ensure it starts with 55
    if (digits.length === 0) return "";
    if (!digits.startsWith("55")) {
      digits = "55" + digits;
    }
    
    // Limit to 13 digits max (55 + 11 digits)
    digits = digits.slice(0, 13);
    
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}(${digits.slice(2)}`;
    if (digits.length <= 5) return `${digits.slice(0, 2)}(${digits.slice(2, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 10) return `${digits.slice(0, 2)}(${digits.slice(2, 4)}) ${digits.slice(4, 5)} ${digits.slice(5)}`;
    
    // Full format: 55(84) 9 99807-1213
    return `${digits.slice(0, 2)}(${digits.slice(2, 4)}) ${digits.slice(4, 5)} ${digits.slice(5, 10)}-${digits.slice(10)}`;
  };

  // Extract raw digits from formatted string
  const extractRawDigits = (formattedValue: string): string => {
    return formattedValue.replace(/\D/g, "");
  };

  // Update display value when prop value changes
  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatPhoneDisplay(value));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let rawDigits = extractRawDigits(inputValue);
    
    // If user is typing and doesn't start with 55, prepend it
    if (rawDigits.length > 0 && !rawDigits.startsWith("55")) {
      rawDigits = "55" + rawDigits;
    }
    
    // Limit to 13 digits (55 + 11 digits)
    const limitedDigits = rawDigits.slice(0, 13);
    
    // Format for display
    const formatted = formatPhoneDisplay(limitedDigits);
    setDisplayValue(formatted);
    
    // Send raw digits to parent component
    if (onChange) {
      onChange(limitedDigits);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
      return;
    }
    
    // Allow arrow keys
    if (e.keyCode >= 35 && e.keyCode <= 40) {
      return;
    }
    
    // Ensure that it's a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      maxLength={18} // Formatted length: 55(84) 9 9807-1213
    />
  );
}