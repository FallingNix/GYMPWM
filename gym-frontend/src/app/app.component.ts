import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { 
  IonApp, 
  IonRouterOutlet, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem 
} from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';
import { barbellOutline, peopleOutline, trophyOutline, personCircleOutline,checkmarkOutline, closeOutline,eyeOutline,eyeOffOutline,callOutline,logOutOutline,ellipsisVerticalOutline,listOutline,calendarOutline,searchOutline,addCircleOutline,trashOutline,closeCircleOutline,mailOutline,documentTextOutline} from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, 
    IonTitle, IonContent, IonList, IonItem, CommonModule, RouterLink
  ],
})
export class AppComponent {
  constructor() {
    
    addIcons({
      barbellOutline,
      peopleOutline,
      trophyOutline,
      personCircleOutline,
      checkmarkOutline,
      closeOutline,
      eyeOutline,
      eyeOffOutline,
      callOutline,
      logOutOutline,
      ellipsisVerticalOutline,
      listOutline,
      calendarOutline,
      searchOutline,
      addCircleOutline,
      trashOutline,
      closeCircleOutline,
      mailOutline,
      documentTextOutline  
    });
  }
}