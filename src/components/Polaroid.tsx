import React from 'react';

interface PolaroidProps {
  imageSrc: string;
  top?: string;
  left?: string;
  right?: string;
  rotation: number;
  isMobile?: boolean;
}

const Polaroid: React.FC<PolaroidProps> = ({ imageSrc, top, left, right, rotation, isMobile = false }) => {
  const style: React.CSSProperties = {
    width: isMobile ? '100%' : '200px',
    height: isMobile ? '100%' : '240px',
    padding: '15px 15px 55px 15px',
    backgroundColor: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    border: '1px solid #ddd',
    transform: `rotate(${rotation}deg)`,
  };

  if (!isMobile) {
    style.position = 'absolute';
    style.top = top;
    if (left) {
      style.left = left;
    }
    if (right) {
      style.right = right;
    }
  }

  return (
    <div style={style}>
      <img src={imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};

export default Polaroid;
