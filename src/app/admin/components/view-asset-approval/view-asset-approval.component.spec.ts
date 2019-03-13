import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetApprovalComponent } from './view-asset-approval.component';

describe('ViewAssetApprovalComponent', () => {
  let component: ViewAssetApprovalComponent;
  let fixture: ComponentFixture<ViewAssetApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAssetApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssetApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
