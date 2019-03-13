import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { Pipe, PipeTransform } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthSandbox, AuthApiClientService } from '../../services';
import { ConfigService } from '../../../app-config.service';
import { HttpResponseHandlerService } from '../../../shared/async-services/http';
import { Router } from '@angular/router';
import { TranslateService, TranslateLoader, TranslateParser, TranslateModule } from 'ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { UtilityService } from '../../../shared/utility';
import { AppSandbox } from '../../../app.sandbox';
import { RegistrationForm } from '../../../shared/models';
import { Observable } from 'rxjs/Observable';

@Pipe({ name: 'translate' })
class MockPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

class MockConfigService {
  get(key: any) {
    return key;
  }
}
const registrationForm: RegistrationForm = {
  email: 'yogesh.patel@capgemini.com',
  password: '12345',
  designation: '',
  username: '',
  fullname: '',
};
export class MockAuthSandbox {
  public registerUser(registrationFormData: RegistrationForm): void {
  }
}
fdescribe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpComponent, MockPipe ],
      imports: [FormsModule, ReactiveFormsModule, MessagesModule, ButtonModule, TooltipModule],
      providers: [HttpClient, HttpHandler, AuthSandbox, AuthApiClientService,   { provide: ConfigService, useClass: MockConfigService },
         HttpResponseHandlerService,   { provide: Router, useValue: mockRouter },        TranslateModule,
         TranslateService,
         TranslateLoader,
         TranslateParser, NotificationsService, UtilityService, AppSandbox]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('onSubmit should be called', inject([AuthSandbox], (authSandbox) => {
    component.submitted = true;
    const value = 'yogesh.patel@capgemini.com';
    const registrationFormData = new RegistrationForm(value);
    const regResponse = [{
      msg: '',
      status: '',
    }];
    spyOn(authSandbox, 'registerUser').and.returnValue(new MockAuthSandbox());
    component.authSandbox.registrationResponse$ = Observable.of(regResponse);
    component.onSubmit(value);
  }));
  it('resetFields should be called', () => {
    component.resetFields();
  });
  it('ngOnit should be called', () => {

    component.ngOnInit();
  });
});
