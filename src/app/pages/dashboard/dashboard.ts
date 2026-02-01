import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { TrackerService } from '../../services/tracker';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  service = inject(TrackerService);
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('profitChart');
  private chart?: Chart;

  sale = { productName: '', sellingPrice: 0, hhcCost: 0, adSpend: 0, date: new Date().toISOString().split('T')[0] };

  constructor() {
    effect(() => this.updateChart(this.service.allSales()));
  }

  submit() {
    this.service.addSale({...this.sale});
    this.sale.productName = '';
  }

  private updateChart(sales: any[]) {
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const data = last7Days.map(date => 
      sales.filter(s => s.date === date).reduce((acc, s) => acc + s.profit, 0)
    );

    if (this.chart) this.chart.destroy();
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: last7Days,
        datasets: [{ label: 'Profit', data, borderColor: '#0d6efd', tension: 0.4, fill: true, backgroundColor: 'rgba(13,110,253,0.1)' }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
    confirmDelete(id: string) {
  // Adding a simple confirmation prevents accidental data loss
  if (confirm('Are you sure you want to remove this record? This will update your total profit and ROAS metrics.')) {
    this.service.deleteSale(id);
  }
}
}
