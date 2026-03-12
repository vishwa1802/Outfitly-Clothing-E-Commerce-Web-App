import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const WishlistPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [currentUser]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      // Fetch wishlists and expand product details
      const records = await pb.collection('wishlists').getFullList({
        filter: `userId = "${currentUser.id}"`,
        expand: 'productId',
        $autoCancel: false
      });
      setWishlistItems(records);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await pb.collection('wishlists').delete(id, { $autoCancel: false });
      setWishlistItems(prev => prev.filter(item => item.id !== id));
      toast({ title: 'Removed from wishlist' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not remove item', variant: 'destructive' });
    }
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist - Outfitly</title>
      </Helmet>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
          <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" /> My Wishlist
          </h1>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <Heart className="mx-auto h-16 w-16 text-slate-200 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
              <p className="text-slate-500 mb-6">Save items you love to buy them later.</p>
              <Button asChild><Link to="/shop">Explore Products</Link></Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                const product = item.expand?.productId;
                if (!product) return null;
                
                return (
                  <Card key={item.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <div className="relative aspect-[3/4] bg-slate-100">
                      {product.images?.[0] && (
                        <img src={pb.files.getUrl(product, product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                      )}
                      <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{product.name}</h3>
                      <p className="text-slate-900 font-black mb-4">₹{product.price.toLocaleString()}</p>
                      <Button className="w-full bg-slate-900 text-white" asChild>
                        <Link to={`/product/${product.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default WishlistPage;