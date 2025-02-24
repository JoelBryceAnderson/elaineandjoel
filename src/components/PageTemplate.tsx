import React from 'react';

type PageTemplateProps = {
  title: string;
  subtitle?: string;
  supertitle?: string;
  children: React.ReactNode;
  className?: string;
};

const PageTemplate: React.FC<PageTemplateProps> = ({ 
  title, 
  subtitle,
  children, 
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-[#082e5d] p-8" style={{fontFamily: 'Radley'}}>
      <div className="max-w-2xl mx-auto relative">
        {/* Main card container */}
        <div className="rounded-xl shadow-lg overflow-hidden bg-white/95">
          {/* Background for the primary content */}
          <div className="relative">
            {/* Brick background image */}
            <img 
              src="/images/brick.png" 
              alt="Brick Background" 
              className="absolute inset-0 w-full h-full object-cover object-top opacity-95 z-0"
              style={{
                transform: 'scale(1.2)', // Adjust this value to zoom more or less
                transformOrigin: 'center center', // This centers the zoom
              }}
            />

            {/* Flowers top image */}
            <img 
              src="/images/flowers_top.png" 
              alt="Flowers Top" 
              className="absolute top-0 left-0 w-full object-cover object-top -mt-24"
              style={{
                height: 'calc(320px + 2rem)', // Keep original height calculation
                zIndex: 1, // Ensure it's behind content but visible
                opacity: 0.9 // Slightly reduce opacity to help with text visibility
              }}
            />

            {/* Content wrapper with z-index to sit above background */}
            <div className="relative z-10">

            {/* Header section */}
             <div className="text-center mb-12 pt-72 relative z-20">
               <h1 className="text-4xl font-serif tracking-wide text-[#1B365D] pl-12 pr-12">
                 {title}
               </h1>
               {/* embellishment */}
               <div 
                 className="h-12 bg-contain bg-no-repeat bg-center"
                 style={{
                   backgroundImage: 'url(/images/embellishment.png)',
                 }} 
               />
             </div>
            </div>
          </div>

          {/* Children content */}
          <div className={`relative z-20 bg-white pt-8 ${className}`}>
            <div className="text-center">
            <p className="text-[#1B365D] italic p-6 ml-12 mr-12 mb-8">
              {subtitle}
            </p>
            </div>
            <div className={`pb-12 relative ${className}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTemplate;