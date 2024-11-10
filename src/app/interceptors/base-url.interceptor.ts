import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const base: string = environment.apiUrl;
  const isRelativeUrl = !req.url.startsWith('http');
  const url = isRelativeUrl ? `${base}/${req.url}` : req.url;

  const clonedRequest = req.clone({
    url,
    setHeaders: {
      Accept: 'application/json',
    },
  });

  return next(clonedRequest);
};