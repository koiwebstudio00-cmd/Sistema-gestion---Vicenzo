import { useEffect, useRef, useState } from 'react';
import { CheckCircle, ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  label: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  value: string;
}

export const CustomSelect = ({ value, onChange, options, label }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        aria-label={label}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg px-4 py-2.5 cursor-pointer flex justify-between items-center focus:outline-none focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951]"
      >
        <span>{selectedOption?.label || 'Seleccionar...'}</span>
        <ChevronDown className={`h-4 w-4 text-[#8B949E] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map(option => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 cursor-pointer hover:bg-[#30363D]/50 flex items-center justify-between ${value === option.value ? 'text-[#C8A951] bg-[#30363D]/20' : 'text-[#E6EDF3]'}`}
            >
              <span>{option.label}</span>
              {value === option.value && <CheckCircle size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
