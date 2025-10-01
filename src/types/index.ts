export type Product = {
  id: string;
  code: string;
  description: string;
  price: number;
  availability: boolean;
  color: string;
  tags: string[];
  images: string[];
};

export type Settings = {
  id?: string;
  heroImageUrl: string;
  whatsappNumber: string;
  heroTitle: string;
  heroSubtitle: string;
  address: string;
  email: string;
};
