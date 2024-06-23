import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router para la navegación

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  notes: { title: string, description: string, color: string, imageUrl?: string }[] = [];
  trash: { title: string, description: string, color: string, imageUrl?: string }[] = [];
  newNote: { title: string, description: string, color: string, imageUrl?: string } = { title: '', description: '', color: 'primary' };
  selectedNote: { title: string, description: string, color: string, imageUrl?: string } | null = null;
  isEditing: boolean = false;
  editIndex: number | null = null;
  searchTerm: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  selectedFile: File | null = null;
  selectedFileUrl: string | ArrayBuffer | null = null;

  constructor(private modalController: ModalController, private router: Router) {
    
  }

  ngOnInit() {
    this.loadNotes();
  }

  goToReportPage() {
    this.router.navigate(['/report']); // Navega a la página 'report'
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
        if (this.selectedFileUrl) {
          this.newNote.imageUrl = this.selectedFileUrl.toString();
        }
        this.notes[this.editIndex] = { ...this.newNote };
        this.isEditing = false;
        this.editIndex = null;
      } else {
        if (this.selectedFileUrl) {
          this.newNote.imageUrl = this.selectedFileUrl.toString();
        }
        this.notes.push({ ...this.newNote });
      }
      this.newNote = { title: '', description: '', color: 'primary' };
      this.selectedFile = null;
      this.selectedFileUrl = null;
      this.saveNotes();
      this.closeModal();
    } else {
      console.log('El título o la descripción están vacíos');
    }
  }

  deleteNoteWithEvent(index: number, event: Event) {
    event.stopPropagation();
    this.deleteNote(index);
  }

  editNoteWithEvent(index: number, event: Event) {
    event.stopPropagation();
    this.editNote(index);
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
    this.selectedFileUrl = this.newNote.imageUrl || null;
    this.openAddNoteModal();
  }

  cancelEdit() {
    this.newNote = { title: '', description: '', color: 'primary' };
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.isEditing = false;
    this.editIndex = null;
    this.closeModal();
  }

  filterNotes() {
    return this.notes.filter(note =>
      note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddNoteModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    if (!this.isEditing) {
      this.newNote = { title: '', description: '', color: 'primary' };
      this.selectedFile = null;
      this.selectedFileUrl = null;
    }
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedNote = null;
  }

  openViewNoteModal(note: { title: string, description: string, color: string, imageUrl?: string }) {
    this.selectedNote = note;
    this.isViewModalOpen = true;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.newNote.imageUrl = '';
  }
}
