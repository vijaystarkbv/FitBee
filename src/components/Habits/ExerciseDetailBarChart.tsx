import React from 'react';
import { ExercisePerformanceComparison, SetDataItem } from '../../services/workoutHistoryService';

interface ExerciseDetailBarChartProps {
  exercises: ExercisePerformanceComparison[];
  type: 'improved' | 'neutral' | 'decreased';
}

export const ExerciseDetailBarChart: React.FC<ExerciseDetailBarChartProps> = ({
  exercises,
  type,
}) => {
  if (exercises.length === 0) {
    return (
      <div
        style={{
          padding: '20px 16px',
          textAlign: 'center',
          color: '#9CA3AF',
          fontSize: 13,
          backgroundColor: '#FAFAF8',
          borderRadius: 16,
          border: '1px dashed #E8E8E6',
        }}
      >
        No exercises in this category for this week.
      </div>
    );
  }

  // Brand colors:
  // Previous week baseline = Blue (#4A80D4)
  // Current week = Red / Coral (#D9534F)
  const prevBarColor = '#4A80D4';
  const currBarColor = '#D9534F';

  const badgeTheme = {
    improved: { bg: '#EAF5EE', color: '#2D6A4F', border: '#C6E8D2' },
    neutral: { bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' },
    decreased: { bg: '#FDEBEB', color: '#A83232', border: '#F8B4B4' },
  }[type];

  // Helper to render set data items as subtle inline data markers (NO BRACKETS, NO SLASHES)
  const renderSetsData = (sets: SetDataItem[], trackingType: 'reps' | 'timer', isWeighted: boolean) => {
    if (!sets || sets.length === 0) {
      return <span style={{ color: '#9CA3AF', fontSize: 12 }}>No sets recorded</span>;
    }

    // Timer: e.g. 3 sets  45s  50s  45s
    if (trackingType === 'timer') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: 11.5, color: '#6B7280', marginRight: 2 }}>{sets.length} sets</span>
          {sets.map((s, idx) => (
            <span
              key={idx}
              style={{
                padding: '2px 7px',
                backgroundColor: '#F3F4F6',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.3,
              }}
            >
              {s.seconds || 0}s
            </span>
          ))}
        </div>
      );
    }

    // Weighted exercises: e.g. 50 kg × 10  50 kg × 10  50 kg × 8
    if (isWeighted) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {sets.map((s, idx) => (
            <span
              key={idx}
              style={{
                padding: '2px 7px',
                backgroundColor: '#F3F4F6',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.3,
              }}
            >
              {s.weight ? `${s.weight} kg × ` : ''}{s.reps || 0}
            </span>
          ))}
        </div>
      );
    }

    // Bodyweight / Rep-based: e.g. 3 sets  10  10  8  reps
    return (
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <span style={{ fontSize: 11.5, color: '#6B7280', marginRight: 2 }}>{sets.length} sets</span>
        {sets.map((s, idx) => (
          <span
            key={idx}
            style={{
              padding: '2px 7px',
              backgroundColor: '#F3F4F6',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: '#374151',
              lineHeight: 1.3,
            }}
          >
            {s.reps || 0}
          </span>
        ))}
        <span style={{ fontSize: 11.5, color: '#6B7280', marginLeft: 2 }}>reps</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ── Top Legend ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '2px 4px 6px',
          fontSize: 11.5,
          fontWeight: 600,
          color: '#6B7280',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: prevBarColor,
              display: 'inline-block',
            }}
          />
          <span>Previous Week (100%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: currBarColor,
              display: 'inline-block',
            }}
          />
          <span>Current Week</span>
        </div>
      </div>

      {/* ── Responsive Grid: 2 Exercises Per Row on Desktop/Tablet, 1 on Mobile ── */}
      <div className="exercise-comparison-grid">

        {exercises.map((ex) => {
          // Dynamic scale: calculate max ceiling so bars never overflow
          const maxScale = Math.max(125, Math.ceil((ex.performancePct + 20) / 25) * 25);
          const chartHeight = 110; // px
          const barWidth = 26; // px

          // Bar heights
          const prevBarHeight = Math.max(12, Math.round((100 / maxScale) * chartHeight));
          const currBarHeight = Math.max(12, Math.round((ex.performancePct / maxScale) * chartHeight));

          // Y-axis ticks (e.g. maxScale, 100%, 50%, 0%)
          const ticks = [maxScale, 100, Math.round(maxScale / 2), 0];
          // Deduplicate and sort descending
          const uniqueTicks = Array.from(new Set(ticks)).sort((a, b) => b - a);

          return (
            <div
              key={ex.exerciseId || ex.exerciseName}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '16px 18px',
                border: '1px solid #E8E8E6',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* ── Exercise Card Header ── */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                      {ex.exerciseName}
                    </h4>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                      {ex.category} · {ex.trackingType === 'timer' ? 'Timer' : ex.isWeighted ? 'Weighted' : 'Bodyweight'}
                    </span>
                  </div>

                  {/* Relative Performance Badge */}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 8,
                      backgroundColor: badgeTheme.bg,
                      color: badgeTheme.color,
                      border: `1px solid ${badgeTheme.border}`,
                      flexShrink: 0,
                    }}
                  >
                    {ex.performancePct}%
                  </span>
                </div>
              </div>

              {/* ── Vertical Grouped Bar Chart (NO internal horizontal grid lines) ── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: chartHeight + 36, // room for top value labels and bottom axis
                  marginBottom: 14,
                  padding: '4px 0 2px',
                  position: 'relative',
                }}
              >
                {/* Left Y-Axis Labels */}
                <div
                  style={{
                    width: 42,
                    height: chartHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingRight: 8,
                    borderRight: '1.5px solid #E5E7EB',
                    flexShrink: 0,
                    userSelect: 'none',
                  }}
                >
                  {uniqueTicks.map((tickVal) => (
                    <span
                      key={tickVal}
                      style={{
                        fontSize: 9.5,
                        fontWeight: tickVal === 100 ? 700 : 500,
                        color: tickVal === 100 ? '#4A80D4' : '#9CA3AF',
                        lineHeight: 1,
                      }}
                    >
                      {tickVal}%
                    </span>
                  ))}
                </div>

                {/* Bars Area (Clean background, NO grid lines) */}
                <div
                  style={{
                    flex: 1,
                    height: chartHeight,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    borderBottom: '1.5px solid #E5E7EB',
                    paddingBottom: 0,
                  }}
                >
                  {/* The Two Bars Group */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 8,
                    }}
                  >
                    {/* Previous Week Bar (Blue) */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* Value above bar */}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: prevBarColor,
                          marginBottom: 3,
                          lineHeight: 1,
                        }}
                      >
                        100%
                      </span>
                      {/* Vertical bar */}
                      <div
                        style={{
                          width: barWidth,
                          height: prevBarHeight,
                          backgroundColor: prevBarColor,
                          borderRadius: '5px 5px 0 0',
                          transition: 'height 250ms ease',
                        }}
                      />
                      {/* X-axis label below bar */}
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: '#6B7280',
                          marginTop: 4,
                        }}
                      >
                        Prev
                      </span>
                    </div>

                    {/* Current Week Bar (Red/Coral) */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* Value above bar */}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: currBarColor,
                          marginBottom: 3,
                          lineHeight: 1,
                        }}
                      >
                        {ex.performancePct}%
                      </span>
                      {/* Vertical bar */}
                      <div
                        style={{
                          width: barWidth,
                          height: currBarHeight,
                          backgroundColor: currBarColor,
                          borderRadius: '5px 5px 0 0',
                          transition: 'height 250ms ease',
                        }}
                      />
                      {/* X-axis label below bar */}
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: currBarColor,
                          marginTop: 4,
                        }}
                      >
                        Curr
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* ── Human-Readable Sets Breakdown & Explanation (Below Graph) ── */}
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 14,
                  padding: '12px 14px',
                  border: '1px solid #E8E8E6',
                  marginTop: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {/* Previous Week Sets */}
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'block',
                      marginBottom: 3,
                    }}
                  >
                    Previous
                  </span>
                  {renderSetsData(ex.prevSetsList, ex.trackingType, ex.isWeighted)}
                </div>

                {/* Current Week Sets */}
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'block',
                      marginBottom: 3,
                    }}
                  >
                    Current
                  </span>
                  {renderSetsData(ex.currSetsList, ex.trackingType, ex.isWeighted)}
                </div>

                {/* Actual Change Explanation Badge */}
                <div
                  style={{
                    paddingTop: 8,
                    borderTop: '1px dashed #E8E8E6',
                    marginTop: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 750,
                      color: badgeTheme.color,
                    }}
                  >
                    {ex.changeExplanation || ex.displayText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
