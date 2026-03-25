import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';
import {
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
  IonList, 
  IonItem, 
  IonLabel, 
  IonPopover, 
  IonListHeader,
  IonFab, 
  IonFabButton, 
  IonFooter
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { linkOutline, closeCircleOutline, checkmarkDoneOutline } from 'ionicons/icons';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.page.html',
  styleUrls: ['./admin-list.page.scss'],
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
    IonList, 
    IonItem, 
    IonLabel, 
    IonPopover, 
    IonListHeader,
    IonFab, 
    IonFabButton, 
    IonFooter
  ]
})
export class AdminListPage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;
  
  users: any[] = [];
  trainers: any[] = [];

  trainerMap: { [id: number]: string } = {};

  selectedUserId: number | null = null;
  selectedTrainerId: number | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ linkOutline, closeCircleOutline, checkmarkDoneOutline });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadTrainers();
  }

  loadUsers() {
    this.apiService.getUsersByRole('utente').subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Errore caricamento utenti:', err)
    });
  }

  loadTrainers() {
    this.apiService.getUsersByRole('PT').subscribe({
      next: (data) => {
        this.trainers = data;
        
       
        this.trainerMap = {}; 
        for (const trainer of this.trainers) {
          
          this.trainerMap[trainer.id] = trainer.full_name;
        }
      },
      error: (err) => console.error('Errore caricamento PT:', err)
    });
  }

  selectUser(userId: number) {
    this.selectedUserId = userId;
  }

  selectTrainer(trainerId: number) {
    this.selectedTrainerId = trainerId;
  }

  assignSelectedTrainer() {
    if (!this.selectedUserId || !this.selectedTrainerId) {
      this.presentToast('Per favore, seleziona sia un utente che un trainer.', 'warning');
      return;
    }

    this.apiService.assignTrainer(this.selectedUserId, this.selectedTrainerId).subscribe({
      next: (response) => {
        this.presentToast('Trainer assegnato con successo!', 'success');
        this.selectedUserId = null;
        this.selectedTrainerId = null;
        this.loadUsers(); 
      },
      error: (err) => {
        this.presentToast('Errore durante l\'assegnazione.', 'danger');
        console.error('Errore di assegnazione:', err);
      }
    });
  }

  async unassign(customerId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma Rimozione',
      message: 'Sei sicuro di voler rimuovere l\'assegnazione per questo utente?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Rimuovi',
          handler: () => {
            this.apiService.unassignTrainer(customerId).subscribe({
              next: () => {
                this.presentToast('Assegnazione rimossa con successo!', 'success');
                this.loadUsers();
              },
              error: (err) => this.presentToast('Errore durante la rimozione.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: color,
      position: 'top'
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