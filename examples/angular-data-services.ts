// Example Angular data services for integration with your data layer
// Copy these to your actual data layer package (@your-ds/angular/services)

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// GraphQL Service for Angular
@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  private graphqlEndpoint = '/graphql';

  constructor(private http: HttpClient) {}

  query<T>(query: string, variables: any = {}): Observable<T> {
    const body = {
      query,
      variables
    };

    return this.http.post<{data: T, errors?: any[]}>(this.graphqlEndpoint, body)
      .pipe(
        map(response => {
          if (response.errors && response.errors.length > 0) {
            throw new Error(response.errors[0].message);
          }
          return response.data;
        }),
        catchError(error => {
          console.error('GraphQL Error:', error);
          throw error;
        })
      );
  }

  mutation<T>(mutation: string, variables: any = {}): Observable<T> {
    return this.query<T>(mutation, variables);
  }
}

// REST API Service for Angular
@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<T>(url, { params: httpParams })
      .pipe(
        catchError(error => {
          console.error('REST GET Error:', error);
          throw error;
        })
      );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body)
      .pipe(
        catchError(error => {
          console.error('REST POST Error:', error);
          throw error;
        })
      );
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body)
      .pipe(
        catchError(error => {
          console.error('REST PUT Error:', error);
          throw error;
        })
      );
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url)
      .pipe(
        catchError(error => {
          console.error('REST DELETE Error:', error);
          throw error;
        })
      );
  }
}

// Generic Data Service for custom data sources
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private graphqlService: GraphQLService,
    private restService: RestService
  ) {}

  query<T>(source: string, options: any = {}): Observable<T> {
    // Implement custom data fetching logic here
    // This could route to different services based on the source

    if (source.startsWith('graphql:')) {
      const query = source.replace('graphql:', '');
      return this.graphqlService.query<T>(query, options);
    }

    if (source.startsWith('rest:')) {
      const url = source.replace('rest:', '');
      return this.restService.get<T>(url, options);
    }

    // Default to REST GET
    return this.restService.get<T>(source, options);
  }
}

// Reactive Forms Helper Service
@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  constructor(private dataService: DataService) {}

  loadFormData<T>(source: string): Observable<T> {
    return this.dataService.query<T>(source);
  }

  saveFormData<T>(url: string, formValue: any): Observable<T> {
    return this.dataService.query<T>(url, { method: 'POST', body: formValue });
  }
}

// Example usage in generated components:
/*
import { Component, OnInit } from '@angular/core';
import { GraphQLService, RestService } from '@your-ds/angular/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-example',
  template: `
    <app-data-table
      [columns]="columns"
      [dataSource]="claims$ | async"
      [loading]="loading">
    </app-data-table>
  `
})
export class ExampleComponent implements OnInit {
  claims$: Observable<any[]>;
  loading = true;

  constructor(
    private graphqlService: GraphQLService,
    private restService: RestService
  ) {}

  ngOnInit() {
    // GraphQL example
    this.claims$ = this.graphqlService.query('GET_OPEN_CLAIMS', {});

    // REST example
    // this.claims$ = this.restService.get('/api/claims');

    this.loading = false;
  }
}
*/