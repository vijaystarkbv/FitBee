import React from 'react';
import { ParsedFoodItem } from '../../types/database.types';

interface FoodBreakdownProps {
  items: ParsedFoodItem[];
  onUpdateItemName: (index: number, newName: string) => void;
  onUpdateItemQuantity: (index: number, newQtyStr: string) => void;
  onDeleteItem: (index: number) => void;
  onAddItemManually: () => void;
}

export const FoodBreakdown: React.FC<FoodBreakdownProps> = ({
  items,
  onUpdateItemName,
  onUpdateItemQuantity,
  onDeleteItem,
  onAddItemManually,
}) => {
  return (
    <div className="space-y-3 pt-3 border-t border-zinc-800">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-zinc-300">Estimated Food Item Breakdown</h4>
        <button
          type="button"
          onClick={onAddItemManually}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          + Add Item Manually
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-zinc-500 py-2">No food items parsed yet. Type a meal above or click Add Item Manually.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs"
            >
              {/* Editable Name & Quantity */}
              <div className="flex-1 pr-3 space-y-1">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onUpdateItemName(idx, e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 font-semibold text-zinc-200 px-2 py-0.5 rounded text-xs w-full"
                  placeholder="Food Name"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500">Qty:</span>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => onUpdateItemQuantity(idx, e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded text-[11px] w-28"
                  />
                </div>
              </div>

              {/* Item Macros */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="font-bold text-amber-400 block">{item.calories} kcal</span>
                  <span className="text-[10px] text-zinc-400">
                    P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteItem(idx)}
                  className="text-zinc-500 hover:text-red-400 p-1 font-bold text-sm transition-colors"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
