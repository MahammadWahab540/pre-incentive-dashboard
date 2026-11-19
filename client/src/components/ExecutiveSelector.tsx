import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, UserCheck, AlertCircle } from 'lucide-react';
import { Executive } from '../types';

interface ExecutiveSelectorProps {
  executives: Executive[];
  selectedExecutive: Executive | null;
  onSelect: (executive: Executive | null) => void;
  isLoading: boolean;
  error?: string | null;
}

export const ExecutiveSelector: React.FC<ExecutiveSelectorProps> = ({
  executives,
  selectedExecutive,
  onSelect,
  isLoading,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredExecutives = executives.filter((exec) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      exec.name.toLowerCase().includes(term) ||
      exec.email.toLowerCase().includes(term)
    );
  });

  const handleSelect = (executive: Executive) => {
    onSelect(executive);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6E73] mb-1.5">
        Select Relationship Executive
      </label>

      {/* Main Trigger / Search Container */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`group relative flex items-center w-full min-h-[48px] px-3.5 py-2 bg-white border rounded-2xl cursor-pointer transition-all duration-200 shadow-sm ${
          isOpen
            ? 'border-[#0071E3] ring-4 ring-[#0071E3]/10 shadow-md'
            : 'border-[#D2D2D7] hover:border-[#86868B]'
        }`}
      >
        <Search className={`w-4 h-4 mr-2.5 transition-colors ${isOpen ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />

        <div className="flex-1 flex items-center min-w-0">
          {selectedExecutive && !isOpen ? (
            <div className="flex items-center space-x-2 truncate">
              <span className="font-medium text-[#1D1D1F] text-sm truncate">
                {selectedExecutive.name}
              </span>
              <span className="text-xs text-[#86868B] truncate">
                ({selectedExecutive.email})
              </span>
            </div>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={
                selectedExecutive
                  ? `Selected: ${selectedExecutive.name} (type to search...)`
                  : 'Search by name or email across all executives...'
              }
              className="w-full bg-transparent border-none p-0 text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-0"
            />
          )}
        </div>

        <div className="flex items-center ml-2 space-x-1">
          {selectedExecutive && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear selection"
              className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#86868B] transition-transform duration-200 ${
              isOpen ? 'transform rotate-180 text-[#1D1D1F]' : ''
            }`}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-1.5 flex items-center text-xs text-rose-600 gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-[#D2D2D7] rounded-2xl shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-[#E8E8ED] bg-[#F5F5F7]/50 flex items-center justify-between text-xs text-[#86868B] px-3">
            <span>
              {isLoading
                ? 'Loading executives...'
                : `${filteredExecutives.length} executive${filteredExecutives.length === 1 ? '' : 's'} found`}
            </span>
            <span className="text-[11px] font-medium text-[#0071E3]">
              {selectedExecutive ? 'Click to change' : 'Select an executive'}
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-transparent">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-[#86868B]">
                <div className="inline-block w-5 h-5 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mb-2" />
                <p>Loading executive directory...</p>
              </div>
            ) : filteredExecutives.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#86868B]">
                No executives match "{searchTerm}"
              </div>
            ) : (
              filteredExecutives.map((exec) => {
                const isSelected = selectedExecutive?.id === exec.id;
                return (
                  <button
                    key={exec.id}
                    type="button"
                    onClick={() => handleSelect(exec)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#0071E3] text-white font-medium'
                        : 'hover:bg-[#F5F5F7] text-[#1D1D1F]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-medium truncate">
                          {exec.name}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate ${
                          isSelected ? 'text-blue-100' : 'text-[#86868B]'
                        }`}
                      >
                        {exec.email}
                      </p>
                    </div>

                    {isSelected && (
                      <UserCheck className="w-4 h-4 text-white flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
