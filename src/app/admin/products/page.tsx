'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProducts,
  deleteProduct,
  addProduct,
  updateProduct,
  getProductByCode,
} from '@/lib/data';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/admin/product-form';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/');
    } else {
      fetchProducts();
    }
  }, [router]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
    setIsLoading(false);
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      const success = await deleteProduct(productToDelete.id);
      if (success) {
        toast({ title: 'Producto eliminado', description: `El producto ${productToDelete.code} ha sido eliminado.` });
        fetchProducts();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el producto.' });
      }
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };
  
  const handleFormSubmit = async (data: Omit<Product, 'id'> | Product) => {
    try {
      if ('id' in data && data.id) {
        // Update
        await updateProduct(data.id, data);
        toast({ title: 'Producto actualizado', description: 'El producto ha sido actualizado exitosamente.' });
      } else {
        // Create
        const existingProduct = await getProductByCode(data.code);
        if (existingProduct) {
          toast({ variant: 'destructive', title: 'Error', description: `El código "${data.code}" ya está en uso.` });
          return;
        }
        await addProduct(data as Omit<Product, 'id'>);
        toast({ title: 'Producto creado', description: 'El nuevo producto ha sido añadido.' });
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (error) {
      const err = error as Error;
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Ocurrió un error al guardar el producto.' });
    }
  };

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gestión de Productos</h1>
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={selectedProduct}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Disponibilidad</TableHead>
              <TableHead>Etiquetas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.code}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                     {product.availability ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete?.code}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
