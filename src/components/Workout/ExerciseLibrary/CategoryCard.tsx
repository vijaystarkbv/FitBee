import React from 'react';
import { StickerIcon } from './StickerIcon';

interface CategoryCardProps {
  title: string;
  stickerKey?: string;
  numberBadge?: number;
  onClick: () => void;
  badgeText?: string;
  badgeClass?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  stickerKey,
  numberBadge,
  onClick,
  badgeText,
  badgeClass,
}) => {
  return (
    <div className="exlib-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="exlib-sticker">
        {numberBadge !== undefined ? (
          <span className="exlib-number-badge">{numberBadge}</span>
        ) : stickerKey ? (
          <StickerIcon stickerKey={stickerKey} size={64} />
        ) : null}
      </div>

      <div className="exlib-card-content">
        <div>
          <h3 className="exlib-card-title">{title}</h3>
          {badgeText && (
            <div style={{ marginTop: 4 }}>
              <span className={`exlib-diff-pill ${badgeClass || ''}`}>{badgeText}</span>
            </div>
          )}
        </div>

        <div className="exlib-card-chevron">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
