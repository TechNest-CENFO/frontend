import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UploadService } from '../../services/upload.service'; // Adjust as needed

@Component({
  selector: 'app-collage',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './collage.component.html',
  styleUrls: ['./collage.component.scss'],
  providers: [UploadService]
})
export class CollageComponent {
  @Input() imageList: { url: string }[] = []; // List of available images to drag
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef; // Reference to canvas
  droppedImages: { url: string; x: number; y: number }[] = []; // Dropped images with positions

  constructor(private _uploadService: UploadService) {}

  // Handles the dragover event to allow dropping
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Handles the drop event to place the image in the collage
  onDrop(event: DragEvent): void {
    event.preventDefault();

    const imageData = event.dataTransfer?.getData('image');
    if (!imageData) {
      console.error('No image data found in event');
      return;
    }

    const image = JSON.parse(imageData);
    const boundingRect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;

    this.droppedImages.push({ ...image, x, y });

    // Redraw the images on the canvas after each drop
    this.drawCollage();
  }

  // Starts the drag and attaches the image data to the event
  onDragStart(event: DragEvent, image: { url: string }): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('image', JSON.stringify(image));
    }
  }

  // Draw images onto the canvas
  drawCollage() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas before drawing new images
    ctx.clearRect(0, 0, canvas.width, canvas.height);




    this.droppedImages.forEach(image => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Enable CORS for this image
      img.onload = () => {
        const ctx = this.canvasRef.nativeElement.getContext('2d');
        ctx?.drawImage(img, image.x, image.y, 150, 150); // Adjust size as needed
      };
      img.src = image.url;
    });
  }

  // Save the collage by uploading the canvas as an image
  saveCollage(): void {
    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL(); // Get the data URL of the canvas content
    this.uploadImage(dataUrl);  // Upload the image to Cloudinary or any other service
  }

  private uploadImage(dataUrl: string): void {
    const fileData = dataUrl; // In case you need to manipulate the data URL
    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('upload_preset', 'technest-preset');
    formData.append('cloud_name', 'dklipon9i');

    this._uploadService.uploadImage(formData).subscribe((response) => {
      console.log('Image uploaded successfully:', response);
    });
  }
}
