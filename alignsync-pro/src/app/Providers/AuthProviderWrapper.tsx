"use client";

import { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Exiy18u5t",
  client_id: "3m2u0jjjd52c9oie6f2189976a",
  redirect_uri: "https://main.d1yv3ay871rrrx.amplifyapp.com/",
  response_type: "code",
  scope: "openid email profile phone",
};

export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
