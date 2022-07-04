import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroeconomicosComponent } from './macroeconomicos.component';

describe('MacroeconomicosComponent', () => {
  let component: MacroeconomicosComponent;
  let fixture: ComponentFixture<MacroeconomicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroeconomicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroeconomicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
