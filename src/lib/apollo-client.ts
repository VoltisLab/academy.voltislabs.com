import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';

// Create an http link
const httpLink = createHttpLink({
  uri: 'https://uat-api.vmodel.app/vla/graphql/',
  credentials: 'same-origin', 
});

// Error handling link for Apollo - handles network and GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Handle GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => 
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  // Handle network errors, including CORS
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    // Check if it's a CORS error
    if (networkError.message.includes('CORS')) {
      console.log('CORS error detected. Check server configuration.');
    }
  }
});

// Auth link to add the token to the header
const authLink = setContext((_, { headers, includeAuth = true }) => {
  // Skip adding auth if includeAuth is explicitly set to false
  if (includeAuth === false) {
    return { headers };
  }
  
  // Get the authentication token from cookies if it exists
  const token = Cookies.get('auth_token');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Initialize Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});