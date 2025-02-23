import React from 'react';

type PageTemplateProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

const PageTemplate: React.FC<PageTemplateProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}) => {
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
            className="absolute inset-0 w-full h-full object-cover object-center opacity-95"
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
        </div>
        
        {/* Main content wrapper with relative positioning */}
        <div className="relative z-10">          
          {/* Text content */}
          {/* Content */}
          <div className={`${className}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTemplate;