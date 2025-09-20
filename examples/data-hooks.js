// Example data hooks for integration with your data layer
// Copy these to your actual data layer package (@your-ds/data)

import { useState, useEffect } from 'react';

// GraphQL hook example
export function useGraphQLQuery(query, variables = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Replace with your GraphQL client (Apollo, Relay, etc.)
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables })
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setData(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query, JSON.stringify(variables)]);

  return { data, loading, error };
}

// REST API hook example
export function useRestQuery(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Build URL with query parameters
        const url = new URL(endpoint, window.location.origin);
        if (options.params) {
          Object.entries(options.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
          });
        }

        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...(options.body && { body: JSON.stringify(options.body) })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint, JSON.stringify(options)]);

  return { data, loading, error };
}

// Generic query hook for custom data sources
export function useQuery(source, options = {}) {
  // Implement your custom data fetching logic here
  return useRestQuery(source, options);
}

// Example usage in generated components:
/*
import { useGraphQLQuery, useRestQuery } from '@your-ds/data';

export default function MyComponent() {
  const { data: claims, loading } = useGraphQLQuery("GET_OPEN_CLAIMS", {});
  const { data: stats } = useRestQuery("/api/stats", {});

  if (loading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={[...]}
      dataSource={claims}
    />
  );
}
*/