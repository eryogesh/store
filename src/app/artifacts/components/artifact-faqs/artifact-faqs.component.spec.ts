import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactFaqsComponent } from './artifact-faqs.component';

describe('ArtifactFaqsComponent', () => {
  let component: ArtifactFaqsComponent;
  let fixture: ComponentFixture<ArtifactFaqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtifactFaqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
