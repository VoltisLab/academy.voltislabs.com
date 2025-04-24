import { LoginData, LoginResponse, SignUpData, SignUpResponse } from '@/lib/types';
import { apolloClient } from '@/lib/apollo-client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from './mutations';

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
      console.log(errors)
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
      console.log(data)
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('refreshToken', data);
      localStorage.setItem('user', JSON.stringify(data.login.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

