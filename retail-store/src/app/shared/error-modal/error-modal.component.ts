import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html'
})
export class ErrorModalComponent {
  @Input() message: string;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
