import React from 'react';

interface PolaroidProps {
  imageSrc: string;
  top: string;
  left?: string;
  right?: string;
  rotation: number;
}

const Polaroid: React.FC<PolaroidProps> = ({ imageSrc, top, left, right, rotation }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top,
    transform: `rotate(${rotation}deg)`,
    width: '200px',
    height: '240px',
    padding: '15px 15px 55px 15px',
    backgroundColor: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    border: '1px solid #ddd'
  };

  if (left) {
    style.left = left;
  }
  if (right) {
    style.right = right;
  }

  return (
    <div style={style}>
      <img src={imageSrc} alt="" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
    </div>
  );
};

export default Polaroid;
