'use client';

import { useState, useMemo } from 'react';
import type { Product, Settings } from '@/types';
import { ProductCard } from './product-card';
import { ProductFilters } from './product-filters';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ProductListProps = {
  initialProducts: Product[];
  settings: Settings;
};

const PRODUCTS_PER_PAGE = 12;

export function ProductList({ initialProducts, settings }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialProducts.forEach(product => {
      product.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    setCurrentPage(1); // Reset page when filters change
    return initialProducts.filter(product => {
      const searchMatch =
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase());
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => product.tags.includes(tag));
      return searchMatch && priceMatch && tagMatch;
    });
  }, [initialProducts, searchTerm, priceRange, selectedTags]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
       const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="products" className="container mx-auto max-w-screen-xl px-4">
      <div className="relative mb-12 text-center">
        <h2 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl font-headline">
          Nuestro Catálogo
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Explora nuestra selección de ánforas conmemorativas, diseñadas con amor y respeto para honrar a tu fiel compañero.
        </p>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        allTags={allTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} settings={settings} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-16 text-center">
          <h3 className="text-2xl font-semibold font-headline">No se encontraron productos</h3>
          <p className="mt-2 text-muted-foreground">Intenta ajustar tus filtros de búsqueda para encontrar la pieza perfecta.</p>
        </div>
      )}
    </section>
  );
}
