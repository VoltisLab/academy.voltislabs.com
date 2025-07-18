import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function GoogleTest() {
  return (
    <GoogleOAuthProvider clientId="148895792478-0cbulg7s4ohrkd3u25s3fvuo1fd1f30b.apps.googleusercontent.com">
      <div style={{ margin: 100 }}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            alert('Success! ' + JSON.stringify(credentialResponse));
          }}
          onError={() => {
            alert('Login Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}