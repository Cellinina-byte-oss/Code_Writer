import { type SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  onChange: (value: string) => void;
}

export default function Select({
  options,
  onChange,
  className = '',
  ...props
}: SelectProps) {
  return (
    <select
      className={`select ${className}`}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
