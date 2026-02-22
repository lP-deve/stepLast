import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponentTs } from './category.component.ts';

describe('CategoryComponentTs', () => {
  let component: CategoryComponentTs;
  let fixture: ComponentFixture<CategoryComponentTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryComponentTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryComponentTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
