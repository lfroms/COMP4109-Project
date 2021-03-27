interface RegistrationParams {
  name: string;
  username: string;
  password: string;
  publicKey: string;
}

type Response = API.JSONResponse<API.UserResponse>;

export default function useRegistration() {
  async function register(options: RegistrationParams) {
    const body: API.RegistrationRequestBody = { ...options };

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return (await response.json()) as Response;
  }

  return register;
}
