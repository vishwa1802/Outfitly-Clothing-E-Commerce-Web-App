import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Filter, ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const categoriesList = ['Pants', 'Shirts', 'T-Shirts', 'Jeans', 'Trousers'];
  const gendersList = ['Male', 'Female', 'Unisex'];

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) setSelectedCategories([category]);
    if (search) setSearchQuery(search);
    
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategories, selectedGenders, priceRange, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const records = await pb.collection('products').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setProducts(records);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedGenders.length > 0) {
      filtered = filtered.filter(p => selectedGenders.includes(p.gender));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleFilter = (item, list, setList) => {
    setList(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setPriceRange([1000, 10000]);
    setSearchQuery('');
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 className="font-bold text-lg flex items-center text-slate-900">
          <Filter className="w-5 h-5 mr-2" /> Filters
        </h2>
        <button onClick={clearFilters} className="text-xs font-semibold text-slate-500 hover:text-slate-900">
          Clear All
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Category</h3>
        <div className="space-y-3">
          {categoriesList.map(category => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
              />
              <Label htmlFor={`cat-${category}`} className="ml-3 cursor-pointer text-slate-600">{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Gender</h3>
        <div className="space-y-3">
          {gendersList.map(gender => (
            <div key={gender} className="flex items-center">
              <Checkbox
                id={`gen-${gender}`}
                checked={selectedGenders.includes(gender)}
                onCheckedChange={() => toggleFilter(gender, selectedGenders, setSelectedGenders)}
              />
              <Label htmlFor={`gen-${gender}`} className="ml-3 cursor-pointer text-slate-600">{gender}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Price Range</h3>
        <Slider
          min={1000}
          max={10000}
          step={500}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-4"
        />
        <div className="flex justify-between items-center text-sm font-medium text-slate-700">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Shop - Outfitly Clothing</title>
        <meta name="description" content="Browse our complete collection of premium clothing." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />

        <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Shop Collection</h1>
            <p className="text-slate-600">Discover premium apparel for every occasion.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <p className="text-sm text-slate-600 font-medium">
                    Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> results
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-sm text-slate-500 font-medium hidden sm:block">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl bg-slate-50 border-none">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="bg-slate-100 aspect-[3/4] rounded-xl mb-4"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4 mb-3"></div>
                      <div className="h-5 bg-slate-100 rounded w-3/4 mb-4"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-red-100">
                  <p className="text-red-600 mb-4 font-medium">{error}</p>
                  <Button onClick={fetchProducts} variant="outline">Try Again</Button>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="group cursor-pointer border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white flex flex-col"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={pb.files.getUrl(product, product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                          {product.category}
                        </div>
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{product.brand}</span>
                          <div className="flex items-center text-xs font-medium text-slate-700">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                            {product.rating || '4.5'}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <span className="text-lg font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                  <p className="text-slate-500 mb-6">Try adjusting your filters or search query.</p>
                  <Button onClick={clearFilters} className="rounded-full">Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductCatalog;