// If you don't have this already, make sure these types are defined:
export interface SignUpData {
    fullName: string;
    email: string;
    password: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface SignUpResponse {
    register: {
      success: boolean;
      token: string;
      refreshToken: string;
    };
  }
  
  export interface LoginResponse {
    login: {
      success: boolean;
      token: string;
      refreshToken: string;
      errors?: string[];
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        username: string;
        isVerified: boolean;
        verified: boolean;
      };
    };
  }
  
    
    export interface UserData {
      verified: boolean;
      username: string;
      lastName: string;
      isVerified: boolean;
      firstName: string;
      email: string;
      id: string;
    }
  
    
    export interface ApiClientOptions {
        includeAuth?: boolean;
        credentials?: RequestCredentials;
      }
      
      export interface ApiResponse<T> {
        data?: T;
        errors?: Array<{ message: string }>;
      }