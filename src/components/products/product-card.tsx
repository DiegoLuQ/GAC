'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import type { Product, Settings } from '@/types';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ProductCardProps = {
  product: Product;
  settings: Settings;
};

export function ProductCard({ product, settings }: ProductCardProps) {
  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=Hola, estoy interesado en cotizar el producto ${product.code}: ${product.description}.`;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-xl border-none shadow-none transition-shadow duration-300 hover:shadow-2xl">
      <Carousel className="w-full">
        <CarouselContent>
          {product.images.length > 0 ? (
            product.images.map((img, index) => {
              const imgDetails = PlaceHolderImages.find(p => p.imageUrl === img);
              return (
                <CarouselItem key={index}>
                  <div className="relative aspect-[5/6] w-full">
                    <Image
                      src={img}
                      alt={imgDetails?.description || `${product.description} - imagen ${index + 1}`}
                      fill
                      className="object-cover rounded-t-xl"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      data-ai-hint={imgDetails?.imageHint}
                    />
                  </div>
                </CarouselItem>
              );
            })
          ) : (
            <CarouselItem>
              <div className="relative aspect-square w-full bg-muted flex items-center justify-center rounded-t-xl">
                <span className="text-muted-foreground">Sin imagen</span>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {product.images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none rounded-b-xl" />
      <CardContent className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h3 className="text-md font-bold font-headline leading-tight">{product.description}</h3>
        <div className="flex items-center justify-between mt-1.5">
            <p className="text-lg font-bold text-accent">${product.price.toFixed(2)}</p>
            <Badge variant="destructive" className="bg-transparent border border-white/50 text-white/80">{product.code}</Badge>
        </div>
        <Button asChild className="w-full mt-3 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300" variant="shiny" size="sm">
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Phone className="mr-2 h-4 w-4" />
            Cotizar por WhatsApp
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
