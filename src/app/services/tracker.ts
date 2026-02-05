import { Injectable, signal, computed, effect } from '@angular/core';
import { Transaction, WinningProduct } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class TrackerService {
  // State Signals
  private sales = signal<Transaction[]>(this.load('sales'));
  private winners = signal<WinningProduct[]>(this.load('winners'));

  // Read-only Selectors
  allSales = this.sales.asReadonly();
  allWinners = this.winners.asReadonly();

  // Computed Metrics
  todayProfit = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.sales()
      .filter((s) => s.date === today)
      .reduce((acc, s) => acc + s.profit, 0);
  });

  monthProfit = computed(() => {
    const month = new Date().toISOString().slice(0, 7);
    return this.sales()
      .filter((s) => s.date.startsWith(month))
      .reduce((acc, s) => acc + s.profit, 0);
  });

  constructor() {
    // Sync to LocalStorage automatically
    effect(() => localStorage.setItem('sales', JSON.stringify(this.sales())));
    effect(() => localStorage.setItem('winners', JSON.stringify(this.winners())));
  }

  // --- Sales Actions ---
  addSale(data: Omit<Transaction, 'id' | 'profit' | 'status'>) {
  // Logic: (Revenue - Product Cost) * Qty - Ads
  const totalRevenue = data.sellingPrice * data.quantity;
  const totalProductCost = data.hhcCost * data.quantity;
  const profit = totalRevenue - totalProductCost - data.adSpend;

  this.sales.update(prev => [{ 
    ...data, 
    id: crypto.randomUUID(), 
    profit, 
    status: 'Delivered' 
  }, ...prev]);
}

  toggleReturn(id: string) {
    this.sales.update((list) =>
      list.map((s) => {
        if (s.id !== id) return s;
        const isReturning = s.status === 'Delivered';
        const newStatus = isReturning ? 'Returned' : 'Delivered';
        const profit = (isReturning ? 0 : s.sellingPrice) - (s.hhcCost + s.adSpend);
        return { ...s, status: newStatus, profit };
      }),
    );
  }

  // --- Winners Actions ---
  addWinner(name: string) {
    if (!name) return;
    this.winners.update((prev) => [{ id: crypto.randomUUID(), name }, ...prev]);
  }

  deleteWinner(id: string) {
    this.winners.update((prev) => prev.filter((w) => w.id !== id));
  }

  importWinnersCSV(names: string[]) {
    const newWinners = names.map((name) => ({ id: crypto.randomUUID(), name: name.trim() }));
    this.winners.update((prev) => [...newWinners, ...prev]);
  }

  // --- Export Logic ---
  downloadCSV(type: 'daily' | 'monthly') {
    const today = new Date().toISOString().split('T')[0];
    const month = today.slice(0, 7);
    const data = this.sales().filter((s) =>
      type === 'daily' ? s.date === today : s.date.startsWith(month),
    );

    const headers = 'Date,Product,Price,HHC Cost,Ads,Status,Profit,ROAS\n';
    const csv = data
      .map(
        (s) =>
          `${s.date},${s.productName},${s.sellingPrice},${s.hhcCost},${s.adSpend},${s.status},${s.profit},${s.adSpend > 0 ? ((s.sellingPrice * s.quantity) / s.adSpend).toFixed(2) : 'N/A'}`,
      )
      .join('\n');

    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HHC_${type}_Report_${today}.csv`;
    a.click();
  }

  private load(key: string) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : [];
  }
  // 1. RTO Rate Calculation
  rtoRate = computed(() => {
    const total = this.allSales().length;
    if (total === 0) return 0;
    const returned = this.allSales().filter((s) => s.status === 'Returned').length;
    return (returned / total) * 100;
  });

  // 2. Global ROAS (Revenue / Ad Spend)
 globalRoas = computed(() => {
  const allSales = this.allSales();
  if (allSales.length === 0) return 0;

  // Sum up Total Revenue (Price * Quantity)
  const totalRevenue = allSales.reduce((acc, s) => {
    // Only count delivered items for ROAS
    return s.status === 'Delivered' ? acc + (s.sellingPrice * s.quantity) : acc;
  }, 0);
  // Sum up Total Ad Spend (This is already the total for the entry)
  const totalAds = allSales.reduce((acc, s) => acc + s.adSpend, 0);

  return totalAds > 0 ? (totalRevenue / totalAds) : 0;
});

  // 3. Product Performance Analysis (Scale vs Kill)
  productAnalysis = computed(() => {
  const stats = new Map<string, { rev: number, ads: number, rto: number, count: number }>();
  
  this.allSales().forEach(s => {
    const current = stats.get(s.productName) || { rev: 0, ads: 0, rto: 0, count: 0 };
    
    // Revenue must be Price * Quantity
    if (s.status === 'Delivered') {
        current.rev += (s.sellingPrice * s.quantity);
    } else {
        current.rto += s.quantity; // Track RTO units
    }
    
    current.ads += s.adSpend;
    current.count += s.quantity; // Total units sold
    stats.set(s.productName, current);
  });

  return Array.from(stats.entries()).map(([name, data]) => {
    const roas = data.ads > 0 ? (data.rev / data.ads) : 0;
    const rtoPerc = (data.rto / data.count) * 100;
    
    let recommendation = 'HOLD';
    if (roas >= 3 && rtoPerc < 20) recommendation = 'SCALE';
    else if (roas < 2 || rtoPerc > 30) recommendation = 'KILL';

    return { name, roas, rtoPerc, recommendation };
  });
});
  deleteSale(id: string) {
    // Senior Engineer Tip: Always use a functional update to ensure state consistency
    this.sales.update((list) => list.filter((sale) => sale.id !== id));
  }
  clearAllData() {
    if (
      confirm(
        'WARNING: This will permanently delete ALL sales data and winning products. This action cannot be undone. Proceed?',
      )
    ) {
      this.sales.set([]);
      this.winners.set([]);
      localStorage.clear(); // Wipes the LocalStorage clean
    }
  }
}
