import {Component, inject} from '@angular/core';
import {LottieComponentComponent} from "../../pages/lottie-component/lottie-component.component";
import {NotyfService} from "../../services/notyf.service";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    LottieComponentComponent
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private notyfService: NotyfService = inject(NotyfService);
  lottie = {
    path: '../assets/lottie/404.json',
    loop: true,
    autoplay: true
  };
  ngOnInit(): void {
    this.notyfService.error('Ruta no encontrada')
  }
}
