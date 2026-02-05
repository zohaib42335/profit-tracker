import { Component, inject, viewChild, ElementRef, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { TrackerService } from './services/tracker';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'HHC Profit Tracker';
  service = inject(TrackerService);

  isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

  closeOnMobile() {
    if (window.innerWidth < 992) {
      this.isSidebarOpen.set(false);
    }
  }
  }
 


  