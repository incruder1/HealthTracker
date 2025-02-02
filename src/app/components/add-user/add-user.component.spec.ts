import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AddUserComponent } from './add-user.component';
import { AddUserService } from '@/app/services/add-user/add-user.service';
import { of } from 'rxjs';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let addUserServiceSpy: jasmine.SpyObj<AddUserService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    addUserServiceSpy = jasmine.createSpyObj('AddUserService', ['addUser']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        AddUserComponent,
      ],
      providers: [
        { provide: AddUserService, useValue: addUserServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT emit userAdded if addUser fails', () => {
    addUserServiceSpy.addUser.and.returnValue(false);
    const userAddedSpy = spyOn(component.userAdded, 'emit');

    component.onSubmit({ resetForm: jasmine.createSpy() } as unknown as NgForm);

    expect(userAddedSpy).not.toHaveBeenCalled();
  });

  it('should submit form and reset if addUser succeeds', () => {
    addUserServiceSpy.addUser.and.returnValue(true);
    spyOn(component.userAdded, 'emit');

    const form = jasmine.createSpyObj('NgForm', ['resetForm']);

    component.onSubmit(form);

    expect(addUserServiceSpy.addUser).toHaveBeenCalledWith(
      component.name,
      component.workoutType,
      component.workoutMinutes
    );
    expect(form.resetForm).toHaveBeenCalled();
    expect(component.userAdded.emit).toHaveBeenCalled();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
  });

  it('should not reset form if addUser fails', () => {
    addUserServiceSpy.addUser.and.returnValue(false);
    spyOn(component.userAdded, 'emit');

    const form = jasmine.createSpyObj('NgForm', ['resetForm']);

    component.onSubmit(form);

    expect(form.resetForm).not.toHaveBeenCalled();
    expect(component.userAdded.emit).not.toHaveBeenCalled();
    expect(dialogSpy.closeAll).not.toHaveBeenCalled();
  });

  it('should close all dialogs when onCancel is called', () => {
    component.onCancel();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
  });
});
