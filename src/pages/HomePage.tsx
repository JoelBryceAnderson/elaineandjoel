import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ScrollIndicator = () => (
  <div className="flex flex-col items-center text-[#1B365D] animate-bounce">
    <div className="h-12 w-px bg-gradient-to-b from-transparent to-[#ccac6c]" />
    <div className="h-4 w-4 rotate-45 border-b-2 border-r-2 border-[#ccac6c]" />
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
    <div className="min-h-screen bg-[#082e5d] p-8" style={{fontFamily: 'Radley'}}>
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        {/* Background for the entire card */}
        <div 
          className="absolute inset-0 rounded-xl shadow-lg overflow-hidden bg-white/95"  
        >
          {/* Brick background image */}
          <img 
            src="/images/brick.png" 
            alt="Brick Background" 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-95"
          />

          {/* Flowers top image */}
          <img 
            src="/images/flowers_top.png" 
            alt="Flowers Top" 
            className="absolute top-0 left-0 w-full object-cover object-top -mt-24"
            style={{
              height: 'calc(320px + 2rem)', // Original height + negative margin
              zIndex: 0
            }}
          />
        </div>
        
        {/* Main content wrapper with relative positioning */}
        <div className="relative z-10">          
          {/* Text content */}
          <div className="text-center mb-12 mt-12 relative z-10 pt-40">
            <p className="text-[#1B365D] font-light text-3xl">YOU ARE INVITED TO</p>
            <p className="text-[#1B365D] text-xl">the wedding of</p>
            
            <h1 className="text-6xl tracking-wide text-[#1B365D] my-12" style={{fontFamily: 'Italianno, cursive'}}>
              Elaine Haas &<br /> Joel Anderson
            </h1>
            
            <div className="mt-12">
              <p className="text-xl text-[#1B365D]">
                11.15.2025
              </p>
              <p className="text-[#1B365D] mt-3">Ceremony at 6 p.m.</p>
              <p className="text-[#1B365D]">reception to follow</p>
              <div 
                className="h-12 bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: 'url(/images/embellishment.png)',
                  zIndex: 0,
                }} 
              />
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
                  className="block w-full bg-[#ccac6c] text-white text-center py-4 rounded-lg hover:text-[#1B365D] hover:bg-[#FDF9F3] transition-colors"
                >
                  RSVP
                </button>
              </Link>
            </div>
          </div>

          {/* Updated Navigation section - extended to bottom edge */}
          <div className="relative pt-8">
            <div className="absolute inset-x-0 -top-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"/>
            <nav className="pt-8 -mx-8 -mb-24">
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 overflow-hidden rounded-b-xl text-m sm:text-xl md:text-xl lg:text-xl xl:text-xl">
                <Link 
                  to="/hotels" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#ccac6c] transition-colors">
                    Accommodations
                  </p>
                </Link>
                
                <Link 
                  to="/events" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#ccac6c] transition-colors">
                    Wedding Events
                  </p>
                </Link>

                <Link 
                  to="/gifts" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#ccac6c] transition-colors">
                    Registry
                  </p>
                </Link>
                
                <Link 
                  to="/williamsburg" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#ccac6c] transition-colors">
                    The Neighborhood
                  </p>
                </Link>
                
                <Link 
                  to="/im_confused" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#ccac6c] transition-colors">
                    Questions
                  </p>
                </Link>
                
                <Link 
                  to="/cute_pics" 
                  className="group bg-white hover:bg-[#FDF9F3] transition-all py-8"
                >
                  <p className="font-serif italic text-center text-[#1B365D] group-hover:text-[#ccac6c] transition-colors">
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