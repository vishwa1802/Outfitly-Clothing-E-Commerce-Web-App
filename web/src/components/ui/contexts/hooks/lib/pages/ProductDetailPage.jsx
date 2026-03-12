import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const record = await pb.collection('products').getOne(id, { $autoCancel: false });
      setProduct(record);
      
      if (record.sizes && record.sizes.length > 0) {
        setSelectedSize(record.sizes[0]);
      }

      if (currentUser) {
        const wishlistCheck = await pb.collection('wishlists').getFullList({
          filter: `userId = "${currentUser.id}" && productId = "${id}"`,
          $autoCancel: false
        });
        setIsWishlisted(wishlistCheck.length > 0);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({ title: 'Error', description: 'Product not found', variant: 'destructive' });
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast({ title: 'Select Size', description: 'Please select a size first.', variant: 'destructive' });
      return;
    }
    
    // Mock add to cart for this implementation since we are using PB directly for products
    // In a full implementation, this would sync with useCart hook and EcommerceApi
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} (Size: ${selectedSize}) added.`,
    });
  };

  const toggleWishlist = async () => {
    if (!currentUser) {
      toast({ title: 'Login Required', description: 'Please login to save items.', variant: 'destructive' });
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        const records = await pb.collection('wishlists').getFullList({
          filter: `userId = "${currentUser.id}" && productId = "${id}"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          await pb.collection('wishlists').delete(records[0].id, { $autoCancel: false });
        }
        setIsWishlisted(false);
        toast({ title: 'Removed from Wishlist' });
      } else {
        await pb.collection('wishlists').create({
          userId: currentUser.id,
          productId: id
        }, { $autoCancel: false });
        setIsWishlisted(true);
        toast({ title: 'Added to Wishlist' });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast({ title: 'Error', description: 'Could not update wishlist', variant: 'destructive' });
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images.map(img => pb.files.getUrl(product, img))
    : ['https://images.unsplash.com/photo-1595528870853-1277acbfe9ed']; // Fallback

  return (
    <>
      <Helmet>
        <title>{product.name} - Outfitly</title>
      </Helmet>

      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden">
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${currentImageIndex === idx ? 'border-slate-900' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{product.brand}</p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                  <div className="flex items-center bg-slate-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    <span className="text-sm font-bold text-slate-700">{product.rating || '4.5'}</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">{product.description || 'Premium quality clothing designed for comfort and style.'}</p>
              </div>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-900">Select Size</h3>
                    <button className="text-sm text-slate-500 underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-xl font-bold text-sm transition-all ${
                          selectedSize === size 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border-2 border-slate-200 rounded-xl px-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-slate-600 hover:text-slate-900">-</button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-slate-600 hover:text-slate-900">+</button>
                </div>
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1 h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={toggleWishlist}
                  className={`h-14 w-14 rounded-xl border-2 ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-600'}`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-slate-100 mt-auto">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-6 h-6 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">30 Days Return</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;