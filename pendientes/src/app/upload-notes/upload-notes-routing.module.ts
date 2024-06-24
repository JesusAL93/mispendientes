import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadNotesPage } from './upload-notes.page';

const routes: Routes = [
  {
    path: '',
    component: UploadNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadNotesPageRoutingModule {}
