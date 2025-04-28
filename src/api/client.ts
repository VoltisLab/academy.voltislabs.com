import { ApiClientOptions, ApiResponse } from "@/lib/types";
 
  /**
   * GraphQL API client to handle requests
   * @param query - GraphQL query or mutation
   * @param variables - Variables for the query/mutation
   * @param options - Additional options for the request
   * @returns Promise with the response data
   */
  export const apiClient = async <T>(
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any>,
    options: ApiClientOptions = { includeAuth: true }
  ): Promise<T> => {
    const API_URL = 'https://uat-api.vmodel.app/vla/graphql/';
    
    // Validate query string is provided
    if (!query || typeof query !== 'string' || query.trim() === '') {
      throw new Error('Must provide query string.');
    }
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication token if includeAuth is true
      if (options.includeAuth !== false && typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
        credentials: options.credentials || 'same-origin', 
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json() as ApiResponse<T>;
  
      // Debug logging
      console.log('API Response:', result);
  
      if (result.errors?.length) {
        throw new Error(result.errors[0].message);
      }
  
      if (!result.data) {
        throw new Error('No data returned from API');
      }
  
      return result.data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };