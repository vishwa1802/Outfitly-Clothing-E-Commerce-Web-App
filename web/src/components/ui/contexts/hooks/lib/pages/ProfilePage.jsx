import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Helmet>
        <title>My Profile - Outfitly</title>
      </Helmet>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-3xl mx-auto px-4 py-12 w-full">
          <h1 className="text-3xl font-black text-slate-900 mb-8">My Profile</h1>
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="border-b border-slate-100 pb-6">
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{currentUser?.name || 'User'}</p>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {currentUser?.role || 'Customer'}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</p>
                  <p className="font-medium text-slate-900">{currentUser?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;