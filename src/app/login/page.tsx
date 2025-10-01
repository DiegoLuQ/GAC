'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigirlo al panel de admin
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      router.push('/admin');
    }
  }, [router]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'diego123' && password === 'diego123') {
      sessionStorage.setItem('isAuthenticated', 'true');
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: 'Usuario o contraseña incorrectos.',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight font-headline">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Ingresa a tu cuenta para administrar el sitio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="tu-usuario"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
