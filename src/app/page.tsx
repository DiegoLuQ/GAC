import { Hero } from '@/components/layout/hero';
import { ProductList } from '@/components/products/product-list';
import { getProducts, getSettings } from '@/lib/api-client';
import type { Product, Settings } from '@/types';

export default async function Home() {
  const products: Product[] = await getProducts();
  const settings: Settings = await getSettings();

  return (
    <div className="flex flex-col">
      <Hero 
        heroImageUrl={settings.heroImageUrl}
        heroTitle={settings.heroTitle}
        heroSubtitle={settings.heroSubtitle}
      />
      <div className="py-8 md:py-16">
        <ProductList initialProducts={products} settings={settings} />
      </div>
    </div>
  );
}
