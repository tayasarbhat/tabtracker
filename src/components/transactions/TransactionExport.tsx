import React from 'react';
import { Download } from 'lucide-react';
import { Transaction } from '../../types';
import { generateTransactionPDF } from '../../utils/pdf/generateTransactionPDF';

interface Props {
  transactions: Transaction[];
}

export default function TransactionExport({ transactions }: Props) {
  const handleExport = () => {
    try {
      const doc = generateTransactionPDF(transactions);
      doc.save(`transactions-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-colors border border-blue-500/30"
    >
      <Download className="w-4 h-4" />
      Export PDF
    </button>
  );
}