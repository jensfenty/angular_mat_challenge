import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

function passwordRule(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');

  // must start with a letter, only letters+numbers, at least 8 chars
  // ^[A-Za-z]  = starts with letter
  // [A-Za-z0-9]{7,} = remaining chars alphanumeric, total length >= 8
  const ok = /^[A-Za-z][A-Za-z0-9]{7,}$/.test(value);
  return ok ? null : { passwordRule: true };
}

function dob2006OrBelow(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (!v) return null;

  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d.getTime())) return { dobInvalid: true };

  // accept year 2006 and below
  return d.getFullYear() <= 2006 ? null : { dobTooYoung: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  darkMode = false;
  submitted = false;

  // Example: "Event Registration Form"
  form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordRule]],
      organization: ['HAU Event', [Validators.required]],

      // DOB validation: 2006 and below only
      dob: [null, [Validators.required, dob2006OrBelow]],

      attendanceType: ['onsite', [Validators.required]],

      skillLevel: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  toggleTheme(checked: boolean) {
    this.darkMode = checked;
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) return;
    console.log('Submitted:', this.form.value);
  }

  reset() {
    this.submitted = false;
    this.form.reset({
      organization: 'HAU Event',
      attendanceType: 'onsite',
      skillLevel: 5,
    });
  }
}