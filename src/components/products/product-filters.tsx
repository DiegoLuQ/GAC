'use client';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

type ProductFiltersProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  allTags,
  selectedTags,
  setSelectedTags,
}: ProductFiltersProps) {
  
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 1000]);
    setSelectedTags([]);
  };

  const areFiltersActive = searchTerm !== '' || priceRange[0] !== 0 || priceRange[1] !== 1000 || selectedTags.length > 0;

  return (
    <div className="mb-12 rounded-xl border bg-card p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-4">
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-muted-foreground">
            Buscar por descripción
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Ej: Ánfora de cerámica..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="md:col-span-5">
          <label htmlFor="price" className="mb-2 block text-sm font-medium text-muted-foreground">
            Rango de precios
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium w-12 text-right">${priceRange[0]}</span>
            <Slider
              value={priceRange}
              onValueChange={value => setPriceRange(value as [number, number])}
              max={1000}
              step={10}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12">${priceRange[1]}</span>
          </div>
        </div>
        <div className="md:col-span-3 flex items-end justify-end h-full">
            {areFiltersActive && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Limpiar filtros
                </Button>
            )}
        </div>
      </div>
      <div className="mt-6 border-t pt-4">
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">Filtrar por etiquetas</h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
              onClick={() => toggleTag(tag)}
              className="cursor-pointer transition-all hover:scale-105"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
