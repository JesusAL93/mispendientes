import { Component, OnInit } from '@angular/core';
import { Note } from '../interface/nota.interface';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.page.html',
  styleUrls: ['./delete.page.scss'],
})
export class DeletePage implements OnInit {
  trash: Note[] = [];
  notes: Note[] = [];

  constructor() {}

  ngOnInit() {
    this.loadTrash();
    this.loadNotes();
  }

  loadTrash() {
    const savedTrash = localStorage.getItem('trash');
    if (savedTrash) {
      this.trash = JSON.parse(savedTrash);
    }
  }

  loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  saveTrash() {
    localStorage.setItem('trash', JSON.stringify(this.trash));
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  restoreNoteFromTrash(index: number) {
    const restoredNote = this.trash.splice(index, 1)[0];
    restoredNote.id = this.generateUniqueId('r'); // Generar identificador único para notas restauradas
    this.notes.push(restoredNote);
    this.saveTrash();
    this.saveNotes();
  }

  deletePermanently(index: number) {
    this.trash.splice(index, 1);
    this.saveTrash();
  }

  private generateUniqueId(prefix: string): string {
    return `${prefix}`;
  }
}
