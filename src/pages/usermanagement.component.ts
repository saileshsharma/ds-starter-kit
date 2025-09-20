// Page: UserManagement
// Title: User Management
// Description: Manage users and their permissions
// Route: /users

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "@your-ds/angular";
import { StackComponent } from "@your-ds/angular";
import { InputComponent } from "@your-ds/angular";
import { DataTableComponent } from "@your-ds/angular";
import { HttpClient } from "@your-ds/angular/services";

@Component({
  selector: "app-sermanagement",
  standalone: true,
  imports: [
    CardComponent,
    StackComponent,
    InputComponent,
    DataTableComponent,
    CommonModule,
  ],
  template: `
    <app-card title="Users" subtitle="Manage system users and roles">
      <app-stack spacing="3">
        <app-input placeholder="Search users..." type="text" />
        <app-data-table
          [columns]="[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role' },
            { key: 'status', header: 'Status' },
          ]"
          [dataSource]="httpService.get('/api/users', {})"
        />
      </app-stack>
    </app-card>
  `,
})
export class UserManagementComponent {
  constructor(private httpclient: HttpClient) {}
}
