import React, { useState } from 'react';

interface StickerIconProps {
  stickerKey: string;
  size?: number;
  className?: string;
}

export const StickerIcon: React.FC<StickerIconProps> = ({ stickerKey, size = 64 }) => {
  const [imageError, setImageError] = useState(false);

  // Map sticker keys to file names
  const fileNameMap: Record<string, string> = {
    'stretches': 'stretches',
    'chest': 'chest',
    'back': 'back',
    'shoulders': 'shoulders',
    'arms': 'arms',
    'core': 'core',
    'legs': 'legs',
    'neck': 'neck',
    'hips': 'hips',
    'calves': 'calves',
    'ankles-calves': 'ankles-calves',
    'wrists': 'wrists',
    'fullbody': 'fullbody',
  };

  const imageFileName = fileNameMap[stickerKey] || 'stretches';
  const imageSrc = `/icons/muscle-groups/${imageFileName}.png`;

  if (!imageError) {
    return (
      <img
        src={imageSrc}
        alt={stickerKey}
        onError={() => setImageError(true)}
        className="exlib-sticker-img"
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: 20,
          display: 'block',
        }}
      />
    );
  }

  // Fallback SVG in case image fails to load
  return (
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#466761" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
};
