import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieAddingAPIComponent } from './movie-adding-api.component';

describe('MovieAddingAPIComponent', () => {
  let component: MovieAddingAPIComponent;
  let fixture: ComponentFixture<MovieAddingAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieAddingAPIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieAddingAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
