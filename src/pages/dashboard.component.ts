// Page: Dashboard
// Title: Dashboard
// Description: Analytics and metrics dashboard
// Route: /dashboard

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "@your-ds/angular";
import { StackComponent } from "@your-ds/angular";
import { StatComponent } from "@your-ds/angular";
import { DataTableComponent } from "@your-ds/angular";
import { GraphQLService } from "@your-ds/angular/services";

@Component({
  selector: "app-ashboard",
  standalone: true,
  imports: [
    CardComponent,
    StackComponent,
    StatComponent,
    DataTableComponent,
    CommonModule,
  ],
  template: `
  <app-card title="Key Metrics" subtitle="Overview of important statistics">
    <app-stack spacing="3">
      <app-stat label="Total Users" value="1,234" trend="up" change="+12%" />
      <app-stat label="Revenue" value="$45,678" trend="up" change="+8%" />
      <app-stat label="Conversion" value="3.2%" trend="neutral" change="0%" />
    </app-stack>
  </app-card>

  <app-card title="Recent Activity" subtitle="Latest user actions">
    <app-data-table [columns]='[{"key":"user","header":"User"},{"key":"action","header":"Action"},{"key":"timestamp","header":"Time"}]' [dataSource]="graphqlService.query('GET_RECENT_ACTIVITY', {"limit":10})" />
  </app-card>
  `,
})
export class DashboardComponent {
  constructor(private graphqlService: GraphQLService) {}
}
