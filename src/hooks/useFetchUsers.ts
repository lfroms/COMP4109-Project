import { useAuthenticatedFetch } from 'hooks';

export default function useFetchUsers() {
  const authenticatedFetch = useAuthenticatedFetch();

  async function fetchUsers(userIds: number[]) {
    const response = await authenticatedFetch<API.UsersResponse>(
      `/api/users?ids=${userIds.join(',')}`,
      'GET'
    );

    if (!response.data?.users) {
      return;
    }

    return response.data.users;
  }

  return fetchUsers;
}
