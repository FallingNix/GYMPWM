import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  getCurrentUser(){
    return this.http.get(`${this.apiUrl}/users/me`, { headers: this.getAuthHeaders() });
  }

  createExercise(data: any) {
  return this.http.post(`${this.apiUrl}/exercises`, data, { headers: this.getAuthHeaders() });
  }

  getAllExercises() {
    
    return this.http.get(`${this.apiUrl}/exercises`, { headers: this.getAuthHeaders() });
  }

  deleteExercise(exerciseId: number) {
    
    return this.http.delete(`${this.apiUrl}/exercises/${exerciseId}`, { headers: this.getAuthHeaders() });
  }

  getUsersByRole(role: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/admin/users/role?role=${role}`, { headers: this.getAuthHeaders() });
  }

  
  assignTrainer(customerId: number, trainerId: number): Observable<any> {
    const body = { customer_id: customerId, trainer_id: trainerId };
    return this.http.post(`${this.apiUrl}/admin/assign-trainer`, body, { headers: this.getAuthHeaders() });
  }

  unassignTrainer(customerId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/admin/unassign-trainer/${customerId}`, { headers: this.getAuthHeaders() });
  }

  getAssignedClient(): Observable<any> {
    const headers = this.getAuthHeaders()
    .set('Cache-Control', 'no-cache')
    .set('Pragma', 'no-cache');
    
  return this.http.get(`${this.apiUrl}/users/my-customers`, { headers: this.getAuthHeaders() });
  }

  createPlan(planData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/plans`, planData, { headers: this.getAuthHeaders() });
  }

  getMyCreatedPlans(): Observable<any> {
  return this.http.get(`${this.apiUrl}/plans/my-created-plans`, { headers: this.getAuthHeaders() });
  }

  deletePlan(planId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/plans/${planId}`, { headers: this.getAuthHeaders() });
  }

  getPlanDetails(planId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/plans/${planId}`, { headers: this.getAuthHeaders() });
  }

  getAssignedPlans(): Observable<any> {
  return this.http.get(`${this.apiUrl}/plans/my-assigned-plans`, { headers: this.getAuthHeaders() });
  }

  createSlot(slotData: { start_time: string, end_time: string, max_clients?: number }): Observable<any> {
  return this.http.post(`${this.apiUrl}/slots`, slotData, { headers: this.getAuthHeaders() });
  }


  getMySlots(): Observable<any> {
  return this.http.get(`${this.apiUrl}/slots/my-slots`, { headers: this.getAuthHeaders() });
  }

  deleteSlot(slotId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/slots/${slotId}`, { headers: this.getAuthHeaders() });
  }

  getSlotsByTrainer(trainerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/slots/${trainerId}`, { headers: this.getAuthHeaders() });
  }

  createBooking(slotId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, { slot_id: slotId }, { headers: this.getAuthHeaders() });
  }

  getMyBookings(): Observable<any> {
  return this.http.get(`${this.apiUrl}/bookings/me`, { headers: this.getAuthHeaders() });
  }

  deleteBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/${bookingId}`, { headers: this.getAuthHeaders() });
  }

  createRating(ratingData: { trainer_id: number, rating: number, review: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/ratings`, ratingData, { headers: this.getAuthHeaders() });
  }

  getRatingsForTrainer(trainerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ratings/trainer/${trainerId}`, { headers: this.getAuthHeaders() });
  }

  deleteRating(ratingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ratings/${ratingId}`, { headers: this.getAuthHeaders() });
  }
}