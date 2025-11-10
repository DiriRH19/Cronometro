import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CronometroComponent } from './cronometro.component';
import { CronometroService } from '../../services/cronometro.service';

describe('CronometroComponent', () => {
  let component: CronometroComponent;
  let fixture: ComponentFixture<CronometroComponent>;
  let service: CronometroService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronometroComponent],
      providers: [CronometroService]
    }).compileComponents();

    fixture = TestBed.createComponent(CronometroComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CronometroService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display initial time', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tiempoElement = compiled.querySelector('.tiempo');
    expect(tiempoElement?.textContent).toContain('00:00:00.00');
  });

  it('should call iniciar on service when iniciar button is clicked', () => {
    spyOn(service, 'iniciar');
    const button = fixture.nativeElement.querySelector('.btn-iniciar');
    button.click();
    expect(service.iniciar).toHaveBeenCalled();
  });

  it('should call reiniciar on service when reiniciar button is clicked', () => {
    spyOn(service, 'reiniciar');
    const button = fixture.nativeElement.querySelector('.btn-reiniciar');
    button.click();
    expect(service.reiniciar).toHaveBeenCalled();
  });

  it('should disable iniciar button when cronometro is running', () => {
    service.iniciar();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.btn-iniciar') as HTMLButtonElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should call pausar on service when detener button is clicked', () => {
    spyOn(service, 'pausar');
    service.iniciar();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.btn-detener');
    button.click();
    expect(service.pausar).toHaveBeenCalled();
  });

  it('should enable detener button when cronometro is running', () => {
    service.iniciar();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.btn-detener') as HTMLButtonElement;
    expect(button.disabled).toBeFalsy();
  });

  it('should disable detener button when cronometro is stopped', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.btn-detener') as HTMLButtonElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should show Continuar text when stopped with elapsed time', (done) => {
    service.iniciar();
    fixture.detectChanges();
    
    // Esperar un poco para que el tiempo transcurra
    setTimeout(() => {
      service.pausar();
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.btn-iniciar');
      // Si hay tiempo transcurrido, debería mostrar "Continuar"
      const tiempoTranscurrido = service.tiempoActual();
      if (tiempoTranscurrido > 0) {
        expect(button?.textContent?.trim()).toBe('Continuar');
      }
      done();
    }, 50);
  }, 1000);

  it('should maintain time when detener is called and allow continuation', (done) => {
    service.iniciar();
    fixture.detectChanges();
    
    // Esperar un poco para que el tiempo transcurra
    setTimeout(() => {
      service.pausar();
      fixture.detectChanges();
      const tiempoDespuesDeDetener = service.tiempoActual();
      
      // Verificar que el tiempo se mantiene
      expect(tiempoDespuesDeDetener).toBeGreaterThan(0);
      
      // Continuar
      service.iniciar();
      fixture.detectChanges();
      
      setTimeout(() => {
        const tiempoDespuesDeContinuar = service.tiempoActual();
        // El tiempo debería seguir aumentando desde donde se detuvo
        expect(tiempoDespuesDeContinuar).toBeGreaterThanOrEqual(tiempoDespuesDeDetener);
        service.pausar();
        done();
      }, 100);
    }, 100);
  }, 3000);

  it('should inject CronometroService', () => {
    expect(component['cronometroService']).toBeDefined();
    expect(component['cronometroService']).toBeInstanceOf(CronometroService);
  });
});

