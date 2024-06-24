import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Note } from '../interface/nota.interface'; // Ajusta la ruta según tu estructura
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  notes: Note[] = [];
  trash: Note[] = [];
  newNote: Note = { id: '', title: '', description: '', color: 'primary' };
  selectedNote: Note | null = null;
  isEditing: boolean = false;
  editIndex: number | null = null;
  searchTerm: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  isShareModalOpen: boolean = false;
  selectedFile: File | null = null;
  selectedFileUrl: string | ArrayBuffer | null = null;
  isGridView: boolean = false; // Variable para manejar la vista

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {
    this.loadNotes();
    this.loadViewPreference();
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
        this.newNote.id = this.generateUniqueId('n'); // Generar identificador único para notas nuevas
        this.notes.push({ ...this.newNote });
      }
      this.newNote = { id: '', title: '', description: '', color: 'primary' };
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
    deletedNote.id = this.generateUniqueId('d'); // Generar identificador único para notas eliminadas
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
    this.newNote = { id: '', title: '', description: '', color: 'primary' };
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
      this.newNote = { id: '', title: '', description: '', color: 'primary' };
      this.selectedFile = null;
      this.selectedFileUrl = null;
    }
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedNote = null;
  }

  openViewNoteModal(note: Note) {
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

  toggleView() {
    this.isGridView = !this.isGridView;
    localStorage.setItem('isGridView', JSON.stringify(this.isGridView)); // Guardar el estado en el almacenamiento local
  }
  

  loadViewPreference() {
    const savedViewPreference = localStorage.getItem('isGridView');
    if (savedViewPreference !== null) {
      this.isGridView = JSON.parse(savedViewPreference);
    }
  }

  private generateUniqueId(prefix: string): string {
    return `${prefix}`;
  }

  openShareModal() {
    this.isShareModalOpen = true;
  }

  closeShareModal() {
    this.isShareModalOpen = false;
  }

  // Compartir texto
  async shareAsText() {
    if (this.selectedNote) {
      let textToShare = `Título: ${this.selectedNote.title}\nDescripción: ${this.selectedNote.description}`;
  
      // Incluir imagen si existe
      if (this.selectedNote.imageUrl) {
        textToShare += `\nImagen: ${this.selectedNote.imageUrl}`;
      }
  
      if (navigator.share) {
        try {
          await navigator.share({
            title: this.selectedNote.title,
            text: textToShare,
          });
        } catch (error) {
          console.error('Error sharing', error);
        }
      } else {
        console.log('Web Share API is not supported in your browser.');
      }
      this.closeShareModal();
    }
  }

  // Compartir como .PDF

  async shareAsPdf() {
    if (this.selectedNote) {
      const doc = new jsPDF();
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;  // Ancho máximo del texto
  
      // Añadir el título
      doc.text(this.selectedNote.title || '', margin, 10);
  
      // Dividir la descripción en líneas
      const descriptionLines = doc.splitTextToSize(this.selectedNote.description || '', maxWidth);
      doc.text(descriptionLines, margin, 20);
  
      if (this.selectedNote.imageUrl) {
        const img = new Image();
        img.src = this.selectedNote.imageUrl;
        img.onload = () => {
          const imgWidth = 180;
          const imgHeight = img.height * imgWidth / img.width;
          // Calcular la posición de la imagen en función del tamaño de la descripción
          const imgY = 20 + descriptionLines.length * 10; // Ajuste de la posición vertical de la imagen
          doc.addImage(img, 'PNG', margin, imgY, imgWidth, imgHeight);
          doc.save(`${this.selectedNote?.title || 'nota'}.pdf`);
        };
      } else {
        doc.save(`${this.selectedNote?.title || 'nota'}.pdf`);
      }
  
      this.closeShareModal();
    }
  }
  

  // Compartir imagen de la nota
  async shareAsImage() {
    if (this.selectedNote) {
      const selectedNote = this.selectedNote;
  
      // Crear un contenedor temporal
      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.backgroundColor = selectedNote.color;
      element.style.padding = '10px';
      element.innerHTML = `
        <h1>${selectedNote.title}</h1>
        <p>${selectedNote.description}</p>
        ${selectedNote.imageUrl ? `<img src="${selectedNote.imageUrl}" style="max-width: 100%;">` : ''}
      `;
      document.body.appendChild(element);
  
      // Esperar a que todas las imágenes se carguen
      const images = element.querySelectorAll('img');
      const promises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      });
  
      try {
        await Promise.all(promises);
        const canvas = await html2canvas(element);
  
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
  
            // Nombre del archivo para descargar
            const fileName = `${selectedNote.title}.png`;
            a.download = fileName;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        document.body.removeChild(element);
      }
  
      this.closeShareModal(); // Cierra el modal de compartir
    }
  }

  // Compartir como .txt
  async shareAstexto() {
    if (this.selectedNote) {
      const selectedNote = this.selectedNote;
  
      // Crear el contenido de la nota como texto plano
      const noteContent = `Title: ${selectedNote.title}\n\nDescription: ${selectedNote.description}\n`;
  
      // Crear un blob con el contenido de la nota en formato de texto
      const blob = new Blob([noteContent], { type: 'text/plain' });
  
      // Crear una URL para el blob
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
  
      // Nombre del archivo para descargar
      const fileName = `${selectedNote.title}.txt`;
      a.download = fileName;
      a.href = url;
  
      // Añadir el enlace al documento, hacer clic y luego removerlo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      // Liberar la URL creada
      URL.revokeObjectURL(url);
  
      this.closeShareModal(); // Cierra el modal de compartir
    }
  }
}