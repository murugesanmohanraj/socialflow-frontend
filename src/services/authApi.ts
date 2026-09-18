import { apiRequest } from "./apiClient";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

type UserResponse = {
  success: boolean;
  user: AuthUser;
};

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function requestPasswordReset(input: { email: string }) {
  return apiRequest<{
    success: boolean;
    message: string;
    resetUrl?: string;
  }>("/auth/forgot-password", {
    method: "POST",
    body: input,
  });
}

export function resetPassword(input: { token: string; newPassword: string }) {
  return apiRequest<{ success: boolean; message: string }>(
    "/auth/reset-password",
    { method: "POST", body: input },
  );
}

export function loginUser(input: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function getCurrentUser() {
  return apiRequest<UserResponse>("/auth/me");
}

export function logoutUser() {
  return apiRequest<{ success: boolean; message: string }>("/auth/logout", {
    method: "POST",
  });
}

export function updateUserProfile(input: { name: string }) {
  return apiRequest<UserResponse>("/users/me", {
    method: "PATCH",
    body: input,
  });
}

export function changeUserPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  return apiRequest<{ success: boolean; message: string }>(
    "/users/me/password",
    {
      method: "PATCH",
      body: input,
    },
  );
}

export type NotificationPreferences = {
  completed: boolean;
  failed: boolean;
  disconnected: boolean;
};

type NotificationResponse = {
  success: boolean;
  notifications: NotificationPreferences;
};

export function getNotificationPreferences() {
  return apiRequest<NotificationResponse>("/users/me/notifications");
}

export function updateNotificationPreferences(
  notifications: NotificationPreferences,
) {
  return apiRequest<NotificationResponse>("/users/me/notifications", {
    method: "PATCH",
    body: notifications,
  });
}
