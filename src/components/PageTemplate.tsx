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
              className="absolute inset-0 w-full h-full/2 object-cover object-center opacity-95 z-0"
            />

            {/* Flowers top image */}
            <img 
              src="/images/flowers_top.png" 
              alt="Flowers Top" 
              className="absolute top-0 left-0 w-full object-cover object-top -mt-16"
              style={{
                height: 'calc(320px + 2rem)', // Original height + negative margin
                zIndex: 0
              }}
            />

            {/* Content wrapper with z-index to sit above background */}
            <div className="relative z-10">

            {/* Header section */}
             <div className="text-center mb-16 pt-64">
               <h1 className="text-4xl font-serif tracking-wide text-[#1B365D]">
                 {title}
               </h1>
               {/* embellishment */}
               <div 
                 className="h-12 bg-contain bg-no-repeat bg-center"
                 style={{
                   backgroundImage: 'url(/images/embellishment.png)',
                   zIndex: 0,
                 }} 
               />
               <p className="text-[#1B365D] pl-32 pr-32">
                 {subtitle}
               </p>
             </div>
            </div>
          </div>

          {/* Children content */}
          <div className={`relative z-20 bg-gray-100 ${className}`}>
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