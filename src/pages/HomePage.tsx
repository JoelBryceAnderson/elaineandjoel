import React from 'react';

const HomePage: React.FC = () => {
  return (
    <>
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
            <div className="text-center mb-12 mt-12 relative z-10 pt-40 pb-12">
              <p className="text-[#1B365D] font-light text-3xl">WE'RE MARRIED!</p>

              <h1 className="text-6xl tracking-wide text-[#1B365D] my-12" style={{fontFamily: 'Italianno, cursive'}}>
                Elaine & Joel
              </h1>

              <div className="mt-12 text-[#1B365D] text-xl px-4">
                <p>Thank you to everyone who came and made our day so special. We were so happy to see all of you!</p>
                <p className="mt-4">We're gathering pictures and will send them out soon. If you have any pictures you'd like to share, please send them to us!</p>
                <a href="mailto:elaineandjoelanderson@gmail.com" className="mt-8 inline-block bg-[#ccac6c] text-white font-bold py-3 px-6 rounded hover:bg-opacity-80 transition-colors">
                  Send us your pictures
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
