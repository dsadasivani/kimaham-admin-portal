import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderProgressComponent } from './under-progress.component';

describe('UnderProgressComponent', () => {
  let component: UnderProgressComponent;
  let fixture: ComponentFixture<UnderProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
