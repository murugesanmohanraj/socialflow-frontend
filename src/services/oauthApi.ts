import { apiRequest } from "./apiClient";

export async function getYouTubeAuthorizationUrl() {
  const response = await apiRequest<{
    success: boolean;
    authorizationUrl: string;
  }>("/oauth/youtube/start");
  return response.authorizationUrl;
}

export async function getTikTokAuthorizationUrl() {
  const response = await apiRequest<{
    success: boolean;
    authorizationUrl: string;
  }>("/oauth/tiktok/start");
  return response.authorizationUrl;
}

export async function getFacebookAuthorizationUrl() {
  const response = await apiRequest<{
    success: boolean;
    authorizationUrl: string;
  }>("/oauth/facebook/start");
  return response.authorizationUrl;
}
