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


  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(state => !state);
  }
}

