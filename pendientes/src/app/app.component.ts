import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { personCircle, personCircleSharp, archive, archiveSharp, trash, trashSharp } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Cuenta', url: '/myprofile', icon: 'person-Circle' },
    { title: 'Notas', url: '/notes', icon: 'archive' },
    { title: 'Papelera', url: '/delete', icon: 'trash' },
  ];
  constructor() {
    addIcons({
      personCircle, personCircleSharp, archive, archiveSharp, trash, trashSharp
    })
  }
}
