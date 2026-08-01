import React, { useState } from 'react';
import { Card } from '../common/Card';
import { WeightLog } from '../../types/database.types';
import { formatDateReadable } from '../../utils/formatters';
import { kgToLbs } from '../../utils/unitConversions';

interface WeightHistoryCardProps {
  currentWeightKg: number;
  weightLogs: WeightLog[];
  weightUnit?: 'kg' | 'lbs';
  onLogNewWeight: (weightKg: number) => Promise<void>;
}

export const WeightHistoryCard: React.FC<WeightHistoryCardProps> = ({
  currentWeightKg,
  weightLogs,
  weightUnit = 'kg',
  onLogNewWeight,
}) => {
  const [newWeightInput, setNewWeightInput] = useState<number>(
    weightUnit === 'kg' ? currentWeightKg : kgToLbs(currentWeightKg)
  );
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  const displayCurrent = weightUnit === 'kg' ? currentWeightKg : kgToLbs(currentWeightKg);

  const handleSaveWeight = async () => {
    setIsLogging(true);
    try {
      const weightInKg = weightUnit === 'kg' ? newWeightInput : newWeightInput * 0.45359237;
      await onLogNewWeight(weightInKg);
      setShowLogModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to log weight');
    } finally {
      setIsLogging(false);
    }
  };

  // Simple SVG Trend Line Calculator
  const sortedLogs = [...weightLogs].sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );

  const points = sortedLogs.map((log, idx) => {
    const val = weightUnit === 'kg' ? log.weight_kg : kgToLbs(log.weight_kg);
    return { x: idx, val };
  });

  const minVal = points.length > 0 ? Math.min(...points.map((p) => p.val)) - 1 : 0;
  const maxVal = points.length > 0 ? Math.max(...points.map((p) => p.val)) + 1 : 100;

  const svgWidth = 300;
  const svgHeight = 60;

  const svgPoints = points
    .map((p, i) => {
      const x = (i / (points.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((p.val - minVal) / (maxVal - minVal || 1)) * svgHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card
      title="Body Weight Tracker"
      action={
        <button
          onClick={() => setShowLogModal(!showLogModal)}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          + Update Weight
        </button>
      }
    >
      <div className="space-y-4">
        {/* Current Weight Banner */}
        <div className="flex items-baseline justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
          <span className="text-xs font-medium text-zinc-400">Current Weight</span>
          <div>
            <span className="text-2xl font-bold text-zinc-100">{displayCurrent}</span>
            <span className="text-xs text-zinc-400 ml-1">{weightUnit}</span>
          </div>
        </div>

        {/* SVG Weight Progress Chart */}
        {points.length > 1 && (
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
              Weight Trend Chart
            </span>
            <div className="bg-zinc-950/80 border border-zinc-800/80 p-2.5 rounded-lg">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-14 overflow-visible">
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={svgPoints}
                />
              </svg>
            </div>
          </div>
        )}

        {/* Modal / In-card form to update weight */}
        {showLogModal && (
          <div className="bg-zinc-950 border border-amber-500/30 p-3.5 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-amber-400">Log New Body Weight</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(parseFloat(e.target.value) || 0)}
                className="input-field"
              />
              <span className="text-xs font-medium text-zinc-400">{weightUnit}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="btn-secondary text-xs py-1.5 w-1/3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWeight}
                disabled={isLogging}
                className="btn-primary text-xs py-1.5 w-2/3"
              >
                {isLogging ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
            Recent Log History
          </span>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {weightLogs.slice(-5).reverse().map((log) => {
              const val = weightUnit === 'kg' ? log.weight_kg : kgToLbs(log.weight_kg);
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-zinc-900/60 rounded border border-zinc-800/60"
                >
                  <span className="text-zinc-400">{formatDateReadable(log.logged_at)}</span>
                  <span className="font-semibold text-zinc-200">
                    {val} {weightUnit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
