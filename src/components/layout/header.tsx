'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const baseNavLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/products', label: 'Catálogo' },
];

export function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, [pathname]);

  const navLinks = isAuthenticated
    ? [...baseNavLinks, { href: '/admin', label: 'Admin' }]
    : [...baseNavLinks, { href: '/login', label: 'Iniciar sesión' }];


  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === link.href ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PawPrint className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              Recuerdos Eternos
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <NavItems />
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col p-4">
                <Link href="/" className="mb-8 flex items-center space-x-2">
                   <PawPrint className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">Recuerdos Eternos</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <NavItems />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
