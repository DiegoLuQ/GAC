import type { Product, Settings } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type ProductData = Omit<Product, 'id'>;
type SettingsData = Omit<Settings, 'id'>;

/**
 * Fetches all products from the backend.
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

/**
 * Creates a new product.
 * @param productData - The data for the new product.
 */
export async function createProduct(productData: ProductData): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
}

/**
 * Updates an existing product by its ID.
 * @param productId - The ID of the product to update.
 * @param productData - The data to update.
 */
export async function updateProduct(productId: string, productData: Partial<ProductData>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
}

/**
 * Deletes a product by its ID.
 * @param productId - The ID of the product to delete.
 */
export async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}

/**
 * Fetches the site settings.
 */
export async function getSettings(): Promise<Settings> {
  const response = await fetch(`${API_BASE_URL}/settings`);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}

/**
 * Updates the site settings.
 * @param settingsData - The settings data to update.
 */
export async function updateSettings(settingsData: Partial<SettingsData>): Promise<Settings> {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData),
  });
  if (!response.ok) {
    throw new Error('Failed to update settings');
  }
  return response.json();
}