import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadNotesPageRoutingModule } from './upload-notes-routing.module';

import { UploadNotesPage } from './upload-notes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadNotesPageRoutingModule
  ],
  declarations: [UploadNotesPage]
})
export class UploadNotesPageModule {}
