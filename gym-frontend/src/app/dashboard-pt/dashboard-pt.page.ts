import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,          
  IonItem,         
  IonLabel,
  IonPopover,
  IonListHeader
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-dashboard-pt',
  templateUrl: './dashboard-pt.page.html',
  styleUrls: ['./dashboard-pt.page.scss'],
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
    IonPopover,
    IonListHeader
  ]
})
export class DashboardPTPage implements OnInit {

  @ViewChild('popover') popover!: IonPopover;

  user: any = null;

  assignedClient: any[] = [];


  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

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

    this.loadAssignedClient();
  }

  loadAssignedClient() {
    this.apiService.getAssignedClient().subscribe({
      next: (data) => {
        this.assignedClient = data;
      },
      error: (err) => {
        console.error('Errore nel caricare i clienti assegnati:', err);
      }
    });
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
