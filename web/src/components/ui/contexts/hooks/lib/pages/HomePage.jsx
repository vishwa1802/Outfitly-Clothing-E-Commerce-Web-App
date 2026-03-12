import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c' },
  { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
  { name: 'Pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80' },
  { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d' },
];

const trendingProducts = [
  { id: '1', name: 'Classic Oxford Shirt', brand: 'Outfitly', price: 2499, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf' },
  { id: '2', name: 'Slim Fit Chinos', brand: 'Outfitly', price: 3299, image: 'https://images.unsplash.com/photo-1473966968600-fa801b1c7c4a' },
  { id: '3', name: 'Essential Cotton T-Shirt', brand: 'Outfitly', price: 999, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820' },
  { id: '4', name: 'Vintage Wash Denim', brand: 'Outfitly', price: 4599, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246' },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Outfitly Clothing - Premium Fashion</title>
        <meta name="description" content="Curated Collections for Every Style. Shop premium shirts, pants, t-shirts, and jeans." />
      </Helmet>

      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1682329663434-fde624181fd4"
                alt="Premium Fashion"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
                  Outfitly Clothing <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 font-light">Premium Fashion</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-200 mb-10 font-medium max-w-2xl mx-auto">
                  Curated Collections for Every Style. Discover apparel that defines your presence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-10 py-7 rounded-full font-bold"
                    onClick={() => navigate('/shop')}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Shop Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-7 rounded-full font-semibold"
                    onClick={() => {
                      document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Explore Collections
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Featured Collections */}
          <section id="collections" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Featured Categories</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore our carefully curated categories designed for the modern wardrobe.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/shop?category=${category.name}`)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <span className="inline-flex items-center text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                          Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Trending Products */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Trending Now</h2>
                  <p className="text-lg text-slate-600">Our most popular pieces this season.</p>
                </div>
                <Button variant="ghost" className="hidden sm:flex font-semibold" onClick={() => navigate('/shop')}>
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {trendingProducts.map((product) => (
                  <Card key={product.id} className="group border-none shadow-none bg-transparent cursor-pointer" onClick={() => navigate('/shop')}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 mb-4">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{product.brand}</span>
                        <div className="flex items-center text-xs font-medium text-slate-700">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" /> 4.9
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{product.name}</h3>
                      <p className="text-slate-900 font-semibold">₹{product.price.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Button variant="outline" className="w-full rounded-full" onClick={() => navigate('/shop')}>
                  View All Products
                </Button>
              </div>
            </div>
          </section>

          {/* Brand Showcase */}
          <section className="py-20 bg-slate-950 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-8">Featuring Premium Brands</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-80">
                <span className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Adidas</span>
                <span className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">Nike</span>
                <span className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Puma</span>
                <span className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Outfitly</span>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;