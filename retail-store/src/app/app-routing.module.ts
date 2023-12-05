import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", redirectTo: "/products", pathMatch: "full" },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then(module => module.AuthModule)
  },
  {
    path: "products",
    loadChildren: () => import("./products/products.module").then(module => module.ProductsModule)
  },
  {
    path: "bills",
    loadChildren: () => import("./bills/bills.module").then(module => module.BillsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
