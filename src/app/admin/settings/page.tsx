'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSettings, updateSettings } from '@/lib/data';
import type { Settings } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { SettingsForm } from '@/components/admin/settings-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/');
      return;
    }

    async function fetchSettings() {
      try {
        const fetchedSettings = await getSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar las configuraciones.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, [router, toast]);

  const handleFormSubmit = async (data: Settings) => {
    try {
      await updateSettings(data);
      toast({
        title: 'Configuración actualizada',
        description: 'La información del sitio ha sido guardada correctamente.',
      });
      // La redirección ha sido eliminada.
      // Para ver los cambios en el sitio público, necesitarás navegar manualmente y recargar la página.
      // Esto se mejorará al migrar a una base de datos real.

    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: err.message || 'Ocurrió un error al actualizar la configuración.',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Configuración del Sitio</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>
            Modifica la imagen principal de la página de inicio y el número de contacto para cotizaciones por WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando configuración...</p>
          ) : settings ? (
            <SettingsForm settings={settings} onSubmit={handleFormSubmit} />
          ) : (
            <p>No se encontró la configuración.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
