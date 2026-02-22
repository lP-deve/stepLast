import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface DiningEvent {
  id: string;
  Title: string;
  text: string;
}
@Component({
  selector: 'app-events',
  imports: [CommonModule, HttpClientModule ],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events   implements OnInit {
 private http = inject(HttpClient);
  private readonly API_URL = 'https://694fb0888531714d9bceb453.mockapi.io/events';

  events = signal<DiningEvent[]>([]);

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.http.get<DiningEvent[]>(this.API_URL).subscribe({
      next: (data) => {
        this.events.set(data);
      },
      error: (err) => console.error('Error fetching events:', err)
    });
  }

  handleImgError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x280/111/f6d79e?text=Event+Image';
  }
}

