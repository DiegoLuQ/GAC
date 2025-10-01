import { ProductList } from '@/components/products/product-list';
import { getProducts, getSettings } from '@/lib/data';
import type { Product, Settings } from '@/types';

export default async function ProductsPage() {
  const products: Product[] = await getProducts();
  const settings: Settings = await getSettings();

  return (
    <div className="flex flex-col">
      <ProductList initialProducts={products} settings={settings} />
    </div>
  );
}
