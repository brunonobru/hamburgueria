
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import ProductCard from '@/components/products/ProductCard';
import ProductForm from '@/components/products/ProductForm';
import { productsService } from '@/services/supabaseService';
import { Product, ProductCategory } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    try {
      const data = await productsService.getAllForAdmin();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddEditProduct = async (product: Product) => {
    try {
      console.log('Tentando salvar produto:', product);
      
      if (editingProduct) {
        // Update existing product
        console.log('Atualizando produto existente...');
        await productsService.update(product.id, product);
        setProducts(products.map(p => p.id === product.id ? product : p));
        toast.success("Produto atualizado com sucesso");
      } else {
        // Add new product
        console.log('Adicionando novo produto...');
        const newProduct = await productsService.create(product);
        console.log('Produto criado:', newProduct);
        setProducts([...products, newProduct]);
        toast.success("Produto adicionado com sucesso");
      }
      
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro detalhado ao salvar produto:', error);
      console.error('Stack trace:', error.stack);
      toast.error('Erro ao salvar produto: ' + (error.message || 'Erro desconhecido'));
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleDeleteProduct = (id: string) => {
    setDeleteProductId(id);
  };
  
  const confirmDelete = async () => {
    if (deleteProductId) {
      try {
        await productsService.delete(deleteProductId);
        setProducts(products.filter(p => p.id !== deleteProductId));
        setDeleteProductId(null);
        toast.success("Produto deletado com sucesso");
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Erro ao deletar produto');
      }
    }
  };
  
  const categories: ProductCategory[] = ['burger', 'pizza', 'dessert', 'drink', 'snack', 'combo'];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <AdminLayout>
      <PageHeader 
        title="Produtos" 
        description="Gerencie seu menu de comidas"
        action={{
          label: "Adicionar Produto",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }
        }}
      />
      
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
      
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleAddEditProduct}
        product={editingProduct}
      />
      
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Products;
