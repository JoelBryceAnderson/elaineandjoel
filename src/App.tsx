import React, { useState, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Gift, X, Building2, Mail } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Modal Component with TypeScript
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 transform transition-all">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const GiftsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-amber-50 p-8">
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

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-amber-50 p-8">
    <div className="max-w-2xl mx-auto px-8 py-24 relative">
      <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
      
      <div className="relative z-10">
        {/* Main content */}
        <div className="text-center space-y-8 mb-16">
          <p className="text-[#1B365D] font-light">you are invited to</p>
          <h2 className="text-[#1B365D] tracking-wide text-sm">THE WEDDING OF</h2>
          
          <h1 className="text-5xl font-serif tracking-wide text-[#1B365D] my-12">
            ELAINE
            <span className="block text-2xl my-6 font-light">- & -</span>
            JOEL
          </h1>
          
          <div className="my-12">
            <p className="text-xl text-[#1B365D]">
              November 15, 2025
            </p>
            <p className="text-[#1B365D] mt-3">Ceremony at 6 p.m.</p>
            <p className="text-[#1B365D] mt-3">reception to follow</p>
          </div>
          
          <div className="text-[#1B365D] space-y-2">
           <a
             href="https://www.aurorabk.com" 
             target = "_blank">
              <p className="font-semibold">Aurora Restaurant</p>
           </a>
          <a
             href="https://maps.app.goo.gl/XgpetCEfV694dqG78" 
             target = "_blank">
            <p>70 Grand Street</p>
            <p>Brooklyn, NY</p>
           </a>
          </div>
        </div>

        {/* Navigation section */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"/>
          <nav className="pt-8">
            <ul className="flex justify-center space-x-8 text-sm">
              <li>
                <p>
                  <Link 
                    to="/gifts" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Registry & Gifts
                </Link>
                </p>
                <p>
                  <Link 
                    to="/hotels" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Hotels & Accommodations
                  </Link>
                </p>
                <p>
                  <Link 
                    to="/rsvp" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    RSVP
                  </Link>
                </p>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
);

const HotelsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10 space-y-8">
          <h1 className="text-3xl font-serif text-center text-gray-800 mb-12">Hotels & Accommodations</h1>
          
          <div className="prose mx-auto text-gray-700">
            <p className="text-center mb-8">
            We're currently finalizing our hotel arrangements and special rates for our wedding guests.
            Please check back soon for a curated list of recommended accommodations near our venue.
            </p>            
            </div>
          </div>
        </div>
      </div>
  );
};

const RSVPPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10 space-y-8">
          <h1 className="text-3xl font-serif text-center text-gray-800 mb-12">RSVP</h1>
          
          <div className="prose mx-auto text-gray-700">
            <p className="text-center mb-8">
            We look forward to having you celebrate with us! Please check back soon for an online RSVP form.
            </p>            
            </div>
          </div>
        </div>
      </div>
  );
};

const WeddingWebsite: React.FC = () => {
  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gifts" element={<GiftsPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default WeddingWebsite;