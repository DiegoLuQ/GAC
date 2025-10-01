'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  id: z.string().optional(),
  code: z
    .string()
    .min(1, 'El código es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
  price: z.coerce.number().min(0, 'El precio debe ser un número positivo.'),
  availability: z.boolean(),
  color: z.string().min(1, 'El color es requerido.'),
  tags: z.string().transform((val) => val.split(',').map(tag => tag.trim()).filter(Boolean)),
  images: z.string().transform((val) => val.split(',').map(url => url.trim()).filter(Boolean)),
});

type ProductFormValues = z.infer<typeof formSchema>;

type ProductFormProps = {
  product?: Product | null;
  onSubmit: (data: ProductFormValues) => void;
  onCancel: () => void;
};

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const defaultValues: Partial<ProductFormValues> = {
    id: product?.id || '',
    code: product?.code || '',
    description: product?.description || '',
    price: product?.price || 0,
    availability: product?.availability ?? true,
    color: product?.color || '',
    tags: product?.tags.join(', ') || '',
    images: product?.images.join(', ') || '',
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="URN-007" {...field} disabled={!!product}/>
              </FormControl>
               <FormDescription>Debe ser único para cada producto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe el producto..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Azul Marino" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiquetas</FormLabel>
              <FormControl>
                <Input placeholder="moderno, ceramica, grande" {...field} />
              </FormControl>
              <FormDescription>Separa las etiquetas con comas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URLs de Imágenes</FormLabel>
              <FormControl>
                <Textarea placeholder="https://url.com/imagen1.jpg, https://url.com/imagen2.jpg" {...field} />
              </FormControl>
               <FormDescription>Separa las URLs con comas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Disponibilidad</FormLabel>
                <FormDescription>
                    Indica si el producto está disponible para la venta.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
