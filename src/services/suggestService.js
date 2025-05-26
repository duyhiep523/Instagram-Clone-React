export async function getSuggestedFriends(userId) {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `http://localhost:8080/api/v1/follows/suggested?userId=${userId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include' // nếu backend dùng cookie session
        }
    );
    if (!response.ok) throw new Error('Failed to fetch suggested friends');
    const data = await response.json();
    return data.data || [];
}