// Page: DemoPage
// Title: Demo Page
// Description: A customizable demo page showcasing your design system components
// Route: /demo

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "@your-ds/angular";
import { TextComponent } from "@your-ds/angular";
import { StackComponent } from "@your-ds/angular";
import { ButtonComponent } from "@your-ds/angular";
import { FormComponent } from "@your-ds/angular";
import { InputComponent } from "@your-ds/angular";
import { SelectComponent } from "@your-ds/angular";
import { DataTableComponent } from "@your-ds/angular";
import { StatComponent } from "@your-ds/angular";
import { DataService } from "@your-ds/angular/services";

@Component({
  selector: 'app-emopage',
  standalone: true,
  imports: [CardComponent , TextComponent , StackComponent , ButtonComponent , FormComponent , InputComponent , SelectComponent , DataTableComponent , StatComponent , CommonModule],
  template: `
  <app-card title="Welcome to Your Design System" subtitle="This demo page showcases the components available in your design system">
    <app-text size="md">
      This page was generated using your design system components. You can customize this by editing the specification or using AI prompts to create exactly what you need.
    </app-text>
  </app-card>

  <app-card title="Available Components" subtitle="Here are some of the components from your design system">
    <app-stack spacing="3">
      <app-text size="sm" weight="semibold">
        Buttons:
      </app-text>
      <app-stack spacing="2" align="start">
        <app-button variant="primary" size="md">
          Primary Button
        </app-button>
        <app-button variant="secondary" size="md">
          Secondary Button
        </app-button>
        <app-button variant="outline" size="md">
          Outline Button
        </app-button>
      </app-stack>
    </app-stack>
  </app-card>

  <app-card title="Form Components" subtitle="Interactive form elements">
    <app-form formGroup="demoForm">
      <app-stack spacing="3">
        <app-input placeholder="Enter your name" type="text" formControlName="name" />
        <app-input placeholder="Enter your email" type="email" formControlName="email" />
        <app-select placeholder="Choose an option" formControlName="option" [options]='[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]' />
      </app-stack>
    </app-form>
  </app-card>

  <app-card title="Data Display" subtitle="Tables and statistics">
    <app-stack spacing="4">
      <app-data-table [columns]='[{"key":"name","header":"Name"},{"key":"role","header":"Role"},{"key":"status","header":"Status"}]' [dataSource]="of([{"name":"John Doe","role":"Developer","status":"Active"},{"name":"Jane Smith","role":"Designer","status":"Active"},{"name":"Bob Wilson","role":"Manager","status":"Inactive"}])" />
      <app-stack spacing="2">
        <app-stat label="Total Users" value="1,234" />
        <app-stat label="Active Sessions" value="567" trend="up" change="+12%" />
      </app-stack>
    </app-stack>
  </app-card>

  <app-card title="Next Steps" subtitle="How to customize this demo">
    <app-stack spacing="3">
      <app-text size="md" weight="medium">
        To create your own pages:
      </app-text>
      <app-text size="sm">
        1. Use AI prompts: npm run ai:build -- --prompt prompts/your-prompt.md
      </app-text>
      <app-text size="sm">
        2. Edit specifications: modify examples/generic-page-demo.spec.json
      </app-text>
      <app-text size="sm">
        3. Customize design system: edit design-system/components.manifest.json
      </app-text>
      <app-button variant="primary" size="md" (click)="onLearnMore">
        Learn More
      </app-button>
    </app-stack>
  </app-card>
  `
})
export class DemoPageComponent {
  constructor(
  private dataService: DataService
  ) {}
}
