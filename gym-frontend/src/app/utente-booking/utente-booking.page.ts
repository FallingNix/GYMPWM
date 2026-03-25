import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

import {
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonButtons, 
  IonIcon, 
  IonList, 
  IonItem, 
  IonLabel,
  IonListHeader, 
  IonBackButton, 
  IonCard, 
  IonCardContent, 
  IonSpinner, 
  IonNote, 
  IonRow,
  IonCol,
  IonGrid,
  IonPopover
} from '@ionic/angular/standalone';

import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline, logOutOutline } from 'ionicons/icons';


export interface User {
  id: number;
  full_name: string;
  email: string;
  trainer_id: number | null;
  assignedTrainerName: string | null;
}

@Component({
  selector: 'app-utente-booking',
  templateUrl: './utente-booking.page.html',
  styleUrls: ['./utente-booking.page.scss'],
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
    IonIcon, 
    IonList, 
    IonItem,
    IonLabel, 
    IonListHeader, 
    IonBackButton, 
    IonCard,
    IonCardContent, 
    IonSpinner, 
    IonNote ,
    IonRow,
    IonCol,
    IonGrid,
    IonPopover
  ]
})
export class UtenteBookingPage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;

  currentUser: any = null;
  assignedTrainerSlots: any[] = [];
  isLoading = true;
  myBookings: any[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ calendarOutline, checkmarkCircleOutline, logOutOutline });
  }

  ngOnInit() {
    this.loadAssignedTrainerInfo();
    this.loadMyBookings();
  }
 
  loadAssignedTrainerInfo() {
  this.isLoading = true;
  this.apiService.getCurrentUser().subscribe({
    next: (user) => {
      console.log('Dati ricevuti da getCurrentUser:', user);
      this.currentUser = user;
      
      if (user && (user as any).trainer_id) {
        console.log('Trovato trainer_id:', this.currentUser.trainer_id, '-> Procedo a caricare gli slot.');
        this.apiService.getSlotsByTrainer((user as any).trainer_id).subscribe({
          next: (slots) => {
            this.assignedTrainerSlots = slots;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Errore nel caricare gli slot del PT:', err);
            this.isLoading = false;
          }
        });
      } else {
        console.log('ATTENZIONE: La proprietà "trainer_id" non è stata trovata nei dati dell utente. Non posso caricare gli slot.');
        this.isLoading = false;
      }
    },
    error: (err) => {
      console.error('Errore nel caricare i dati utente:', err);
      this.isLoading = false;
    }
  });
}

  async bookSlot(slot: any) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma Prenotazione',
      message: `Vuoi prenotare la lezione con ${this.currentUser.assignedTrainerName} per il giorno ${new Date(slot.start_time).toLocaleDateString('it-IT')}?`,
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Conferma',
          handler: () => {
            this.apiService.createBooking(slot.id).subscribe({
              next: () => {
                this.presentToast('Prenotazione effettuata con successo!', 'success');
                this.loadAssignedTrainerInfo();
                this.loadMyBookings();
              },
              error: (err) => this.presentToast('Errore durante la prenotazione. Lo slot potrebbe essere pieno.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  loadMyBookings() {
    this.apiService.getMyBookings().subscribe(data => {
      this.myBookings = data;
    });
  }

  async cancelBooking(bookingId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma Cancellazione',
      message: 'Sei sicuro di voler cancellare questa prenotazione?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Cancella',
          handler: () => {
            this.apiService.deleteBooking(bookingId).subscribe({
              next: () => {
                this.presentToast('Prenotazione cancellata.', 'success');
                this.loadMyBookings(); 
              },
              error: () => this.presentToast('Errore durante la cancellazione.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

async openRatingPrompt(booking: any) {
    const alert = await this.alertCtrl.create({
      header: `Valuta la tua lezione con ${booking.trainer_name}`,
      inputs: [
        {
          name: 'rating',
          type: 'number',
          placeholder: 'Voto da 1 a 5',
          min: 1,
          max: 5
        },
        {
          name: 'review',
          type: 'textarea',
          placeholder: 'Lascia una recensione (opzionale)'
        }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Invia',
          handler: (data) => {
            if (!data.rating || data.rating < 1 || data.rating > 5) {
              this.presentToast('Per favore, inserisci un voto valido da 1 a 5.', 'warning');
              return false; 
            }
            
            const ratingData = {
              trainer_id: booking.trainer_id, 
              rating: parseFloat(data.rating),
              review: data.review
            };

            this.apiService.createRating(ratingData).subscribe({
              next: () => this.presentToast('Grazie per la tua valutazione!', 'success'),
              error: () => this.presentToast('Errore nell\'invio della valutazione.', 'danger')
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
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