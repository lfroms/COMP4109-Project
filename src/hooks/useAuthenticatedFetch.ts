import useUserSession from "./useUserSession";

export default function useAuthenticatedFetch() {
  const { token, signOut } = useUserSession();

  async function authenticatedFetch<ResponseType>(url: string, method: string, body?: string) {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : undefined)
      },
      body,
    });

    const jsonResponse = (await response.json()) as API.JSONResponse<ResponseType>;

    if (jsonResponse.error?.code === 401) {
      signOut();
    }

    return jsonResponse
  }

  return authenticatedFetch;
}
