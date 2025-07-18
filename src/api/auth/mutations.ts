import { gql } from '@apollo/client';
// GraphQL mutation for user registration
export const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!, 
    $firstName: String!, 
    $lastName: String!, 
    $password1: String!, 
    $password2: String!, 
    $username: String!,
    $otpCode: String!
    $isInstructor: Boolean!
  ) {
    register(
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      password1: $password1,
      password2: $password2,
      username: $username,
      otpCode: $otpCode,
      isInstructor: $isInstructor,
    ) {
      errors
      success
      refreshToken
      token
    }
  }
`;

// GraphQL mutation for user login
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors
      refreshToken
      success
      token
      user {
        username
        lastName
        isVerified
        firstName
        email
        isInstructor
        id
      }
    }
  }
`;

// GraphQL mutation to send verification email
export const SEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation SendVerificationEmail($email: String!) {
    sendVerificationEmail(email: $email) {
      message
      success
    }
  }
`;


// Graphql mutation to verify token
export const VERIFY_TOKEN_MUTATION = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($credential: String!) {
    loginWithGoogle(credential: $credential) {
      success
      token
      refreshToken
      user {
        id
        email
        firstName
        lastName
        isInstructor
      }
      message
    }
  }
`;

export const SOCIAL_AUTH_MUTATION = gql`
  mutation SocialAuth($accessToken: String!) {
    socialAuth(accessToken: $accessToken) {
      success
      token
      refreshToken
      user {
        id
        email
        firstName
        lastName
        isInstructor
      }
      errors
    }
  }
`;

