import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactsUploadComponent } from './artifacts-upload.component';

describe('ArtifactsUploadComponent', () => {
  let component: ArtifactsUploadComponent;
  let fixture: ComponentFixture<ArtifactsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtifactsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
