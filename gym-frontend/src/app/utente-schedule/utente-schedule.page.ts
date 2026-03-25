import { Component, OnInit , ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
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
  IonTextarea, 
  IonInput, 
  IonCheckbox,
  IonSelect, 
  IonSelectOption,
  IonBackButton
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { trashOutline, logOutOutline, chevronUpOutline, chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-utente-schedule',
  templateUrl: './utente-schedule.page.html',
  styleUrls: ['./utente-schedule.page.scss'],
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
    IonTextarea, 
    IonInput, 
    IonCheckbox,
    IonSelect, 
    IonSelectOption,
    IonBackButton
  ]
})
export class UtenteSchedulePage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;

  user: any = null;
  myAssignedPlans: any[] = []; 
  

  currentlyOpenPlanId: number | null = null;

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ trashOutline, logOutOutline, chevronUpOutline, chevronDownOutline });
  }

  ngOnInit() {
    this.apiService.getCurrentUser().subscribe({
      next: (data: any) => this.user = data,
      error: (err: any) => console.error('Errore nel caricare i dati utente:', err)
    });
    

    this.loadMyAssignedPlans();
  }

  loadMyAssignedPlans() {
    this.apiService.getAssignedPlans().subscribe({
      next: (data) => {
        this.myAssignedPlans = data;
        console.log('Schede assegnate caricate:', this.myAssignedPlans);
      },
      error: (err) => console.error('Errore nel caricare le schede assegnate:', err)
    });
  }
  

  togglePlanDetails(planId: number) {
    if (this.currentlyOpenPlanId === planId) {
      this.currentlyOpenPlanId = null; 
      return;
    }
    this.currentlyOpenPlanId = planId; 
    const plan = this.myAssignedPlans.find(p => p.id === planId);


    if (plan && !plan.exercises) {
      this.apiService.getPlanDetails(planId).subscribe({
        next: (details) => {
          plan.exercises = details.exercises;
        },
        error: (err) => console.error('Errore nel caricare i dettagli della scheda:', err)
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