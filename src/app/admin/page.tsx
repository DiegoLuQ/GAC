'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Panel de Administración</h1>
            <Button onClick={handleLogout} variant="destructive">Cerrar Sesión</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 border rounded-lg shadow-sm">
            <Link href="/admin/products" passHref>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                <CardTitle>Gestión de Productos</CardTitle>
                <CardDescription>Añadir, editar y eliminar ánforas del catálogo.</CardDescription>
                </CardHeader>
                <CardContent>
                <p>Aquí podrás administrar todos los productos que se muestran en tu tienda.</p>
                </CardContent>
            </Card>
            </Link>
            
            <Link href="/admin/settings" passHref>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
                <CardDescription>Modificar la imagen principal y la información de contacto.</CardDescription>
                </CardHeader>
                <CardContent>
                <p>Actualiza la imagen del hero y el número de WhatsApp para cotizaciones.</p>
                </CardContent>
            </Card>
            </Link>
        </div>
    </div>
  );
}
