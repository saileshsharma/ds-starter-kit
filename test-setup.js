// Simple test setup for generated components
// This creates mock implementations of your design system components

// Mock React components for testing
export const mockReactComponents = {
  Card: ({ title, subtitle, shadow, children }) =>
    `<div class="card shadow-${shadow}">
      ${title ? `<h2>${title}</h2>` : ''}
      ${subtitle ? `<p>${subtitle}</p>` : ''}
      ${children}
    </div>`,

  DataTable: ({ columns, dataSource, sortable, pagination }) =>
    `<table class="data-table">
      <thead>
        <tr>${columns.map(col => `<th>${col.header}</th>`).join('')}</tr>
      </thead>
      <tbody><tr><td colspan="${columns.length}">Data from: ${JSON.stringify(dataSource)}</td></tr></tbody>
    </table>`,

  Button: ({ variant, size, children }) =>
    `<button class="btn btn-${variant} btn-${size}">${children}</button>`,

  Stat: ({ label, value, trend, change }) =>
    `<div class="stat">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
      ${trend ? `<div class="stat-trend trend-${trend}">${change}</div>` : ''}
    </div>`
};

// Mock Angular components for testing
export const mockAngularComponents = {
  'app-card': (inputs) =>
    `<div class="card">
      ${inputs.title ? `<h2>${inputs.title}</h2>` : ''}
      ${inputs.subtitle ? `<p>${inputs.subtitle}</p>` : ''}
    </div>`,

  'app-data-table': (inputs) =>
    `<table class="data-table">
      <thead><tr>${inputs.columns.map(col => `<th>${col.header}</th>`).join('')}</tr></thead>
      <tbody><tr><td colspan="${inputs.columns.length}">Loading...</td></tr></tbody>
    </table>`,

  'app-button': (inputs) =>
    `<button class="btn btn-${inputs.variant}">${inputs.text || 'Button'}</button>`
};

console.log('Test setup ready - use these mocks to preview your components');