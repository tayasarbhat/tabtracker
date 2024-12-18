import React from 'react';
import { Goal } from '../../types';
import { useExpense } from '../../context/ExpenseContext';
import GoalItem from './GoalItem';

export default function GoalList() {
  const { state, dispatch } = useExpense();

  const handleDeleteGoal = (id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  const handleContribute = (goalId: string, amount: number, date: string) => {
    dispatch({
      type: 'ADD_CONTRIBUTION',
      payload: {
        goalId,
        contribution: {
          id: crypto.randomUUID(),
          amount,
          date,
        },
      },
    });
  };

  const handleDeleteContribution = (goalId: string, contributionId: string) => {
    dispatch({
      type: 'DELETE_CONTRIBUTION',
      payload: { goalId, contributionId },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {state.goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onDelete={handleDeleteGoal}
          onContribute={handleContribute}
          onDeleteContribution={handleDeleteContribution}
        />
      ))}
      {state.goals.length === 0 && (
        <div className="col-span-2 text-center py-8 text-white/60">
          No financial goals yet. Add a goal to get started!
        </div>
      )}
    </div>
  );
}