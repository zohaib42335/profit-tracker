export type TransactionStatus = 'Delivered' | 'Returned';

export interface Transaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  productName: string;
  sellingPrice: number;
  hhcCost: number;
  adSpend: number;
  profit: number;
  status: TransactionStatus;
}
export interface WinningProduct {
  id: string;
  name: string;
}