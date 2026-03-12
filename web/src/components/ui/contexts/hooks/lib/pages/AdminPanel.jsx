import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Trash2, Edit, Plus, Package, ShoppingCart, DollarSign } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import ProductForm from '@/components/ProductForm.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (isAdmin()) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const productsData = await pb.collection('products').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Error', description: 'Failed to load admin data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await pb.collection('products').delete(productId, { $autoCancel: false });
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: 'Product Deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleProductFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchData();
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Outfitly</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Admin Dashboard</h1>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-white border border-slate-200">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Product Catalog</h2>
                <Button onClick={handleAddProduct} className="bg-slate-900 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="border-slate-200 shadow-sm">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] && (
                            <img src={pb.files.getUrl(product, product.images[0])} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900">{product.name}</h3>
                          <p className="text-sm text-slate-500">{product.category} • {product.gender} • ₹{product.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">Order Management</h3>
                  <p className="text-slate-500">Order tracking system coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {showProductForm && (
          <ProductForm product={editingProduct} onClose={handleProductFormClose} />
        )}
      </div>
    </>
  );
};

export default AdminPanel;