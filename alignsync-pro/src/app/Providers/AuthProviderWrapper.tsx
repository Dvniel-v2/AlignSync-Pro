"use client";

import { AuthProvider } from "react-oidc-context";
import React from "react";

// ✅ Cognito OIDC config with corrected scopes
const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Exiy18u5t",
  client_id: "3m2u0jjjd52c9oie6f2189976a",
  redirect_uri: "https://main.d1yv3ay871rrrx.amplifyapp.com/",
  response_type: "code",
  scope: "openid email phone profile", // ✅ fixed scopes
};

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
