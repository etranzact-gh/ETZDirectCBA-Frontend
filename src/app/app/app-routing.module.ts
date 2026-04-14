import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'bank-config', pathMatch: 'full'},
  {path: 'bank-config', loadComponent: () => import('./bank-config/bank-config.component').then(m => m.BankConfigComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
