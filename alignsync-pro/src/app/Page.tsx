"use client";

import { useAuth } from "react-oidc-context";

export default function TestCognito() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return (
    <div>
      <h2>Cognito Test Page</h2>
      {auth.isAuthenticated ? (
        <div>
          <p>Signed in as: {auth.user?.profile.email}</p>
          <p>ID Token: {auth.user?.id_token}</p>
          <button onClick={() => auth.removeUser()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => auth.signinRedirect()}>Sign In</button>
      )}
    </div>
  );
}

