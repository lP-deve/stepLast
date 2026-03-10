import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html', 
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  isLoading: boolean = true;
  
  breakfastItems: MenuItem[] = [];
  dinnerItems: MenuItem[] = [];
  supperItems: MenuItem[] = [];
  drinkItems: MenuItem[] = [];

  constructor(
    private menuService: MenuService, 
    private router: Router,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    
  
    this.menuService.getMenu().subscribe({
      next: (data) => {
        console.log('Data fetched successfully');

        this.breakfastItems = data.filter(item => item.type === 'food');
        this.dinnerItems = data.filter(item => item.type === 'lunch');
        this.supperItems = data.filter(item => item.type === 'dinner');
        this.drinkItems = data.filter(item => item.type === 'drink');
        
        this.isLoading = false; 

     
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
        this.isLoading = false;
        
        
        this.cd.detectChanges();
      }
    });
  }

  seeMore(type: string) {
    this.router.navigate(['/menu/category'], { queryParams: { type: type } });
  }
}