// Service to search users by keyword
export async function searchUsers(keyword) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/v1/users/search?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    );
    if (!response.ok) throw new Error('Failed to search users');
    const data = await response.json();
    return data.data || [];
}
