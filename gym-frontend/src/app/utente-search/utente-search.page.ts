import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronUpOutline, chevronDownOutline, star } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonButtons, 
  IonBackButton, 
  IonListHeader, 
  IonIcon, 
  IonSpinner, 
  IonNote,
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonPopover
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-utente-search',
  standalone: true,
  templateUrl: './utente-search.page.html',
  styleUrls: ['./utente-search.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonButtons, 
    IonBackButton, 
    IonListHeader, 
    IonIcon, 
    IonSpinner, 
    IonNote,
    IonButton,
    IonCol,
    IonGrid,
    IonRow,
    IonPopover,
    RouterLink
  ],
})

export class UtenteSearchPage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;

  trainers: any[] = [];
  isLoading = true;
  currentlyOpenTrainerId: number | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ chevronUpOutline, chevronDownOutline, star });
  }

  ngOnInit() {

    this.apiService.getUsersByRole('PT').subscribe({
       next: (data) => {
        this.trainers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore nel caricare i PT:', err);
        this.isLoading = false;
      }
    });
  }

  toggleTrainerDetails(trainerId: number) {
    if (this.currentlyOpenTrainerId === trainerId) {
      this.currentlyOpenTrainerId = null;
      return;
    }
    this.currentlyOpenTrainerId = trainerId;
    const trainer = this.trainers.find(t => t.id === trainerId);

    if (trainer && !trainer.reviews) {
      this.apiService.getRatingsForTrainer(trainerId).subscribe({
        next: (reviews) => {
          trainer.reviews = reviews;
        },
        error: (err) => console.error('Errore nel caricare le recensioni:', err)
      });
    }
  }


  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }

  logout() {
    this.authService.logout();
  }

   openMenu(event: any) {
  this.popover.event = event; 
  this.popover.present();       
}

navigateTo(url: string) {
  this.popover.dismiss();
  this.router.navigateByUrl(url); 
}

}