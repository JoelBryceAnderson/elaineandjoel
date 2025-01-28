import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

interface ImageModalProps {
  image: GalleryImage | null;
  onClose: () => void;
}

// This would be replaced with your actual image data
const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://lh3.googleusercontent.com/d/1Uhk2bcO95euo0yiUu8fPirwL8LUWGJK7",
    alt: "2023",
    title: "Engaged!"
  },
  {
    id: 2,
    src: "https://lh3.googleusercontent.com/d/1-703zXx_52CdvZnePY0zKaR-n3EA_RUM",
    alt: "2019",
    title: "NYC Together!"
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/d/13cJNr_30VWBivaGsQ7t-3FySXRi6UCvr",
    alt: "2017",
    title: "Joel moves to NYC"
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/d/1gqHHdYJ_K_PjRP7TamE9Y18KAyEK-AKv",
    alt: "2015",
    title: "Sorority date night"
  },
];

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X size={32} />
        </button>
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-screen max-w-full object-contain"
        />
      </div>
    </div>
  );
};

const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="min-h-screen bg-[#112543] p-8">
      <div className="max-w-6xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10 space-y-8">
          <h1 className="text-3xl font-serif text-center text-gray-800 mb-12">
            Our Gallery
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-medium">
                    {image.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default GalleryPage;