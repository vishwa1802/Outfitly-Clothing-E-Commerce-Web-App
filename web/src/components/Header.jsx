import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, Package, Heart, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import ShoppingCartSidebar from '@/components/ShoppingCart.jsx';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-sm py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">OUTFITLY</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider">
                Home
              </Link>
              <Link to="/shop" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider">
                Shop
              </Link>
              {!currentUser && (
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider">
                  Admin Login
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="hidden lg:flex relative w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 text-sm text-slate-900 bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </form>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-slate-100 rounded-full"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5 text-slate-700" />
                {cartCount > 0 && (
                  <span className="absolute 0 right-0 bg-slate-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                      <User className="w-5 h-5 text-slate-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <div className="px-2 py-2 mb-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                      <Package className="w-4 h-4 mr-2" /> Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')} className="cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" /> Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/addresses')} className="cursor-pointer">
                      <MapPin className="w-4 h-4 mr-2" /> Addresses
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer font-medium text-indigo-600">
                          <Package className="w-4 h-4 mr-2" /> Admin Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => navigate('/login')} className="font-semibold">
                    Login
                  </Button>
                  <Button onClick={() => navigate('/signup')} className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6">
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white absolute w-full left-0 top-full shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-3 pl-10 text-sm text-slate-900 bg-slate-100 border-none rounded-xl focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </form>
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/shop" className="px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                {!currentUser && (
                  <>
                    <Link to="/login" className="px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/signup" className="px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      <ShoppingCartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;