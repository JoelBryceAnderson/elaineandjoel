import React, { useState } from 'react';
import { X } from 'lucide-react';
import PageTemplate from "../components/PageTemplate";

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
    src: "https://lh3.googleusercontent.com/d/1y29gPpmTXQEBz6ocDLVTOff2bOxO8xpV",
    alt: "2025",
    title: "TWA Hotel photoshoot"
  },
  {
    id: 2,
    src: "https://lh3.googleusercontent.com/d/1DSg9nxw6O8TW1LZdystYvX6OHwIhBOeI",
    alt: "2025",
    title: "TWA Hotel photoshoot"
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/d/1eMZrfqwpB3cU0lRnmcsSt-TAv071r76A",
    alt: "2025",
    title: "TWA Hotel photoshoot"
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/d/1q-pnLsbY1fNgNZPo-ccnXXCBShVJkZL3",
    alt: "2025",
    title: "TWA Hotel photoshoot"
  },
  {
    id: 5,
    src: "https://lh3.googleusercontent.com/d/1m9iZkX2YJ8PIKriTGXi-ELRsXJcDFJsn",
    alt: "2025",
    title: "Uncle Joel & Sophie"
  },
  {
    id: 5,
    src: "https://lh3.googleusercontent.com/d/13KQRH2bEsC518nXMyrNjv6wWjhHPP8Vn",
    alt: "2024",
    title: "We bought a home!"
  },
  {
    id: 6,
    src: "https://lh3.googleusercontent.com/d/1vnClZzBdxPv3tPrLiCHQmK_NqPXJYemw",
    alt: "2024",
    title: "Knicks game!"
  },
  {
    id: 7,
    src: "https://lh3.googleusercontent.com/d/1tEUs3OUzXRLhjY3ZUDDLkBS7PE_bYtwh",
    alt: "2023",
    title: "Engaged!"
  },
  {
    id: 8,
    src: "https://lh3.googleusercontent.com/d/1Uhk2bcO95euo0yiUu8fPirwL8LUWGJK7",
    alt: "2023",
    title: "Engaged!"
  },
  {
    id: 9,
    src: "https://lh3.googleusercontent.com/d/1Xv3skZhdzdUR5QRFRbj0CaFtHyRD9w73",
    alt: "2023",
    title: "Elaine & Her Parents, Mike & Brenda"
  },
  {
    id: 10,
    src: "https://lh3.googleusercontent.com/d/16JwdZRtfAytrB3Bh9v5CV5ozBln4ZhzO",
    alt: "2023",
    title: "Joel & Mike"
  },
  {
    id: 11,
    src: "https://lh3.googleusercontent.com/d/1zfHBeBc1t6gylxJNiOUAsuaWVx4Am43B",
    alt: "2023",
    title: "Amar & Tatiana's Wedding"
  },
  {
    id: 12,
    src: "https://lh3.googleusercontent.com/d/1cJxEg_RL0aoglyueaRCGLEJsnxez8u21",
    alt: "2022",
    title: "Jamaica"
  },
  {
    id: 13,
    src: "https://lh3.googleusercontent.com/d/1CB5HaT7NUBkuV533mAGv3EUJtkEOLd3e",
    alt: "2022",
    title: "Snow day"
  },
  {
    id: 14,
    src: "https://lh3.googleusercontent.com/d/1xv1eju6-QZ3MxRAnAkUkDybbFx4Ez3T7",
    alt: "2022",
    title: "Lakeside Sailing"
  },
  {
    id: 15,
    src: "https://lh3.googleusercontent.com/d/1DzROWFmd-8y0gkbVg_4TPKXnvQxNKrSD",
    alt: "2021",
    title: "NYC Together!"
  },
  {
    id: 16,
    src: "https://lh3.googleusercontent.com/d/1n5srCEgfWHcpf6f1reX4yiM6D8Zjc4Ba",
    alt: "2020",
    title: "Our cat Ray"
  },
  {
    id: 17,
    src: "https://lh3.googleusercontent.com/d/192K3qVFbQG-Ce3Ba5CEN65WwoMVsxLAL",
    alt: "2020",
    title: "COVID Christmas"
  },
  {
    id: 18,
    src: "https://lh3.googleusercontent.com/d/1-703zXx_52CdvZnePY0zKaR-n3EA_RUM",
    alt: "2019",
    title: "NYC Together!"
  },
  {
    id: 19,
    src: "https://lh3.googleusercontent.com/d/1sqAK5fIPdl-BaIB_86c0juI2gmjfWpi1",
    alt: "2018",
    title: "Lakeside, OH"
  },
  {
    id: 20,
    src: "https://lh3.googleusercontent.com/d/13cJNr_30VWBivaGsQ7t-3FySXRi6UCvr",
    alt: "2017",
    title: "Joel moves to NYC"
  },
  {
    id: 21,
    src: "https://lh3.googleusercontent.com/d/1gqHHdYJ_K_PjRP7TamE9Y18KAyEK-AKv",
    alt: "2015",
    title: "College date night"
  },
  {
    id: 22,
    src: "https://lh3.googleusercontent.com/d/1mse9vHfGiaOqlQjTOJoJO0wf-Ps3URJ7",
    alt: "2015",
    title: "Sorority Date Night"
  },
  {
    id: 23,
    src: "https://lh3.googleusercontent.com/d/1BGriWsO1Qa28ZZNH-VuPlXaXVZx4A6G9",
    alt: "1997",
    title: "Joel & Dad"
  },
  {
    id: 24,
    src: "https://lh3.googleusercontent.com/d/1zgGg14MTxbuUlQEIf3aApFl61le_cdol",
    alt: "1997",
    title: "Elaine & Grandma Sandra"
  },
  {
    id: 25,
    src: "https://lh3.googleusercontent.com/d/1NiUSYWbiQPPd0JCoubJngNBgnpsllJol",
    alt: "1996",
    title: "Elaine & Grandpa Bill"
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
    <div>
      <PageTemplate
        title="Gallery"
        subtitle=""
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-12 pr-12">
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
      </PageTemplate>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default GalleryPage;