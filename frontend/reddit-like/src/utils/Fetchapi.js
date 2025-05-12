export async function fetchPosts() {
    const url = "http://localhost:1338/api/posts?populate[0]=author&populate[1]=media";
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error("Erreur réseau");
    }

    const data = await response.json();
    return data.data;
}