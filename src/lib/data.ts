'use server';

import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';
import type { Product, Settings } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- Mock Data and Seeding Logic ---

const initialProducts: Omit<Product, 'id'>[] = [
  {
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
    code: 'URN-002',
    description: 'Ánfora de madera de pino con grabado de huella. Acabado natural y cálido.',
    price: 95.50,
    availability: true,
    color: 'Natural',
    tags: ['Ánfora', 'Madera', 'Rústico'],
    images: [ PlaceHolderImages.find(img => img.id === 'product-2-a')?.imageUrl || '' ].filter(Boolean),
  },
  {
    code: 'URN-003',
    description: 'Ánfora biodegradable para un retorno ecológico a la naturaleza.',
    price: 75.00,
    availability: true,
    color: 'Verde',
    tags: ['Ánfora', 'Biodegradable', 'Ecológico'],
    images: [ PlaceHolderImages.find(img => img.id === 'product-3-a')?.imageUrl || '' ].filter(Boolean),
  },
];

const initialSettings: Omit<Settings, 'id'> = {
  heroImageUrl: PlaceHolderImages.find(img => img.id === 'hero-1')?.imageUrl || '',
  whatsappNumber: '1234567890',
  heroTitle: 'Honrando su Memoria con Amor',
  heroSubtitle: 'Encuentra la ánfora perfecta para atesorar el recuerdo de tu fiel compañero.',
  address: '123 Calle Falsa, Ciudad',
  email: 'info@recuerdoseternos.com',
};

async function seedDatabase() {
  const { db } = await connectToDatabase();
  const productsCollection = db.collection('products');
  const settingsCollection = db.collection('settings');

  const productCount = await productsCollection.countDocuments();
  if (productCount === 0) {
    console.log('Seeding database with initial products...');
    await productsCollection.insertMany(initialProducts);
  }

  const settingsCount = await settingsCollection.countDocuments();
  if (settingsCount === 0) {
    console.log('Seeding database with initial settings...');
    await settingsCollection.insertOne(initialSettings);
  }
}

// --- Helper ---

const mapMongoId = (doc: any) => {
  if (doc && doc._id) {
    const { _id, ...rest } = doc;
    return { id: _id.toHexString(), ...rest };
  }
  return doc;
};

// --- Data Access Functions ---

export async function getProducts(): Promise<Product[]> {
  try {
    await seedDatabase();
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const products = await productsCollection.find({}).toArray();
    return products.map(mapMongoId);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductByCode(code: string): Promise<Product | undefined> {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const product = await productsCollection.findOne({ code });
    return product ? mapMongoId(product) : undefined;
  } catch (error) {
    console.error(`Error fetching product by code ${code}:`, error);
    return undefined;
  }
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    const result = await productsCollection.insertOne(productData);
    const newProduct = await productsCollection.findOne({ _id: result.insertedId });
    return mapMongoId(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Could not add the product.');
  }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  if (!ObjectId.isValid(id)) {
    console.error('Invalid ObjectId for update:', id);
    return null;
  }
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: productData },
      { returnDocument: 'after' }
    );
    return result ? mapMongoId(result) : null;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    console.error('Invalid ObjectId for delete:', id);
    return false;
  }
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return false;
  }
}

export async function getSettings(): Promise<Settings> {
  try {
    await seedDatabase();
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection<Settings>('settings');
    let settings = await settingsCollection.findOne({});

    if (!settings) {
      // This should not happen due to seeding, but it's a safe fallback.
      return initialSettings;
    }

    return mapMongoId(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      ...initialSettings,
      heroTitle: 'Error',
      heroSubtitle: 'No se pudieron cargar las configuraciones.',
    };
  }
}

export async function updateSettings(newSettings: Partial<Omit<Settings, 'id'>>): Promise<Settings> {
  try {
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection<Settings>('settings');
    const result = await settingsCollection.findOneAndUpdate(
      {},
      { $set: newSettings },
      { upsert: true, returnDocument: 'after' }
    );
    return result ? mapMongoId(result) : (initialSettings as Settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error('Could not update settings.');
  }
}