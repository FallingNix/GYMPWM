import { Component, OnInit,ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  IonTextarea, 
  IonInput, 
  IonCheckbox,
  IonSelect, 
  IonSelectOption,
} from '@ionic/angular/standalone';

import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { trashOutline, logOutOutline, chevronUpOutline, chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pt-schedule',
  templateUrl: './pt-schedule.page.html',
  styleUrls: ['./pt-schedule.page.scss'],
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
  ]
})
export class PtSchedulePage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;

  
  user: any = null;
  exercises: any[] = [];
  myPlans: any[] = [];
  assignedClients: any[] = [];
  
 
  exerciseData = { name: '', description: '', muscle_group: '' };
  planData = { name: '', description: '', customer_id: null };
  selectedExercises = new Set<number>();
  

  currentlyOpenPlanId: number | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ trashOutline, logOutOutline, chevronUpOutline, chevronDownOutline });
  }

  ngOnInit() {
    this.apiService.getCurrentUser().subscribe({
      next: (data: any) => this.user = data,
      error: (err: any) => console.error('Errore nel caricare i dati utente:', err)
    });
    this.loadExercises();
    this.loadMyPlans();
    this.loadAssignedClients();
  }


  loadExercises() {
    this.apiService.getAllExercises().subscribe({
      next: (data: any) => this.exercises = data,
      error: (err) => console.error('Errore nel caricare gli esercizi:', err)
    });
  }

  loadMyPlans() {
    this.apiService.getMyCreatedPlans().subscribe({
      next: (data) => this.myPlans = data,
      error: (err) => console.error('Errore nel caricare le schede create:', err)
    });
  }

  loadAssignedClients() {
    this.apiService.getAssignedClient().subscribe({
      next: (data) => this.assignedClients = data,
      error: (err) => console.error('Errore nel caricare i clienti:', err)
    });
  }


  saveExercise() {
    if (!this.exerciseData.name) {
      this.presentToast('Il nome dell\'esercizio è obbligatorio.', 'danger');
      return;
    }
    this.apiService.createExercise(this.exerciseData).subscribe({
      next: (newExercise) => {
        this.presentToast('Esercizio salvato con successo!', 'success');
        this.exerciseData = { name: '', description: '', muscle_group: '' };
        this.exercises.push(newExercise);
      },
      error: (err) => this.presentToast('Errore durante il salvataggio.', 'danger')
    });
  }

  async deleteExercise(exerciseId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma Eliminazione',
      message: 'Sei sicuro di voler eliminare questo esercizio?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          handler: () => {
            this.apiService.deleteExercise(exerciseId).subscribe({
              next: () => {
                this.presentToast('Esercizio eliminato con successo.', 'success');
                this.exercises = this.exercises.filter(ex => ex.id !== exerciseId);
              },
              error: (err) => this.presentToast('Errore durante l\'eliminazione.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }


  toggleExerciseSelection(exerciseId: number, event: any) {
    const isChecked = event.detail.checked;
    if (isChecked) {
      this.selectedExercises.add(exerciseId);
    } else {
      this.selectedExercises.delete(exerciseId);
    }
  }

  savePlan() {
    if (!this.planData.name || this.selectedExercises.size === 0) {
      this.presentToast('Il nome della scheda e almeno un esercizio sono obbligatori.', 'danger');
      return;
    }
    const dataToSend = {
      name: this.planData.name,
      description: this.planData.description,
      exercise_ids: Array.from(this.selectedExercises),
      customer_id: this.planData.customer_id
    };
    this.apiService.createPlan(dataToSend).subscribe({
      next: () => {
        this.presentToast('Scheda creata con successo!', 'success');
        this.planData = { name: '', description: '', customer_id: null };
        this.selectedExercises.clear();
        this.loadExercises();
        this.loadMyPlans();
      },
      error: (err) => this.presentToast('Errore durante la creazione della scheda.', 'danger')
    });
  }

  async deletePlan(planId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma Eliminazione',
      message: 'Sei sicuro di voler eliminare questa scheda?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          handler: () => {
            this.apiService.deletePlan(planId).subscribe({
              next: () => {
                this.presentToast('Scheda eliminata con successo!', 'success');
                this.loadMyPlans();
              },
              error: (err) => this.presentToast('Errore durante l\'eliminazione.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  togglePlanDetails(planId: number) {
    if (this.currentlyOpenPlanId === planId) {
      this.currentlyOpenPlanId = null;
      return;
    }
    this.currentlyOpenPlanId = planId;
    const plan = this.myPlans.find(p => p.id === planId);

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