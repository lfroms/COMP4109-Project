export default function useFetchUsers() {
  async function fetchUsers(userIds: number[]) {
    const response = await fetch(`/api/users?ids=${userIds.join(',')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jsonResponse = (await response.json()) as API.JSONResponse<API.UsersResponse>;

    if (!jsonResponse.data?.users) {
      return;
    }

    return jsonResponse.data.users;
  }

  return fetchUsers;
}
