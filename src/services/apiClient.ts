const API_BASE_URL =
  process.env.REACT_APP_API_URL ?? "https://socialflow-backend-1.onrender.com/api";

export const AUTH_TOKEN_KEY = "socialflow_access_token";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent("socialflow:unauthorized"));
    }
    throw new ApiError(
      payload?.message ?? "The request could not be completed",
      response.status,
    );
  }

  return payload as T;
}
