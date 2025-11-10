import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronometroService } from '../../services/cronometro.service';

@Component({
  selector: 'app-cronometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cronometro.component.html',
  styleUrl: './cronometro.component.css'
})
export class CronometroComponent {
  private readonly cronometroService = inject(CronometroService);
  
  readonly tiempoActual = this.cronometroService.tiempoActual;
  readonly enEjecucion = this.cronometroService.enEjecucion;
  
  readonly tiempoFormateado = computed(() => {
    const tiempo = this.tiempoActual();
    return this.formatearTiempo(tiempo);
  });
  
  private formatearTiempo(tiempo: number): string {
    const horas = Math.floor(tiempo / 3600000);
    const minutos = Math.floor((tiempo % 3600000) / 60000);
    const segundos = Math.floor((tiempo % 60000) / 1000);
    const centesimas = Math.floor((tiempo % 1000) / 10);
    
    return `${this.formatearNumero(horas)}:${this.formatearNumero(minutos)}:${this.formatearNumero(segundos)}.${this.formatearNumero(centesimas)}`;
  }
  
  private formatearNumero(numero: number): string {
    return numero.toString().padStart(2, '0');
  }
  
  iniciar(): void {
    this.cronometroService.iniciar();
  }
  
  detener(): void {
    this.cronometroService.pausar();
  }
  
  reiniciar(): void {
    this.cronometroService.reiniciar();
  }
}

