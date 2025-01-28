import React from 'react';

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#112543] p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10 space-y-8">
          <h1 className="text-3xl font-serif text-center text-gray-800 mb-12">Our Gallery</h1>
          
          <div className="prose mx-auto text-gray-700">
            <p className="text-center mb-8">
            Cute pics on the way.
            </p>            
            </div>
          </div>
        </div>
      </div>
  );
};

export default GalleryPage;
