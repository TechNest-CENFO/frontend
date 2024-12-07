import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {baseUrlInterceptor} from './interceptors/base-url.interceptor';
import {accessTokenInterceptor} from './interceptors/access-token.interceptor';
import {handleErrorsInterceptor} from './interceptors/handle-errors.interceptor';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideLottieOptions} from 'ngx-lottie';
import player from 'lottie-web';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                baseUrlInterceptor,
                accessTokenInterceptor,
                //handleErrorsInterceptor
            ])
        ), provideAnimationsAsync(),
        provideLottieOptions({
            player: () => player,
        })
    ]
};
