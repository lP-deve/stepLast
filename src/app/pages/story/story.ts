import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { signal } from '@angular/core';
@Component({
  selector: 'app-story',
  imports: [CommonModule],
  templateUrl: './story.html',
  styleUrl: './story.css',
})
export class Story {

  // Using Angular Signal for state management
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(state => !state);
  }
}

