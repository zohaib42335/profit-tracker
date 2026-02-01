import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Winners } from './pages/winners/winners';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'winners', component: Winners }
];
