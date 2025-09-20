// Page: DataListing
// Title: Data Listing
// Description: Browse and manage data
// Route: /listing

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "@your-ds/angular";
import { StackComponent } from "@your-ds/angular";
import { InputComponent } from "@your-ds/angular";
import { SelectComponent } from "@your-ds/angular";
import { DataTableComponent } from "@your-ds/angular";
import { HttpClient } from "@your-ds/angular/services";

@Component({
  selector: "app-atalisting",
  standalone: true,
  imports: [
    CardComponent,
    StackComponent,
    InputComponent,
    SelectComponent,
    DataTableComponent,
    CommonModule,
  ],
  template: `
  <app-card title="Search & Filters">
    <app-stack spacing="3">
      <app-input placeholder="Search..." type="text" />
      <app-select placeholder="Filter by status" [options]='[{"value":"all","label":"All"},{"value":"active","label":"Active"},{"value":"inactive","label":"Inactive"}]' />
    </app-stack>
  </app-card>

  <app-card title="Results">
    <app-data-table [columns]='[{"key":"id","header":"ID"},{"key":"name","header":"Name"},{"key":"status","header":"Status"},{"key":"created","header":"Created"}]' [dataSource]="httpService.get('/api/items', {"page":1,"limit":20})" [sortable]="true" [pagination]="true" />
  </app-card>
  `,
})
export class DataListingComponent {
  constructor(private httpclient: HttpClient) {}
}
