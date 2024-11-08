import {Component, Input} from '@angular/core';
import {AnimationOptions, LottieComponent} from "ngx-lottie";

@Component({
  selector: 'app-lottie-component',
  template: `
    <ng-lottie [options]="options" style="width: 300px; height: 300px;"></ng-lottie>
  `,
  imports: [
    LottieComponent
  ],
  standalone: true
})
export class LottieComponentComponent {
  @Input() options: AnimationOptions = {
    path: '',        // Dejar la ruta vacía por defecto
    loop: false,
    autoplay: true,
  };
}
