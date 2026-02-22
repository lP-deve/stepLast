import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  type: string;        // 'food', 'lunch', 'dinner', 'drink'
  ingredients: string; 
  calories: string;    // Required for your sort logic
  flavor?: string;
  size?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'https://694d541bad0f8c8e6e20679f.mockapi.io/menu'; 

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }
}