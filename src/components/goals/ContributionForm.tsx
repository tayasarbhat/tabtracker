import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onContribute: (amount: number, date: string) => void;
  onCancel: () => void;
  goalName: string;
}

export default function ContributionForm({ onContribute, onCancel, goalName }: Props) {
  const [amount, setAmount] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contributionAmount = parseFloat(amount);
    if (contributionAmount > 0) {
      onContribute(contributionAmount, date);
      setAmount('');
      setDate(today);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Amount for {goalName}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white/90 placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter contribution amount"
          step="0.01"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          max={today}
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 text-sm border border-white/20 text-white/90 rounded-lg hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-3 py-2 text-sm bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center border border-blue-500/30"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Contribution
        </button>
      </div>
    </form>
  );
}