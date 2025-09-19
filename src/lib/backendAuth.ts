import { auth } from "@clerk/nextjs/server";

/**
 * Helper function to get authentication headers for backend API calls
 * This ensures the JWT token is properly passed to your backend service
 */
export async function getBackendAuthHeaders(): Promise<HeadersInit> {
  try {
    const { getToken } = auth();
    const token = await getToken();
    
    if (!token) {
      throw new Error("No authentication token available");
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error("Failed to get backend auth headers:", error);
    throw new Error("Authentication failed");
  }
}

/**
 * Helper function to make authenticated API calls to your backend
 */
export async function backendApiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = await getBackendAuthHeaders();
  
  return fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * Get the backend API base URL from environment variables
 */
export function getBackendApiUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL;
  
  if (!baseUrl) {
    throw new Error("Backend API URL not configured. Set NEXT_PUBLIC_BACKEND_API_URL or BACKEND_API_URL");
  }
  
  return baseUrl;
}
