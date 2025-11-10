import { Injectable, signal, computed } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CronometroService {
  private readonly tiempoInicial = signal<number>(0);
  private readonly tiempoTranscurrido = signal<number>(0);
  private readonly estaCorriendo = signal<boolean>(false);
  
  private suscripcion?: Subscription;
  
  readonly tiempoActual = computed(() => this.tiempoTranscurrido());
  readonly enEjecucion = computed(() => this.estaCorriendo());
  
  private crearObservadorTiempo(): Observable<number> {
    return interval(10);
  }
  
  iniciar(): void {
    if (!this.estaCorriendo()) {
      this.estaCorriendo.set(true);
      const tiempoPausado = this.tiempoTranscurrido();
      this.tiempoInicial.set(Date.now() - tiempoPausado);
      
      this.suscripcion = this.crearObservadorTiempo().subscribe(() => {
        if (this.estaCorriendo()) {
          const ahora = Date.now();
          const tiempoPasado = ahora - this.tiempoInicial();
          this.tiempoTranscurrido.set(tiempoPasado);
        }
      });
    }
  }
  
  pausar(): void {
    this.estaCorriendo.set(false);
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
      this.suscripcion = undefined;
    }
  }
  
  reiniciar(): void {
    this.pausar();
    this.tiempoTranscurrido.set(0);
    this.tiempoInicial.set(0);
  }
  
  obtenerTiempoFormateado(): string {
    const tiempo = this.tiempoTranscurrido();
    const horas = Math.floor(tiempo / 3600000);
    const minutos = Math.floor((tiempo % 3600000) / 60000);
    const segundos = Math.floor((tiempo % 60000) / 1000);
    const centesimas = Math.floor((tiempo % 1000) / 10);
    
    return `${this.formatearNumero(horas)}:${this.formatearNumero(minutos)}:${this.formatearNumero(segundos)}.${this.formatearNumero(centesimas)}`;
  }
  
  private formatearNumero(numero: number): string {
    return numero.toString().padStart(2, '0');
  }
}

