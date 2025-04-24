import { LoginData, LoginResponse, SignUpData, SignUpResponse } from '@/lib/types';
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';

// GraphQL mutation for user registration
const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!, 
    $firstName: String!, 
    $lastName: String!, 
    $password1: String!, 
    $password2: String!, 
    $username: String!
  ) {
    register(
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      password1: $password1,
      password2: $password2,
      username: $username
    ) {
      error
      success
      refreshToken
      token
    }
  }
`;

// GraphQL mutation for user login
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors
      refreshToken
      success
      token
      user {
        verified
        username
        lastName
        isVerified
        firstName
        email
        id
      }
    }
  }
`;

/**
 * Sign up a new user using Apollo Client
 * @param userData - User data including fullName, email, and password
 * @returns Promise with signup response
 */
export const signUp = async (userData: SignUpData): Promise<SignUpResponse> => {
  // Split full name into first and last name
  const nameParts = userData.fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  
  // Generate username from fullName
  const username = userData.fullName;

  try {
    const { data, errors } = await apolloClient.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        email: userData.email,
        firstName,
        lastName,
        password1: userData.password,
        password2: userData.password,
        username,
      },
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    // Store tokens on successful registration
    if (data.register.success && typeof window !== 'undefined') {
      localStorage.setItem('token', data.register.token);
      localStorage.setItem('refreshToken', data.register.refreshToken);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Log in a user using Apollo Client
 * @param credentials - User credentials including email and password
 * @returns Promise with login response
 */
export const login = async (credentials: LoginData): Promise<LoginResponse> => {
  try {
    const { data, errors } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    // Store tokens on successful login
    if (data.login.success && typeof window !== 'undefined') {
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('refreshToken', data.login.refreshToken);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};