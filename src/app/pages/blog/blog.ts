import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

export interface Article {
  id: string;
  createdAt: string;
  title: string;
  image: string;
  story: string;
}
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog.html',
  styleUrls: ['./blog.css']
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router); // Inject Router
  private readonly API_URL = 'https://694d541bad0f8c8e6e20679f.mockapi.io/articles';

  articles = signal<Article[]>([]);

  ngOnInit(): void {
    this.fetchArticles();
  }

  async fetchArticles(): Promise<void> {
    try {
      const data = await this.http.get<Article[]>(this.API_URL).toPromise();
      if (data) {
        this.articles.set(data);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  }

  parseDate(dateStr: string): Date | string {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
    return dateStr;
  }
/**
 * Handles image loading errors by hiding the broken image
 */
handleImgError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
}

  // Navigate to details page with query param `id`
  navigateToFullBlog(id: string): void {
    this.router.navigate(['/details'], { queryParams: { id } });
  }
}