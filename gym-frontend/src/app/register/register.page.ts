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
  IonInput,
  IonSelect, 
  IonSelectOption
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service'; 


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
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
    IonInput,
    IonSelect, 
    IonSelectOption
  ]
})
export class RegisterPage implements OnInit {

  regData = {
    username: '',
    email: '',
    full_name: '',
    phone: '',
    password: '',
    role: 'utente',
    verificationCode: ''
  };

  passwordFieldType: string = 'password';
  passwordIcon: string = 'eye-off-outline';


  constructor(
    private authService: AuthService, 
    private router: Router, 
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }


  register() {
    if (!this.regData.username || !this.regData.password || !this.regData.email) {
      this.presentToast('Errore: Campi vuoti');
      return;
    }

    this.authService.register(this.regData).subscribe({
      next: () => {
        this.presentToast('Registrazione completata! Ora puoi fare il login.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        const errorMessage = err.error?.message || 'Errore durante la registrazione.';
        this.presentToast(`Errore: ${errorMessage}`);
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