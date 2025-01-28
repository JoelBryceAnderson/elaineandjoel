import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Building2, HotelIcon, Camera, MailQuestion } from 'lucide-react';

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-[#112543] p-8">
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
             target = "_blank"
             rel="noopener noreferrer">
              <p className="font-semibold">Aurora Restaurant</p>
           </a>
          <a
             href="https://maps.app.goo.gl/XgpetCEfV694dqG78" 
             target = "_blank"
             rel="noopener noreferrer">
            <p>70 Grand Street</p>
            <p>Brooklyn, NY</p>
           </a>
          </div>
          <div className="space-y-2 pr-16 pl-16 pt-8">
            <Link
            to="/rsvp">
              <button 
                className="block w-full bg-[#C5A572] text-white text-center py-4 rounded-lg hover:text-[#1B365D] hover:bg-[#FDF9F3] transition-colors"
              >
                RSVP
              </button>
            </Link>
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
                    <HotelIcon className="w-4 h-4 mr-2" />
                    Hotels & Accommodations
                  </Link>
                </p>
                <p>
                  <Link 
                    to="/williamsburg" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    The Neighborhood
                  </Link>
                </p>
                <p>
                  <Link 
                    to="/im_confused" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <MailQuestion className="w-4 h-4 mr-2" />
                    FAQs
                  </Link>
                </p>
                <p>
                  <Link 
                    to="/cute_pics" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Gallery
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

export default HomePage;
