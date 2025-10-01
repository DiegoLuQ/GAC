import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type HeroProps = {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
};

export function Hero({ heroImageUrl, heroTitle, heroSubtitle }: HeroProps) {
  const heroImageDetails = PlaceHolderImages.find(p => p.imageUrl === heroImageUrl);

  return (
    <section className="relative h-[60vh] w-full">
      <div className="absolute inset-0">
        <Image
          src={heroImageUrl}
          alt={heroImageDetails?.description || 'Ánforas para mascotas'}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImageDetails?.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-primary/20" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl font-headline text-shadow-lg shadow-black/50">
          {heroTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-lg sm:text-xl text-white/90 text-shadow-md shadow-black/50">
          {heroSubtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" variant="shiny" className="px-10 py-6 text-lg">
            <Link href="/products">Ver Catálogo</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary px-10 py-6 text-lg">
            <Link href="#products">Explorar</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
