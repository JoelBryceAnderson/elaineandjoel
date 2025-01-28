import React, { useState } from 'react';
import Modal from '../components/Modal';

const GiftsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  return (
    <div className="min-h-screen bg-[#112543] p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10 space-y-8">
          <h1 className="text-3xl font-serif text-center text-gray-800 mb-12">Registry & Gifts</h1>
          
          <div className="prose mx-auto text-gray-700">
            <p className="text-center mb-8">
              Your presence at our wedding is the greatest gift we could ask for. However, for those who have expressed an interest in giving a gift, we've chosen two meaningful options that are close to our hearts:
            </p>
            
            <div className="mt-12 space-y-8">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Support Our Local Community</h2>
                <p className="mb-6">
                  We're passionate about our Williamsburg community and the ongoing efforts to create more green spaces. Consider contributing to the Bushwick Inlet Park project, which is working to transform our neighborhood's waterfront.
                </p>
                <a 
                  href="https://bushwickinletpark.org/donate/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#1B365D] text-white text-center py-4 rounded-lg hover:bg-[#264573] transition-colors"
                >
                  Donate to Bushwick Inlet Park
                </a>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Contribute to Our Honeymoon Adventure</h2>
                <p className="mb-6">
                  If you'd like to help us create lasting memories on our honeymoon, you can contribute to our honeymoon fund.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="block w-full bg-[#C5A572] text-white text-center py-4 rounded-lg hover:text-[#1B365D] hover:bg-[#FDF9F3] transition-colors"
                >
                  View Honeymoon Fund QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Honeymoon Fund</h3>
          <div className="mb-4">
            <img 
              src="/qr-code.png" 
              alt="QR Code for honeymoon fund"
              className="mx-auto max-w-full rounded-lg" 
            />
          </div>
          <p className="text-gray-600">
            Scan this QR code to contribute to our honeymoon fund. Thank you for your generosity!
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default GiftsPage;
