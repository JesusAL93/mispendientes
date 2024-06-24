import { Component, OnInit } from '@angular/core';
import { Note } from '../interface/nota.interface';
import { ActionSheetController } from '@ionic/angular';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  notes: Note[] = [];
  trash: Note[] = [];
  countN: number = 0;
  countD: number = 0;
  countR: number = 0;
  chart: any;

  constructor(private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.loadNotesFromLocalStorage();
    this.loadCountsFromLocalStorage();
    this.generateReportCounts();
    this.createChart();
  }

  loadNotesFromLocalStorage() {
    const notesString = localStorage.getItem('notes');
    const trashString = localStorage.getItem('trash');

    if (notesString) {
      this.notes = JSON.parse(notesString);
    }

    if (trashString) {
      this.trash = JSON.parse(trashString);
    }
  }

  loadCountsFromLocalStorage() {
    const countNString = localStorage.getItem('countN');
    const countDString = localStorage.getItem('countD');
    const countRString = localStorage.getItem('countR');

    if (countNString) {
      this.countN = parseInt(countNString, 10);
    }
    if (countDString) {
      this.countD = parseInt(countDString, 10);
    }
    if (countRString) {
      this.countR = parseInt(countRString, 10);
    }
  }

  generateReportCounts() {
    const newCountN = this.notes.filter(nota => nota.id === 'n').length;
    const newCountR = this.notes.filter(nota => nota.id === 'r').length;
    const newCountD = this.trash.filter(nota => nota.id === 'd').length;

    // Actualizar los conteos acumulados
    this.countN += newCountN;
    this.countR += newCountR;
    this.countD += newCountD;

    // Guardar en localStorage los conteos actualizados
    localStorage.setItem('countN', this.countN.toString());
    localStorage.setItem('countD', this.countD.toString());
    localStorage.setItem('countR', this.countR.toString());

    // Actualizar el gráfico con los nuevos valores
    this.updateChart();
  }

  resetCounts() {
    this.countN = 0;
    this.countD = 0;
    this.countR = 0;

    localStorage.setItem('countN', '0');
    localStorage.setItem('countD', '0');
    localStorage.setItem('countR', '0');

    // Actualizar el gráfico con los valores restablecidos
    this.updateChart();
  }

  getTotalNotesCount(): number {
    return this.notes.length + this.trash.length;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actualizar Reporte',
      buttons: [{
        text: 'Actualizar',
        handler: () => {
          this.updateReport(false);
        }
      }, {
        text: 'Restablecer',
        handler: () => {
          this.updateReport(true);
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  updateReport(reset: boolean = false) {
    if (reset) {
      this.resetCounts();
    } else {
      this.loadNotesFromLocalStorage();
      this.loadCountsFromLocalStorage();
      this.generateReportCounts();
    }
  }

  createChart() {
    const ctx = document.getElementById('notesChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Creadas', 'Eliminadas', 'Restauradas'],
        datasets: [{
          label: 'Número de Notas',
          data: [this.countN, this.countD, this.countR],
          backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0'],
          borderColor: ['#36a2eb', '#ff6384', '#4bc0c0'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.countN, this.countD, this.countR];
      this.chart.update();
    }
  }
}
