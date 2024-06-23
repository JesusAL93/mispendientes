import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { personCircle, personCircleSharp, archive, archiveSharp, trash, trashSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Cuenta', url: '/myprofile', icon: 'person-circle' },
    { title: 'Notas', url: '/notes', icon: 'archive' },
    { title: 'Papelera', url: '/delete', icon: 'trash' },
  ];
  public userName: string = '';

  constructor() {
    addIcons({
      personCircle, personCircleSharp, archive, archiveSharp, trash, trashSharp
    });
  }

  ngOnInit() {
    this.getUserName();
  }

  getUserName() {
    const user = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      this.userName = userObj.username || 'Usuario desconocido';
    } else {
      this.userName = 'Usuario desconocido';
    }
  }
}
