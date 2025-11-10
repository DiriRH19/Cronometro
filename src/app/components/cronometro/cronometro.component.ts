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
  // Inyección de dependencias del servicio
  private readonly cronometroService = inject(CronometroService);
  
  // Signals del servicio (readonly)
  readonly tiempoActual = this.cronometroService.tiempoActual;
  readonly enEjecucion = this.cronometroService.enEjecucion;
  
  // Signal computado para el tiempo formateado
  // Se actualiza automáticamente cuando tiempoActual cambia
  readonly tiempoFormateado = computed(() => {
    const tiempo = this.tiempoActual();
    return this.formatearTiempo(tiempo);
  });
  
  // Método privado para formatear el tiempo
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
  
  // Métodos para controlar el cronómetro
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

