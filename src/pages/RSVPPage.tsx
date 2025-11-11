import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const RSVPPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#082e5d] p-8" style={{ fontFamily: 'Radley' }}>
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <Link to="/" className="absolute top-6 left-6 text-[#1B365D] bg-white/70 hover:bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out z-20 text-sm font-sans">
          &larr; Return to Home
        </Link>
        <div 
          className="absolute inset-0 rounded-xl shadow-lg overflow-hidden bg-white/95"  
        >
          <img 
            src="/images/brick.png" 
            alt="Brick Background" 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-95"
          />
          <img 
            src="/images/flowers_top.png" 
            alt="Flowers Top" 
            className="absolute top-0 left-0 w-full object-cover object-top -mt-24"
            style={{
              height: 'calc(320px + 2rem)',
              zIndex: 0
            }}
          />
        </div>
        <div className="relative z-10 pt-40">
          <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
            
            <h1 className="text-6xl tracking-wide text-[#1B365D] my-8" style={{ fontFamily: 'Italianno, cursive' }}>
              Thank You
            </h1>
            
            <div 
              className="h-12 bg-contain bg-no-repeat bg-center w-full"
              style={{
                backgroundImage: 'url(/images/embellishment.png)',
              }} 
            />

            <div className="w-full text-center space-y-6 mt-8 px-24">
              <p className="text-[#1B365D] text-lg">
                The deadline to RSVP has passed. We're so excited to celebrate with everyone soon!
                <br />
                If you have an urgent question, please don't hesitate to reach out.
              </p>
              <a
                href="mailto:elaineandjoelanderson@gmail.com"
                className="inline-flex items-center gap-2 mx-auto px-8 py-3 bg-[#ccac6c] text-white rounded-lg hover:bg-[#1B365D] transition-colors"
              >
                <Mail size={16} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPPage;
