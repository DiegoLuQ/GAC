'use client';
import Link from 'next/link';
import { PawPrint, Instagram, Facebook, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { Settings } from '@/types';


export function Footer({ settings }: { settings: Settings }) {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
        const authStatus = sessionStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
    }, [pathname]);

    const authLink = isAuthenticated 
        ? { href: '/admin', label: 'Admin' } 
        : { href: '/login', label: 'Iniciar sesión' };

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">Recuerdos Eternos</span>
            </Link>
            <p className="text-center text-muted-foreground md:text-left">
              Ánforas conmemorativas para tu mascota.
            </p>
          </div>

          <div className="text-center">
            <h3 className="mb-4 font-semibold uppercase">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  Catálogo
                </Link>
              </li>
               <li>
                <Link href={authLink.href} className="text-muted-foreground hover:text-foreground">
                  {authLink.label}
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h3 className="mb-4 font-semibold uppercase">Contacto</h3>
            <p className="text-muted-foreground">{settings.address}</p>
            <p className="text-muted-foreground">{settings.email}</p>
            <div className="mt-4 flex justify-center space-x-4 md:justify-end">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Recuerdos Eternos. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
