import { useAuthenticatedFetch } from 'hooks';

export default function useFetchUsers() {
  const authenticatedFetch = useAuthenticatedFetch();

  async function fetchUsers(userIds?: number[]) {
    const path = userIds ? `/api/users?ids=${userIds.join(',')}` : '/api/users';

    const response = await authenticatedFetch<API.UsersResponse>(path, 'GET');

    if (!response.data?.users) {
      return;
    }

    return response.data.users;
  }

  return fetchUsers;
}
