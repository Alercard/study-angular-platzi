import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { AdminGuard } from './guards/admin.guard';

import { NotFoundComponent } from './not-found/not-found.component';
import { CustomPreloadService } from './services/custom-preload.service';

const routes: Routes = [
  {
    path: '',
    // permite el lazy loading y code splitting
    loadChildren: () => import('./website/website.module').then(m => m.WebsiteModule),
    data: { preload: true }
  },
  {
    path: 'cms',
    canActivate: [AdminGuard],
    // permite el lazy loading  y code splitting
    loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // PreloadAllModules: precargar los archivos despues de la carga inicial
    // es mejor usarla cuando no hay tantos modulos
    //preloadingStrategy: PreloadAllModules

    // CustomPreloadService: es el sevicio programado para que discierna que script de los modulos precargar
    // preloadingStrategy: CustomPreloadService

    // 3ra estrategia de precarga
    preloadingStrategy: QuicklinkStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
