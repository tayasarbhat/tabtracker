import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import GoalList from './GoalList';
import GoalModal from './GoalModal';

export default function GoalsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white/90">Financial Goals</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-colors border border-blue-500/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Goal
        </button>
      </div>
      
      <GoalList />
      
      {isModalOpen && (
        <GoalModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}