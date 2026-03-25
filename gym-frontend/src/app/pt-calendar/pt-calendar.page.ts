import { Component, OnInit ,ViewChild} from '@angular/core';
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
  IonInput,  
  IonBackButton,
  IonDatetimeButton,
  IonModal,
  IonDatetime
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { calendarClearOutline, timeOutline, logOutOutline, trashOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-pt-calendar',
  templateUrl: './pt-calendar.page.html',
  styleUrls: ['./pt-calendar.page.scss'],
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
    IonDatetime, 
    IonDatetimeButton, 
    IonInput, 
    IonModal, 
    IonBackButton
  ]
})
export class PtCalendarPage implements OnInit {

    @ViewChild('popover') popover!: IonPopover;

  user: any = null;

  minDate: string = new Date().toISOString();
  
  newSlot = {
    start_time: new Date().toISOString(),
    end_time: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    max_clients: 1
  };
 
  mySlots: any[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ calendarClearOutline, timeOutline, logOutOutline, trashOutline }); 
  }

  ngOnInit() {
    this.apiService.getCurrentUser().subscribe({
      next: (data: any) => {
        this.user = data;
        console.log('Dati utente caricati:', this.user);
      },
      error: (err: any) => {
        console.error('Errore nel caricare i dati utente:', err);
      }
    });
    
    this.loadMySlots();
  }

  loadMySlots() {
    this.apiService.getMySlots().subscribe({
      next: (data) => {
        this.mySlots = data;
      },
      error: (err) => {
        console.error('Errore nel caricare gli slot:', err);
        this.presentToast('Errore nel caricare le disponibilità.', 'danger');
      }
    });
  }

  createSlot() {
    if (!this.newSlot.start_time || !this.newSlot.end_time) {
      this.presentToast('Devi inserire sia una data di inizio che una di fine.', 'danger');
      return;
    }
    this.apiService.createSlot(this.newSlot).subscribe({
      next: () => {
        this.presentToast('Slot creato con successo!', 'success');
        this.newSlot = {
          start_time: new Date().toISOString(),
          end_time: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
          max_clients: 1
        };
        this.loadMySlots();
      },
      error: (err) => this.presentToast('Errore durante la creazione dello slot.', 'danger')
    });
  }



  async deleteSlot(slotId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma',
      message: 'Sei sicuro di voler eliminare questa disponibilità? Verranno cancellate anche tutte le prenotazioni associate.',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          handler: () => {
            this.apiService.deleteSlot(slotId).subscribe({
              next: () => {
                this.presentToast('Slot eliminato con successo!', 'success');
                this.loadMySlots(); 
              },
              error: (err) => this.presentToast('Errore durante l\'eliminazione.', 'danger')
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