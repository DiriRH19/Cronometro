import { Injectable, signal, computed } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CronometroService {
  // Signals para el estado del cronómetro
  private readonly tiempoInicial = signal<number>(0); // tiempo en milisegundos cuando se inició
  private readonly tiempoTranscurrido = signal<number>(0);
  private readonly estaCorriendo = signal<boolean>(false);
  
  // Suscripción al observador frío
  private suscripcion?: Subscription;
  
  // Signals públicos (readonly)
  readonly tiempoActual = computed(() => this.tiempoTranscurrido());
  readonly enEjecucion = computed(() => this.estaCorriendo());
  
  // Observador frío: interval crea un nuevo observable para cada suscripción
  // Cada suscripción recibe su propia secuencia de valores
  private crearObservadorTiempo(): Observable<number> {
    return interval(10); // Emite cada 10ms (observador frío)
  }
  
  // Método para iniciar el cronómetro
  iniciar(): void {
    if (!this.estaCorriendo()) {
      this.estaCorriendo.set(true);
      const tiempoPausado = this.tiempoTranscurrido();
      this.tiempoInicial.set(Date.now() - tiempoPausado);
      
      // Crear y suscribirse al observador frío
      // Cada vez que se llama a iniciar(), se crea una nueva suscripción
      this.suscripcion = this.crearObservadorTiempo().subscribe(() => {
        if (this.estaCorriendo()) {
          const ahora = Date.now();
          const tiempoPasado = ahora - this.tiempoInicial();
          this.tiempoTranscurrido.set(tiempoPasado);
        }
      });
    }
  }
  
  // Método para pausar el cronómetro
  pausar(): void {
    this.estaCorriendo.set(false);
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
      this.suscripcion = undefined;
    }
  }
  
  // Método para reiniciar el cronómetro
  reiniciar(): void {
    this.pausar();
    this.tiempoTranscurrido.set(0);
    this.tiempoInicial.set(0);
  }
  
  // Método para obtener el tiempo formateado
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

