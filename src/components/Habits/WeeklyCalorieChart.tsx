import React, { useState } from 'react';
import { DayMacroSummary } from '../../services/nutritionHistoryService';

interface WeeklyCalorieChartProps {
  days: DayMacroSummary[];
  targetCalories: number;
  todayDateStr: string;
}

export const WeeklyCalorieChart: React.FC<WeeklyCalorieChartProps> = ({
  days,
  targetCalories,
  todayDateStr,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Collect calories values for scaling
  const loggedCalories = days
    .map((d) => (d.log && d.log.total_calories > 0 ? d.log.total_calories : null))
    .filter((v): v is number => v !== null);

  // Determine chart vertical range
  const maxCal = Math.max(targetCalories * 1.2, ...(loggedCalories.length > 0 ? loggedCalories : [targetCalories]));
  const maxY = Math.ceil(maxCal / 200) * 200;
  const minY = 0;

  // Chart coordinates
  const width = 420;
  const height = 190;
  const paddingLeft = 46;
  const paddingRight = 32;
  const paddingTop = 26;
  const paddingBottom = 38;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartBottom = height - paddingBottom;

  const getX = (index: number) => paddingLeft + index * (chartWidth / 6);
  const getY = (val: number) => chartBottom - ((val - minY) / (maxY - minY)) * chartHeight;

  const targetY = getY(targetCalories);

  // Points with coordinates
  const points = days.map((d, index) => {
    const hasLog = Boolean(d.log && d.log.total_calories > 0);
    const calories = hasLog && d.log ? d.log.total_calories : 0;
    const x = getX(index);
    const y = getY(calories);
    const isToday = d.dateStr === todayDateStr;

    return {
      ...d,
      index,
      x,
      y,
      hasLog,
      calories,
      isToday,
    };
  });

  // Build SVG path for valid points
  const validPoints = points.filter((p) => p.hasLog);

  let pathD = '';
  if (validPoints.length > 1) {
    pathD = `M ${validPoints[0].x} ${validPoints[0].y}`;
    for (let i = 1; i < validPoints.length; i++) {
      // Smooth curve or clean connected line
      const prev = validPoints[i - 1];
      const curr = validPoints[i];
      const cx = (prev.x + curr.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  } else if (validPoints.length === 1) {
    pathD = `M ${validPoints[0].x} ${validPoints[0].y} L ${validPoints[0].x} ${validPoints[0].y}`;
  }

  // Gradient area under curve
  let areaD = '';
  if (validPoints.length > 1) {
    const first = validPoints[0];
    const last = validPoints[validPoints.length - 1];
    areaD = `${pathD} L ${last.x} ${chartBottom} L ${first.x} ${chartBottom} Z`;
  }

  // Grid levels (e.g. 0, midpoint, target, maxY)
  const midCal = Math.round(maxY / 2);
  const gridLevels = [
    { val: maxY, y: getY(maxY), label: `${maxY}` },
    { val: midCal, y: getY(midCal), label: `${midCal}` },
    { val: 0, y: chartBottom, label: '0' },
  ];

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: '16px 8px 10px',
        userSelect: 'none',
      }}
    >
      {/* Tooltip Overlay */}
      {activePoint && (
        <div
          style={{
            position: 'absolute',
            left: `${(activePoint.x / width) * 100}%`,
            top: 6,
            transform: 'translateX(-50%)',
            backgroundColor: '#1F2937',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 10,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 120ms ease',
          }}
        >
          <span>{activePoint.fullDayName}:</span>
          <span style={{ color: activePoint.hasLog ? '#A7F3D0' : '#D1D5DB' }}>
            {activePoint.hasLog ? `${activePoint.calories.toLocaleString()} kcal` : 'No meal log'}
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id="calorieAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C8D89" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#5C8D89" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Background Grid Lines */}
        {gridLevels.map((lvl) => (
          <g key={lvl.val}>
            <line
              x1={paddingLeft}
              y1={lvl.y}
              x2={width - paddingRight}
              y2={lvl.y}
              stroke="#F3F4F6"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 8}
              y={lvl.y + 3.5}
              textAnchor="end"
              fill="#9CA3AF"
              fontSize="10"
              fontFamily="'Inter', sans-serif"
              fontWeight="500"
            >
              {lvl.label}
            </text>
          </g>
        ))}

        {/* Calorie Target Reference Line */}
        {targetCalories > 0 && targetY >= paddingTop && targetY <= chartBottom && (
          <g>
            <line
              x1={paddingLeft}
              y1={targetY}
              x2={width - paddingRight}
              y2={targetY}
              stroke="#89B0AE"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Target Pill Label on Right */}
            <rect
              x={width - paddingRight - 66}
              y={targetY - 10}
              width="66"
              height="20"
              rx="6"
              fill="#F4F8F7"
              stroke="#89B0AE"
              strokeWidth="0.8"
            />
            <text
              x={width - paddingRight - 33}
              y={targetY + 3.5}
              textAnchor="middle"
              fill="#4A7A76"
              fontSize="9"
              fontFamily="'Inter', sans-serif"
              fontWeight="700"
            >
              {targetCalories} kcal
            </text>
          </g>
        )}

        {/* Gradient Area under Path */}
        {areaD && <path d={areaD} fill="url(#calorieAreaGradient)" />}

        {/* Connected Line Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#5C8D89"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Interactive Column Hover Strips & Points */}
        {points.map((p) => {
          const isHovered = hoveredIndex === p.index;

          return (
            <g
              key={p.index}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(p.index)}
              onTouchStart={() => setHoveredIndex(p.index)}
            >
              {/* Invisible touch/hover target column (min 44px wide) */}
              <rect
                x={p.x - 22}
                y={paddingTop}
                width="44"
                height={chartHeight + paddingBottom}
                fill="transparent"
              />

              {/* Hover vertical subtle guide */}
              {isHovered && (
                <line
                  x1={p.x}
                  y1={paddingTop}
                  x2={p.x}
                  y2={chartBottom}
                  stroke="#5C8D89"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
              )}

              {/* Data Point Dot */}
              {p.hasLog ? (
                <g>
                  {/* Outer pulse when active */}
                  {isHovered && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      fill="rgba(92, 141, 137, 0.2)"
                    />
                  )}
                  {/* Point circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4.5}
                    fill="#5C8D89"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    style={{ transition: 'r 150ms ease' }}
                  />
                </g>
              ) : (
                /* No Log indicator marker on the baseline */
                <g>
                  <circle
                    cx={p.x}
                    cy={chartBottom}
                    r="3.5"
                    fill="#E5E7EB"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Day Label below axis (M, T, W, TH, F, S, SU) */}
              <g>
                {p.isToday && (
                  <rect
                    x={p.x - 12}
                    y={chartBottom + 10}
                    width="24"
                    height="18"
                    rx="6"
                    fill="#5C8D89"
                  />
                )}
                <text
                  x={p.x}
                  y={chartBottom + (p.isToday ? 22.5 : 22)}
                  textAnchor="middle"
                  fill={p.isToday ? '#FFFFFF' : isHovered ? '#1F2937' : '#6B7280'}
                  fontSize={p.isToday ? '10' : '11'}
                  fontFamily="'Inter', sans-serif"
                  fontWeight={p.isToday || isHovered ? '700' : '500'}
                >
                  {p.dayLabel}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
