export async function createPost(postContent, postTitle) {
    const url = "http://localhost:1337/api/posts";
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                title: postTitle,
                description: postContent,
            }
        }),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la création du post");
    }

    const data = await response.json();
    return data.data;
}