import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  notes: { title: string, description: string, color: string }[] = [];
  trash: { title: string, description: string, color: string }[] = [];
  newNote: { title: string, description: string, color: string } = { title: '', description: '', color: 'primary' };
  isEditing: boolean = false;
  editIndex: number | null = null;
  searchTerm: string = '';

  constructor() {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
    const savedTrash = localStorage.getItem('trash');
    if (savedTrash) {
      this.trash = JSON.parse(savedTrash);
    }
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
    localStorage.setItem('trash', JSON.stringify(this.trash));
  }

  addNote() {
    if (this.newNote.title.trim() && this.newNote.description.trim()) {
      if (this.isEditing && this.editIndex !== null) {
        this.notes[this.editIndex] = { ...this.newNote };
        this.isEditing = false;
        this.editIndex = null;
      } else {
        this.notes.push({ ...this.newNote });
      }
      this.newNote = { title: '', description: '', color: 'primary' };
      this.saveNotes();
    } else {
      console.log('El título o la descripción están vacíos');
    }
  }

  deleteNote(index: number) {
    const deletedNote = this.notes.splice(index, 1)[0];
    this.trash.push(deletedNote);
    this.saveNotes();
  }

  restoreNoteFromTrash(index: number) {
    const restoredNote = this.trash.splice(index, 1)[0];
    this.notes.push(restoredNote);
    this.saveNotes();
  }

  deleteNotePermanently(index: number) {
    this.trash.splice(index, 1);
    this.saveNotes();
  }

  editNote(index: number) {
    this.newNote = { ...this.notes[index] };
    this.isEditing = true;
    this.editIndex = index;
  }

  cancelEdit() {
    this.newNote = { title: '', description: '', color: 'primary' };
    this.isEditing = false;
    this.editIndex = null;
  }

  filterNotes() {
    return this.notes.filter(note =>
      note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleRestoreNoteFromTrash(index: number) {
    this.restoreNoteFromTrash(index);
  }
}
