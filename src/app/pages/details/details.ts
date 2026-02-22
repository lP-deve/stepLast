import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Article {
  id: string;
  createdAt: string;
  title: string;
  image: string;
  story: string;
  info?: string;
}


@Component({
  selector: 'app-details',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  private http = inject(HttpClient);
  
  article = signal<Article | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.getBlog();
  }

  async getBlog(): Promise<void> {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      if (!id) {
        this.errorMessage.set("No blog ID provided.");
        this.isLoading.set(false);
        return;
      }

      const API_URL = `https://694d541bad0f8c8e6e20679f.mockapi.io/articles/${id}`;
      
      this.isLoading.set(true);
      const data = await this.http.get<Article>(API_URL).toPromise();
      
      if (data) {
        this.article.set(data);
      }
    } catch (error) {
      this.errorMessage.set("Failed to load blog");
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void {
    window.history.back();
  }

  handleImgError(event: any): void {
    event.target.style.display = 'none';
  }
}
