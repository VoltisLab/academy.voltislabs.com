import { gql } from '@apollo/client';
// GraphQL mutation for user registration
export const REGISTER_MUTATION = gql`
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