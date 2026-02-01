import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../services/tracker';

@Component({
  selector: 'app-winners',
  imports: [CommonModule, FormsModule],
  templateUrl: './winners.html',
  styleUrl: './winners.css',
})
export class Winners {
  service = inject(TrackerService);
  name = '';

  add() { 
    this.service.addWinner(this.name); 
    this.name = ''; 
  }

  import(ev: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const names = (e.target?.result as string).split('\n').filter(n => n.trim());
      this.service.importWinnersCSV(names);
    };
    reader.readAsText(ev.target.files[0]);
  }

}
