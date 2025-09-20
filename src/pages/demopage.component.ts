// Page: DemoPage
// Title: Demo Page
// Description: Generated from prompt (demo mode)
// Route: /demo

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "@your-ds/angular";
import { TextComponent } from "@your-ds/angular";
import { ButtonComponent } from "@your-ds/angular";

@Component({
  selector: 'app-emopage',
  standalone: true,
  imports: [CardComponent , TextComponent , ButtonComponent , CommonModule],
  template: `
  <app-card title="AI Generated (Demo)">
    <app-text size="md">
      This component was generated from a prompt in demo mode
    </app-text>
    <app-button variant="primary">
      Click me
    </app-button>
  </app-card>
  `
})
export class DemoPageComponent {
}
