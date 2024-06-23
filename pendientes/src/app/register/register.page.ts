import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private menu: MenuController, 
    private navCtrl: NavController, 
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.menu.enable(false); // Deshabilita el menú al inicializar el componente
  }

  ionViewWillLeave() {
    this.menu.enable(true); // Vuelve a habilitar el menú al salir del componente
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async onRegister() {
    if (!this.username || !this.email || !this.password) {
      await this.presentAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // Guardar los datos del usuario en localStorage
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };
    localStorage.setItem('user', JSON.stringify(userData));

    console.log('Usuario registrado:', this.username, this.email, this.password);

    // Mostrar la alerta de registro exitoso
    await this.presentAlert('Registro Exitoso', 'Te has registrado correctamente.');

    // Redirigir a la página de inicio de sesión
    this.navCtrl.navigateForward('/folder'); // Asegúrate de que la ruta sea correcta
  }
}
