import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ScrollIndicator = () => (
  <div className="flex flex-col items-center text-[#1B365D] animate-bounce">
    <div className="h-12 w-px bg-gradient-to-b from-transparent to-[#C5A572]" />
    <div className="h-4 w-4 rotate-45 border-b-2 border-r-2 border-[#C5A572]" />
  </div>
);

const HomePage: React.FC = () => {
  const [showFloatingIndicator, setShowFloatingIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setShowFloatingIndicator(!isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#112543] p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10">
          {/* Main content */}
          <div className="text-center space-y-8 mb-12">
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
               target="_blank"
               rel="noopener noreferrer">
                <p className="font-semibold">Aurora Restaurant</p>
             </a>
            <a
               href="https://maps.app.goo.gl/XgpetCEfV694dqG78" 
               target="_blank"
               rel="noopener noreferrer">
              <p>70 Grand Street</p>
              <p>Brooklyn, NY</p>
             </a>
            </div>
            <div className="space-y-2 px-16 pt-8">
              <Link to="/rsvp">
                <button 
                  className="block w-full bg-[#C5A572] text-white text-center py-4 rounded-lg hover:text-[#1B365D] hover:bg-[#FDF9F3] transition-colors"
                >
                  RSVP
                </button>
              </Link>
            </div>
          </div>

          {/* Updated Navigation section - extended to bottom edge */}
          <div className="relative mt-16 pt-8">
            <div className="absolute inset-x-0 -top-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"/>
            <nav className="pt-8 -mx-8 -mb-24">
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 overflow-hidden rounded-b-xl">
                <Link 
                  to="/gifts" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#C5A572] transition-colors">
                    Registry
                  </p>
                </Link>
                
                <Link 
                  to="/hotels" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#C5A572] transition-colors">
                    Accommodations
                  </p>
                </Link>
                
                <Link 
                  to="/events" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#C5A572] transition-colors">
                    Wedding Events
                  </p>
                </Link>
                
                <Link 
                  to="/williamsburg" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#C5A572] transition-colors">
                    The Neighborhood
                  </p>
                </Link>
                
                <Link 
                  to="/im_confused" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#C5A572] transition-colors">
                    Questions
                  </p>
                </Link>
                
                <Link 
                  to="/cute_pics" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#C5A572] transition-colors">
                    Gallery
                  </p>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Floating scroll indicator */}
      {showFloatingIndicator && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <ScrollIndicator />
        </div>
      )}
    </div>
  );
};

export default HomePage;