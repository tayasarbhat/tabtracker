import { Transaction } from '../../types';
import { formatCurrency } from '../currency';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateTransactionPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Transaction Report', 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  // Prepare table data
  const tableRows = transactions.map(transaction => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.description,
    transaction.type === 'expense' ? '-' : '+',
    formatCurrency(Math.abs(transaction.amount)),
  ]);

  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Add table
  autoTable(doc, {
    startY: 40,
    head: [['Date', 'Description', 'Type', 'Amount']],
    body: tableRows,
    theme: 'striped',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(10);
  doc.text(`Total Income: ${formatCurrency(income)}`, 14, finalY + 10);
  doc.text(`Total Expenses: ${formatCurrency(expenses)}`, 14, finalY + 20);
  doc.text(`Net Balance: ${formatCurrency(income - expenses)}`, 14, finalY + 30);

  return doc;
};