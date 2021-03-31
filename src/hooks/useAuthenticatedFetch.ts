import { useRouter } from 'next/router';
import useUserSession from './useUserSession';

export default function useAuthenticatedFetch() {
  const router = useRouter();
  const { user } = useUserSession();

  async function authenticatedFetch<ResponseType>(url: string, method: string, body?: string) {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : undefined),
      },
      body,
    });

    const jsonResponse = (await response.json()) as API.JSONResponse<ResponseType>;

    if (user && jsonResponse.error?.code === 401) {
      router.replace('/logout');
    }

    return jsonResponse;
  }

  return authenticatedFetch;
}
