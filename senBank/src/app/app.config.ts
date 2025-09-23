import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
<<<<<<< HEAD
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
=======
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
>>>>>>> 0f8c984454fd254c5957e697a47ac81247dfaead

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
<<<<<<< HEAD
    provideHttpClient(withInterceptorsFromDi()),
  ],
=======
    provideHttpClient(
      withInterceptors([authInterceptor]) // ✅ Ajout de l'interceptor
    )
  ]
>>>>>>> 0f8c984454fd254c5957e697a47ac81247dfaead
};
