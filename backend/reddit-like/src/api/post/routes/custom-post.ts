export default {
    routes : [
        {
            method: 'GET',
            path: '/posts/modify',
            handler: 'api::post.post.modify',
            config: {
                auth: false,
            }
        },
    ]
}