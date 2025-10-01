import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Package, Settings, Power } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Home className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Productos
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
             <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/">
                    <Power className="mr-2 h-4 w-4" />
                    Salir
                </Link>
             </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}
