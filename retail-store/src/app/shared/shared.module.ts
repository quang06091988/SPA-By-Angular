import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ErrorModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSpinnerComponent,
    ErrorModalComponent,
  ]
})
export class SharedModule { }
