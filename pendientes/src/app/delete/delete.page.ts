import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.page.html',
  styleUrls: ['./delete.page.scss'],
})
export class DeletePage implements OnInit {
  @Output() restoreNoteEvent = new EventEmitter<number>();
  @Output() deletePermanentlyEvent = new EventEmitter<number>();
  
  trash: { title: string, description: string, color: string }[] = []; // Cambiar la estructura del objeto trash

  constructor() {}

  ngOnInit() {
    this.loadTrash();
  }

  loadTrash() {
    const savedTrash = localStorage.getItem('trash');
    if (savedTrash) {
      this.trash = JSON.parse(savedTrash);
    }
  }

  restoreNote(index: number) {
    this.restoreNoteEvent.emit(index);
    this.trash.splice(index, 1); // Eliminar la nota de la papelera
    this.saveTrash();
  }

  deletePermanently(index: number) {
    this.deletePermanentlyEvent.emit(index);
    this.trash.splice(index, 1); // Eliminar definitivamente la nota de la papelera
    this.saveTrash();
  }

  saveTrash() {
    localStorage.setItem('trash', JSON.stringify(this.trash));
  }
}
