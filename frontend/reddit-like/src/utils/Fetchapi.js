export async function fetchPosts() {
    const url = "http://localhost:1337/api/posts?populate[0]=author&populate[1]=media&populate[2]=comments";
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
    console.log(data.data);
    return data.data;
}