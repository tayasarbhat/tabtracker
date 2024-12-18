import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Goal, Category, CreditDebitAccount } from '../types/baseTypes';
import { initialCategories } from '../data/initialData';
import { useTransactions } from '../hooks/useTransactions';

interface State {
  transactions: Transaction[];
  goals: Goal[];
  categories: Category[];
  creditDebitAccounts: CreditDebitAccount[];
}

const initialState: State = {
  transactions: [],
  goals: [],
  categories: initialCategories,
  creditDebitAccounts: [],
};

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_CONTRIBUTION'; payload: { goalId: string; contribution: { id: string; amount: number; date: string } } }
  | { type: 'DELETE_CONTRIBUTION'; payload: { goalId: string; contributionId: string } }
  | { type: 'ADD_CREDIT_DEBIT_ACCOUNT'; payload: CreditDebitAccount }
  | { type: 'UPDATE_CREDIT_DEBIT_ACCOUNT'; payload: CreditDebitAccount }
  | { type: 'DELETE_CREDIT_DEBIT_ACCOUNT'; payload: string }
  | { type: 'ADD_CREDIT_DEBIT_TRANSACTION'; payload: { accountId: string; transaction: any } };

function expenseReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    // ... rest of your reducer cases remain the same
    default:
      return state;
  }
}

const ExpenseContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();

  // Sync transactions from Supabase
  useEffect(() => {
    if (!loading) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    }
  }, [transactions, loading]);

  // Wrap the dispatch to handle Supabase operations
  const wrappedDispatch = async (action: Action) => {
    switch (action.type) {
      case 'ADD_TRANSACTION':
        try {
          const newTransaction = await addTransaction(action.payload);
          if (newTransaction) {
            dispatch(action);
          }
        } catch (error) {
          console.error('Error adding transaction:', error);
        }
        break;
      case 'DELETE_TRANSACTION':
        try {
          await deleteTransaction(action.payload);
          dispatch(action);
        } catch (error) {
          console.error('Error deleting transaction:', error);
        }
        break;
      default:
        dispatch(action);
    }
  };

  return (
    <ExpenseContext.Provider value={{ state, dispatch: wrappedDispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}