import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { 
  IonHeader, 
  ToastController,
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,          
  IonItem,         
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,          
    IonItem,         
    IonLabel,
    IonInput
  ]
})
export class LoginPage implements OnInit {

  loginData = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  login() {
    this.authService.login(this.loginData).subscribe({
      next: () => {
        const role = this.authService.getRoleFromToken();

        if (role === 'utente') {
          this.router.navigate(['/dashboard-utente']);
        } else if (role === 'PT') {
          this.router.navigate(['/dashboard-pt']);
        } else if (role === 'admin') {
          this.router.navigate(['/dashboard-admin']);
        } else {
          
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.presentToast('Credenziali non valide. Riprova.');
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}