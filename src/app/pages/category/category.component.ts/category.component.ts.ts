import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService, MenuItem } from '../../../services/menu.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category.component.ts.html',
  styleUrls: ['./category.component.ts.css']
})
export class CategoryComponent implements OnInit {
  allItems: MenuItem[] = [];      
  filteredItems: MenuItem[] = []; 
  
  currentType: string = ''; 
  isLoading: boolean = true; 
  
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOrder: string = '';
  searchQuery: string = '';
  showFilters: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.isLoading = true; 

 
    this.menuService.getMenu().subscribe({
      next: (data) => {
        this.allItems = data;

       
        this.route.queryParams.subscribe(params => {
          this.currentType = params['type'] || 'food'; 
          
         
          this.filterByType();
          
          this.isLoading = false; 
        });
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
        this.isLoading = false;
      }
    });
  }

  filterByType() {
   
    this.filteredItems = this.allItems.filter(item => item.type === this.currentType);
  
    this.minPrice = null;
    this.maxPrice = null;
    this.searchQuery = '';
    this.showFilters = false;
  }

  changeCategory(type: string) {

    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { type: type },
      queryParamsHandling: 'merge', 
    });
  }

  // --- Filter Logic ---
  applyFilters() {
    let temp = this.allItems.filter(item => item.type === this.currentType);

    temp = temp.filter(item => {
      const priceVal = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
      const matchMin = this.minPrice === null || priceVal >= this.minPrice;
      const matchMax = this.maxPrice === null || priceVal <= this.maxPrice;
      const matchSearch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchMin && matchMax && matchSearch;
    });

    if (this.sortOrder === 'asc') {
      temp.sort((a, b) => (Number(a.calories) || 0) - (Number(b.calories) || 0));
    } else if (this.sortOrder === 'desc') {
      temp.sort((a, b) => (Number(b.calories) || 0) - (Number(a.calories) || 0));
    }

    this.filteredItems = temp;
    this.showFilters = false;
  }

  resetFilters() {
    this.filterByType(); 
  }
}