'use server';

import type { Product, Settings } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

let products: Product[] = [
  {
    id: '1',
    code: 'URN-001',
    description: 'Ánfora de cerámica blanca con detalles en dorado. Diseño clásico y elegante.',
    price: 120.00,
    availability: true,
    color: 'Blanco',
    tags: ['Ánfora', 'Cerámica', 'Clásico'],
    images: [
      PlaceHolderImages.find(img => img.id === 'product-1-a')?.imageUrl || '',
      PlaceHolderImages.find(img => img.id === 'product-1-b')?.imageUrl || '',
    ].filter(Boolean),
  },
  {
    id: '2',
    code: 'URN-002',
    description: 'Ánfora de madera de pino con grabado de huella. Acabado natural y cálido.',
    price: 95.50,
    availability: true,
    color: 'Natural',
    tags: ['Ánfora', 'Madera', 'Rústico'],
    images: [
        PlaceHolderImages.find(img => img.id === 'product-2-a')?.imageUrl || '',
    ].filter(Boolean),
  },
  {
    id: '3',
    code: 'URN-003',
    description: 'Ánfora biodegradable para un retorno ecológico a la naturaleza.',
    price: 75.00,
    availability: true,
    color: 'Verde',
    tags: ['Ánfora', 'Biodegradable', 'Ecológico'],
    images: [
        PlaceHolderImages.find(img => img.id === 'product-3-a')?.imageUrl || '',
    ].filter(Boolean),
  },
  {
    id: '4',
    code: 'URN-004',
    description: 'Ánfora de metal con acabado mate. Diseño moderno y minimalista.',
    price: 150.00,
    availability: true,
    color: 'Gris',
    tags: ['Ánfora', 'Metal', 'Moderno'],
    images: [
        PlaceHolderImages.find(img => img.id === 'product-4-a')?.imageUrl || '',
    ].filter(Boolean),
  },
  {
    id: '5',
    code: 'URN-005',
    description: 'Mini-ánfora para recuerdo, permite conservar una pequeña porción de cenizas.',
    price: 45.00,
    availability: false,
    color: 'Plata',
    tags: ['Relicario', 'Metal'],
    images: [
        PlaceHolderImages.find(img => img.id === 'product-5-a')?.imageUrl || '',
    ].filter(Boolean),
  },
    {
    id: '6',
    code: 'URN-006',
    description: 'Ánfora de cristal soplado, una pieza artística única para un recuerdo especial.',
    price: 210.00,
    availability: true,
    color: 'Transparente',
    tags: ['Ánfora', 'Cristal', 'Artesanal'],
    images: [
        PlaceHolderImages.find(img => img.id === 'product-6-a')?.imageUrl || '',
    ].filter(Boolean),
  },
];

let settings: Settings = {
  heroImageUrl: PlaceHolderImages.find(img => img.id === 'hero-1')?.imageUrl || '',
  whatsappNumber: '1234567890',
  heroTitle: 'Honrando su Memoria con Amor',
  heroSubtitle: 'Encuentra la ánfora perfecta para atesorar el recuerdo de tu fiel compañero.',
  address: '123 Calle Falsa, Ciudad',
  email: 'info@recuerdoseternos.com',
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(500);
  return JSON.parse(JSON.stringify(products));
}

export async function getProductByCode(code: string): Promise<Product | undefined> {
  await delay(300);
  return products.find(p => p.code === code);
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  await delay(500);
  const newProduct: Product = {
    ...productData,
    id: (Math.max(...products.map(p => parseInt(p.id, 10))) + 1).toString(),
  };
  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  await delay(500);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...productData };
    return products[index];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await delay(500);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < initialLength;
}

export async function getSettings(): Promise<Settings> {
  await delay(200);
  return JSON.parse(JSON.stringify(settings));
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<Settings> {
  await delay(500);
  settings = { ...settings, ...newSettings };
  return settings;
}
