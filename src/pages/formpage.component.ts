// Page: FormPage
// Title: Form
// Description: User input form
// Route: /form

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "@your-ds/angular";
import { FormComponent } from "@your-ds/angular";
import { StackComponent } from "@your-ds/angular";
import { InputComponent } from "@your-ds/angular";
import { SelectComponent } from "@your-ds/angular";
import { ButtonComponent } from "@your-ds/angular";

@Component({
  selector: "app-ormpage",
  standalone: true,
  imports: [
    CardComponent,
    FormComponent,
    StackComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    CommonModule,
  ],
  template: `
    <app-card title="User Information" subtitle="Please fill out your details">
      <app-form formGroup="userForm">
        <app-stack spacing="4">
          <app-input
            placeholder="Full Name"
            formControlName="name"
            [required]="true"
          />
          <app-input
            placeholder="Email"
            type="email"
            formControlName="email"
            [required]="true"
          />
          <app-select
            placeholder="Select Role"
            formControlName="role"
            [options]="[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Administrator' },
              { value: 'manager', label: 'Manager' },
            ]"
          />
          <app-button variant="primary" size="md" (click)="(onSubmit)">
            Submit
          </app-button>
        </app-stack>
      </app-form>
    </app-card>
  `,
})
export class FormPageComponent {}
