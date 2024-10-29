import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,  // Ajouter ce module
    MatInputModule,
    MatIconModule,
    CommonModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' } // Configuration du locale en français
  ]
})
export class DashboardComponent implements AfterViewInit {
  constructor(private dateAdapter: DateAdapter<Date>) {
    // Définir le locale du DatePicker
    this.dateAdapter.setLocale('fr-FR');
  }

  ngAfterViewInit() {
    new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: 'Rapports',
          data: [65, 59, 80, 81, 56, 55, 40, 85, 90, 78, 60, 70],
          fill: false,
          borderColor: '#7f82fa',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });
  }
}
