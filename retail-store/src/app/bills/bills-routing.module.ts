import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../auth/auth.guard';
import { BillsComponent } from './bills.component';

const routes: Routes = [
  { 
    path: '',
    canActivate: [authGuard],
    component: BillsComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule { }
