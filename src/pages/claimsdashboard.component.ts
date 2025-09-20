// Page: ClaimsDashboard
// Title: Claims Dashboard
// Description: Angular claims management dashboard with data integration
// Route: /claims

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "@your-ds/angular";
import { DataTableComponent } from "@your-ds/angular";
import { StackComponent } from "@your-ds/angular";
import { StatComponent } from "@your-ds/angular";
import { ButtonComponent } from "@your-ds/angular";
import { ModalComponent } from "@your-ds/angular";
import { FormComponent } from "@your-ds/angular";
import { SelectComponent } from "@your-ds/angular";
import { GraphQLService } from "@your-ds/angular/services";

@Component({
  selector: 'app-laimsdashboard',
  standalone: true,
  imports: [CardComponent , DataTableComponent , StackComponent , StatComponent , ButtonComponent , ModalComponent , FormComponent , SelectComponent , CommonModule],
  template: `
  <app-card title="Open Claims" subtitle="Current open insurance claims" shadow="md">
    <app-data-table [columns]='[{"key":"claimId","header":"Claim #"},{"key":"status","header":"Status"},{"key":"owner","header":"Owner"},{"key":"amount","header":"Amount"},{"key":"createdAt","header":"Created"}]' [dataSource]="graphqlService.query('GET_OPEN_CLAIMS', {"limit":20,"status":"open"})" [sortable]="true" [pagination]="true" [loading]="false" (rowClick)="onClaimRowClick" (sort)="onClaimSort" />
  </app-card>

  <app-card title="Key Metrics" shadow="md">
    <app-stack spacing="3" align="stretch">
      <app-stat label="Average Cycle Time" [value]="kpiData.avgCycleTime" trend="up" change="-2.3d" />
      <app-stat label="Total Claims" [value]="kpiData.totalClaims" trend="neutral" change="+5" />
      <app-stat label="Pending Review" [value]="kpiData.pendingReview" trend="down" change="-3" />
      <app-stat label="Approved Today" [value]="kpiData.approvedToday" trend="up" change="+8" />
    </app-stack>
  </app-card>

  <app-card title="Quick Actions" shadow="sm">
    <app-stack spacing="4">
      <app-button variant="primary" size="md" icon="plus" (click)="onCreateClaim">
        Create New Claim
      </app-button>
      <app-button variant="secondary" size="md" icon="download" (click)="onExportData">
        Export Claims Data
      </app-button>
      <app-button variant="outline" size="md" icon="settings" (click)="onOpenSettings">
        Dashboard Settings
      </app-button>
    </app-stack>
  </app-card>

  <app-modal title="Dashboard Settings" size="lg" [closable]="true" [visible]="showSettingsModal" (close)="onCloseSettings" (visibleChange)="onSettingsVisibilityChange">
    <app-form [formGroup]="settingsForm" (submit)="onSaveSettings">
      <app-stack spacing="4">
        <app-select [options]='[{"value":"10","label":"10 per page"},{"value":"20","label":"20 per page"},{"value":"50","label":"50 per page"}]' placeholder="Items per page" formControlName="itemsPerPage" />
        <app-select [options]='[{"value":"newest","label":"Newest First"},{"value":"oldest","label":"Oldest First"},{"value":"amount","label":"By Amount"}]' placeholder="Default sort" formControlName="defaultSort" />
      </app-stack>
    </app-form>
  </app-modal>
  `
})
export class ClaimsDashboardComponent {
  constructor(
  private graphqlService: GraphQLService
  ) {}
}
