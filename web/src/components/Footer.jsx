import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Instagram as InstagramIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Outfitly Clothing</h3>
            <p className="text-slate-400 leading-relaxed">
              Premium fashion curated for every style. Elevate your wardrobe with our exclusive collections of high-quality apparel.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=Shirts" className="text-slate-400 hover:text-white transition-colors">Shirts</Link></li>
              <li><Link to="/shop?category=Pants" className="text-slate-400 hover:text-white transition-colors">Pants</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-slate-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-slate-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-slate-400 hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-slate-700"
              />
              <Button className="w-full bg-white text-slate-950 hover:bg-slate-200">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Outfitly Clothing. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm font-medium">
            Created by Vihsal Vishwakarma
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;