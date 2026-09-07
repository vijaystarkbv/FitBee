import React, { useState } from 'react';
import { DayPerformancePoint } from '../../services/workoutHistoryService';

interface WorkoutPerformanceGraphProps {
  dayPoints: DayPerformancePoint[];
  isBaselineOnly?: boolean;
}

export const WorkoutPerformanceGraph: React.FC<WorkoutPerformanceGraphProps> = ({
  dayPoints,
  isBaselineOnly = false,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    dayLabel: string;
    dayName: string;
    pct: number;
    exerciseNames: string[];
  } | null>(null);

  // Filter only comparable workout days
  const validPoints = dayPoints.filter((p) => p.isComparable);

  if (validPoints.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#FAFAF8',
          borderRadius: 20,
          padding: '28px 20px',
          textAlign: 'center',
          border: '1px dashed #E8E8E6',
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', margin: 0 }}>
          No comparable workout data available for this week yet.
        </p>
      </div>
    );
  }

  // Dimensions
  const width = 460;
  const height = 170;
  const padLeft = 40;
  const padRight = 36;
  const padTop = 30;
  const padBottom = 34;

  // Y Scale: 50% to 150%+
  const pcts = validPoints.map((p) => p.performancePct);
  const minData = Math.min(...pcts);
  const maxData = Math.max(...pcts);

  const minY = Math.min(50, Math.floor((minData - 5) / 10) * 10);
  const maxY = Math.max(150, Math.ceil((maxData + 10) / 10) * 10);

  const getY = (pct: number) => {
    const clamped = Math.max(minY, Math.min(maxY, pct));
    const ratio = (clamped - minY) / (maxY - minY);
    return height - padBottom - ratio * (height - padTop - padBottom);
  };

  const getX = (index: number) => {
    if (validPoints.length === 1) {
      return (width - padLeft - padRight) / 2 + padLeft;
    }
    const usableWidth = width - padLeft - padRight;
    return padLeft + (index / (validPoints.length - 1)) * usableWidth;
  };

  const baselineY = getY(100);

  // Red line (100% baseline) coordinates
  const redPoints = validPoints.map((_, i) => ({ x: getX(i), y: baselineY }));
  const redPathD =
    redPoints.length === 1
      ? `M ${redPoints[0].x - 30} ${baselineY} L ${redPoints[0].x + 30} ${baselineY}`
      : redPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Blue line (Current relative performance) coordinates
  const bluePoints = validPoints.map((p, i) => ({
    x: getX(i),
    y: getY(p.performancePct),
    point: p,
  }));

  const bluePathD =
    bluePoints.length === 1
      ? `M ${bluePoints[0].x - 30} ${bluePoints[0].y} L ${bluePoints[0].x + 30} ${bluePoints[0].y}`
      : bluePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* Chart Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Blue Current Line legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#6B9FE8',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
              {isBaselineOnly ? 'Current (100% Baseline)' : 'Current Week'}
            </span>
          </div>

          {/* Red Baseline Line legend */}
          {!isBaselineOnly && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#C96A6A',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
                Previous Baseline (100%)
              </span>
            </div>
          )}
        </div>

        {isBaselineOnly && (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
            First week sets baseline
          </span>
        )}
      </div>

      {/* SVG Chart Container */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          overflow: 'visible',
          display: 'block',
        }}
      >
        <defs>
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#6B9FE8" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Subtle Horizontal Reference Grid Lines: 150%, 100%, 50% */}
        {[150, 100, 50].map((level) => {
          const y = getY(level);
          return (
            <g key={level}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke={level === 100 ? '#E8E8E6' : '#F3F4F6'}
                strokeWidth={level === 100 ? 1.5 : 1}
                strokeDasharray={level === 100 ? undefined : '3 3'}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fontWeight={level === 100 ? 700 : 500}
                fill={level === 100 ? '#9CA3AF' : '#D1D5DB'}
                fontFamily="'Inter', sans-serif"
              >
                {level}%
              </text>
            </g>
          );
        })}

        {/* Red Baseline Line (Previous Week at 100%) */}
        {!isBaselineOnly && (
          <g>
            <path
              d={redPathD}
              fill="none"
              stroke="#C96A6A"
              strokeWidth={2.4}
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
            {redPoints.map((rp, i) => (
              <circle
                key={`red-dot-${i}`}
                cx={rp.x}
                cy={rp.y}
                r={4}
                fill="#FFFFFF"
                stroke="#C96A6A"
                strokeWidth={2}
              />
            ))}
          </g>
        )}

        {/* Blue Performance Line (Current Week) */}
        <path
          d={bluePathD}
          fill="none"
          stroke="#6B9FE8"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#soft-glow)"
        />

        {/* Blue Interactive Dots */}
        {bluePoints.map((bp, i) => {
          const isSelected = activeTooltip?.dayName === bp.point.dayName;
          return (
            <g
              key={`blue-dot-${i}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() =>
                setActiveTooltip({
                  x: bp.x,
                  y: bp.y,
                  dayLabel: bp.point.dayLabel,
                  dayName: bp.point.dayName,
                  pct: bp.point.performancePct,
                  exerciseNames: bp.point.exerciseNames,
                })
              }
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() =>
                setActiveTooltip((prev) =>
                  prev?.dayName === bp.point.dayName
                    ? null
                    : {
                        x: bp.x,
                        y: bp.y,
                        dayLabel: bp.point.dayLabel,
                        dayName: bp.point.dayName,
                        pct: bp.point.performancePct,
                        exerciseNames: bp.point.exerciseNames,
                      }
                )
              }
            >
              {/* Outer touch halo */}
              <circle cx={bp.x} cy={bp.y} r={18} fill="transparent" />

              {/* Pulse / Highlight when hovered */}
              {isSelected && (
                <circle cx={bp.x} cy={bp.y} r={9} fill="#6B9FE8" opacity={0.25} />
              )}

              {/* Dot Center */}
              <circle
                cx={bp.x}
                cy={bp.y}
                r={isSelected ? 6 : 5}
                fill="#6B9FE8"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                style={{ transition: 'all 150ms ease' }}
              />

              {/* Day Label Below X-axis */}
              <text
                x={bp.x}
                y={height - 8}
                textAnchor="middle"
                fontSize={11}
                fontWeight={isSelected ? 750 : 600}
                fill={isSelected ? '#1F2937' : '#6B7280'}
                fontFamily="'Inter', sans-serif"
              >
                {bp.point.dayLabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {activeTooltip && (
        <div
          style={{
            position: 'absolute',
            left: `${(activeTooltip.x / width) * 100}%`,
            top: `${Math.max(0, (activeTooltip.y / height) * 100 - 32)}%`,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#1F2937',
            color: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            zIndex: 20,
            animation: 'fadeIn 120ms ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{activeTooltip.dayName}:</span>
            <span style={{ color: activeTooltip.pct >= 100 ? '#86EFAC' : '#FCA5A5', fontWeight: 700 }}>
              {activeTooltip.pct}%
            </span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#D1D5DB', marginTop: 2 }}>
            {activeTooltip.exerciseNames.length} {activeTooltip.exerciseNames.length === 1 ? 'exercise' : 'exercises'}
          </div>
        </div>
      )}
    </div>
  );
};
