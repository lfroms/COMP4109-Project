import { useAuthenticatedFetch } from "hooks";

interface RegistrationParams {
  name: string;
  username: string;
  password: string;
  publicKey: string;
}

export default function useRegistration() {
  const authenticatedFetch = useAuthenticatedFetch();

  async function register(options: RegistrationParams) {
    const body: API.RegistrationRequestBody = { ...options };

    const response = await authenticatedFetch<API.UserResponse>('/api/register', 'POST', JSON.stringify(body));

    return response;
  }

  return register;
}
