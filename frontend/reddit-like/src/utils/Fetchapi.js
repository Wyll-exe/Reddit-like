export async function fetchPosts() {
    const url = "http://localhost:1337/api/posts?populate[0]=comments&populate[author][populate][0]=avatar";
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
    console.log(data.data)
    return data.data;
}