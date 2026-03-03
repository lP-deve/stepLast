import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen: boolean = false;

  constructor(private router: Router) {} // Inject Router

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // New method to explicitly close the menu
  closeMenu() {
    this.isMenuOpen = false;
  }
}