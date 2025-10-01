'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Settings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  heroImageUrl: z.string().url('Debe ser una URL válida.'),
  whatsappNumber: z.string().min(10, 'El número debe tener al menos 10 dígitos.').regex(/^[0-9]+$/, 'Solo se permiten números.'),
  heroTitle: z.string().min(1, 'El título es requerido.'),
  heroSubtitle: z.string().min(1, 'El subtítulo es requerido.'),
  address: z.string().min(1, 'La dirección es requerida.'),
  email: z.string().email('Debe ser un correo electrónico válido.'),
});

type SettingsFormValues = z.infer<typeof formSchema>;

type SettingsFormProps = {
  settings: Settings;
  onSubmit: (data: SettingsFormValues) => void;
};

export function SettingsForm({ settings, onSubmit }: SettingsFormProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroImageUrl: settings?.heroImageUrl || '',
      whatsappNumber: settings?.whatsappNumber || '',
      heroTitle: settings?.heroTitle || '',
      heroSubtitle: settings?.heroSubtitle || '',
      address: settings?.address || '',
      email: settings?.email || '',
    },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="heroTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título Principal (Hero)</FormLabel>
              <FormControl>
                <Input placeholder="Título principal de la página de inicio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroSubtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtítulo (Hero)</FormLabel>
              <FormControl>
                <Textarea placeholder="Subtítulo o texto descriptivo del hero" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen Principal (Hero)</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
              </FormControl>
              <FormDescription>
                La imagen que se muestra en la parte superior de la página de inicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsappNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="5491112345678" {...field} />
              </FormControl>
              <FormDescription>
                Incluye el código de país, sin espacios ni símbolos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="123 Calle Falsa, Ciudad" {...field} />
              </FormControl>
              <FormDescription>
                La dirección que se mostrará en el pie de página.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico de Contacto</FormLabel>
              <FormControl>
                <Input type="email" placeholder="info@ejemplo.com" {...field} />
              </FormControl>
              <FormDescription>
                El email de contacto que se mostrará en el pie de página.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </Form>
  );
}
