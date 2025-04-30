import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';
// Use destructuring to get the named export (works with CommonJS style bundling)
const { createUploadLink } = require('apollo-upload-client');


// Upload link setup
const uploadLink = createUploadLink({
  uri: 'https://uat-api.vmodel.app/vla/graphql/',
  credentials: 'same-origin',
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    if (networkError.message.includes('CORS')) {
      console.log('CORS error detected. Check server configuration.');
    }
  }
});

// Auth header setup
const authLink = setContext((_, { headers, includeAuth = true }) => {
  if (includeAuth === false) return { headers };
  const token = Cookies.get('auth_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only' },
    query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
  },
});
