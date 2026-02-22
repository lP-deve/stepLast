import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MenuComponent } from './pages/menu/menu';
import { Story } from './pages/story/story';
import { Events } from './pages/events/events';

import { CategoryComponent } from './pages/category/category.component.ts/category.component.ts';
import { App } from './pages/blog/blog';
import { Details } from './pages/details/details';
import { Book } from './pages/book-table/book-table';
 


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'menu', component: MenuComponent},
  { path: 'blog', component: App},
  { path: 'story', component: Story },
  { path: 'events', component: Events},
  { path: 'book', component: Book},
  { path: 'details', component: Details },
  { path: 'menu/category', component: CategoryComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];