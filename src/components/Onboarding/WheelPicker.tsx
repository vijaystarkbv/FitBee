import React, { useRef, useEffect, useCallback } from 'react';

interface WheelPickerProps {
  items: { value: number; label: string }[];
  selectedValue: number;
  onChange: (value: number) => void;
  unitLabel?: string;
}

const ITEM_HEIGHT = 44;

export const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  selectedValue,
  onChange,
  unitLabel,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScroll = useRef(true);

  /* ── Scroll to the selected value on mount and when selectedValue changes externally ── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const index = items.findIndex((i) => i.value === selectedValue);
    if (index < 0) return;
    isUserScroll.current = false;
    container.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
    const timer = setTimeout(() => { isUserScroll.current = true; }, 300);
    return () => clearTimeout(timer);
  }, [selectedValue, items]);

  /* ── Handle scroll-snap settling ── */
  const handleScroll = useCallback(() => {
    if (!isUserScroll.current) return;
    const container = scrollRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    const item = items[clamped];
    if (item && item.value !== selectedValue) {
      onChange(item.value);
    }
  }, [items, selectedValue, onChange]);

  /* ── Debounce scroll events ── */
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();
  const onScroll = useCallback(() => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(handleScroll, 60);
  }, [handleScroll]);

  /* ── Click to select ── */
  const handleItemClick = (value: number) => {
    onChange(value);
  };

  return (
    <div>
      <div className="ob-wheel-container">
        <div className="ob-wheel-highlight" />
        <div
          ref={scrollRef}
          className="ob-wheel-scroll"
          onScroll={onScroll}
        >
          {items.map((item) => (
            <div
              key={item.value}
              className={`ob-wheel-item${item.value === selectedValue ? ' active' : ''}`}
              onClick={() => handleItemClick(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      {unitLabel && <div className="ob-wheel-unit-label">{unitLabel}</div>}
    </div>
  );
};
