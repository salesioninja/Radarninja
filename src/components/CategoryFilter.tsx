'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Filter, ChevronDown } from 'lucide-react';

const CATEGORIES = ['Todas', 'Alimentação', 'Serviços', 'Varejo', 'Lazer'];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-6 z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl input-cyber text-sm font-medium w-full md:w-[220px]"
      >
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--neon-cyan)]" />
          Filtros: <span className="text-[var(--neon-cyan)]">{selected}</span>
        </span>
        <ChevronDown className={cn("w-4 h-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full md:w-[220px] bg-[#0D0D12]/95 backdrop-blur-xl border border-[var(--neon-purple)]/40 rounded-xl overflow-hidden shadow-2xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelect(cat);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-5 py-3.5 text-sm transition-colors border-b border-white/5 last:border-0",
                selected === cat 
                  ? "bg-[var(--neon-purple)]/20 text-[#F0F4FF] font-bold" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
