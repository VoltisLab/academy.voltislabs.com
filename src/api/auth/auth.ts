import { LoginData, LoginResponse, SignUpData, SignUpResponse } from '@/lib/types';
import { apolloClient } from '@/lib/apollo-client';
import { LOGIN_MUTATION, REGISTER_MUTATION, SEND_VERIFICATION_EMAIL_MUTATION, VERIFY_TOKEN_MUTATION, GOOGLE_LOGIN_MUTATION, SOCIAL_AUTH_MUTATION } from './mutations';
import Cookies from 'js-cookie'

// Helper function to set cookies with a default expiration of 7 days
const setCookie = (name: string, value: string, days = 7) => {
  Cookies.set(name, value, { 
    expires: days, 
    path: '/',
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'strict'
  });
};

export const signUp = async (userData: SignUpData): Promise<SignUpResponse> => {
  // Split full name into first and last name for backend requirements
  const nameParts = userData.fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  
  // Generate username by joining firstName and lastName with underscore
  const username = lastName ? `${firstName}_${lastName}` : firstName;

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
        otpCode: userData.otpCode,
        isInstructor: userData.isInstructor,
      },
    });

    if (errors) {
      console.log(errors);
    }

    // Store tokens on successful registration
    if (data.register.success && typeof window !== 'undefined') {
      // Set auth cookies instead of using localStorage
      setCookie('auth_token', data.register.token);
      setCookie('refresh_token', data.register.refreshToken);
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
      // Set auth cookies instead of using localStorage
      setCookie('auth_token', data.login.token);
      setCookie('refresh_token', data.login.refreshToken || '');
      setCookie('user', JSON.stringify(data.login.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  // Remove all auth cookies
  Cookies.remove('auth_token');
  Cookies.remove('refresh_token');
  Cookies.remove('user');
};

export const sendVerificationCode = async (email: string) => {
  try {
    if (!email) {
      throw new Error('Email address not found');
    }

    const { data, errors } = await apolloClient.mutate({
      mutation: SEND_VERIFICATION_EMAIL_MUTATION,
      variables: {
        email,
      },
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data.sendVerificationEmail;
  } catch (error) {
    console.error('Send verification email error:', error);
    throw error;
  }
};

/**
 * Verifies the OTP token provided by the user
 */
export const verifyOtp = async (token: string) => {
  try {
    if (!token) {
      throw new Error('Verification code is required');
    }

    const { data, errors } = await apolloClient.mutate({
      mutation: VERIFY_TOKEN_MUTATION,
      variables: {
        token,
      },
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data.verifyToken;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// Helper function to get user data from cookie
export const getCurrentUser = () => {
  const userCookie = Cookies.get('user');
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!Cookies.get('auth_token');
};

// Type for Google login response (customize as needed)
export interface GoogleAuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}

// Google login function
export const loginWithGoogle = async (accessToken: string) => {
  try {
    const { data, errors } = await apolloClient.mutate({
      mutation: SOCIAL_AUTH_MUTATION,
      variables: { accessToken, provider: "google-oauth2" },
    });
    if (errors || !data?.socialAuth?.success) {
      throw new Error(errors?.[0]?.message || 'Google login failed');
    }
    // Do not set cookies here; let performLogin handle it for consistency
    return data.socialAuth;
  } catch (error: any) {
    throw new Error(error?.message || 'Google login failed');
  }
};