import React, { useRef, useEffect } from 'react';

interface HorizontalWheelPickerProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const HorizontalWheelPicker: React.FC<HorizontalWheelPickerProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Scroll to selected item on mount or value change
  useEffect(() => {
    if (!containerRef.current) return;
    const selectedElement = containerRef.current.children[value - min] as HTMLElement;
    if (selectedElement) {
      const containerWidth = containerRef.current.clientWidth;
      const elementLeft = selectedElement.offsetLeft;
      const elementWidth = selectedElement.clientWidth;
      containerRef.current.scrollTo({
        left: elementLeft - containerWidth / 2 + elementWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [value, min]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 44,
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        border: '1.5px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Center Active Highlight Box */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 4,
          bottom: 4,
          width: 40,
          transform: 'translateX(-50%)',
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          border: '1.5px solid #5C8D89',
          boxShadow: '0 2px 6px rgba(92, 141, 137, 0.15)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          width: '100%',
          height: '100%',
          paddingLeft: 'calc(50% - 20px)',
          paddingRight: 'calc(50% - 20px)',
          boxSizing: 'border-box',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((num) => {
          const isSelected = num === value;
          return (
            <div
              key={num}
              onClick={() => onChange(num)}
              style={{
                flex: '0 0 40px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                fontSize: isSelected ? 16 : 13,
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#5C8D89' : '#9CA3AF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                zIndex: 2,
                userSelect: 'none',
                boxSizing: 'border-box',
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};
