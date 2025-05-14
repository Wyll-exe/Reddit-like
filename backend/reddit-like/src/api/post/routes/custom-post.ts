export default {
    routes: [
        {
            method: 'GET',
            path: '/posts/:documentId',
            handler: 'api::post.post.findone',
        },
        {
            method: 'PUT',
            path: '/posts/:documentId',
            handler: 'api::post.post.modify',
        },
        {
            method: 'DELETE',
            path: '/posts/:documentId',
            handler: 'api::post.post.delete',
        },
        {
            method: 'POST',
            path: '/posts',
            handler: 'api::post.post.create',
        },
    ],
};