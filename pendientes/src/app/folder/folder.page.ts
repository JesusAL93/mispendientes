import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  public username: string = '';
  public password: string = '';
  private activatedRoute = inject(ActivatedRoute);
  private menu = inject(MenuController);
  private router = inject(Router);
  private alertController = inject(AlertController);

  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.menu.enable(false); // Deshabilita el menú al inicializar el componente
  }

  ionViewWillLeave() {
    this.menu.enable(true); // Vuelve a habilitar el menú al salir del componente
  }

  async login() {
    if (!this.username || !this.password) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const storedUsername = user.username;
    const storedPassword = user.password;

    if (this.username === storedUsername && this.password === storedPassword) {
      this.router.navigate(['/notes']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Nombre de usuario o contraseña incorrectos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
