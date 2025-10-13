"use client";

import React from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_yVc0b2D1H", // your user pool
  client_id: "5nancv3bnmdpacbpilf54mj85", // your App Client ID
  redirect_uri: "https://main.d1yv3ay871rrrx.amplifyapp.com/",
  response_type: "code",
  scope: "openid email profile",
};

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
