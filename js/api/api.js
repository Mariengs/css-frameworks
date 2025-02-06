export const BASE_URL = "https://v2.api.noroff.dev/";
export const LOGIN_URL = "https://v2.api.noroff.dev/auth/login";
export const REGISTER_URL = "https://v2.api.noroff.dev/auth/register";

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export const API_KEY = "4ef40ccb-ba34-4dad-8890-adefd4af57e8";
