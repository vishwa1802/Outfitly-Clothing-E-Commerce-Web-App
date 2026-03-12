import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { MapPin } from 'lucide-react';

const AddressesPage = () => {
  return (
    <>
      <Helmet>
        <title>My Addresses - Outfitly</title>
      </Helmet>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
          <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-slate-700" /> Saved Addresses
          </h1>
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-100">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No addresses saved</h2>
            <p className="text-slate-500">You can add addresses during checkout.</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AddressesPage;