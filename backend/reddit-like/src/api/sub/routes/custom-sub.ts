export default {
    routes : [
        {
            method: 'PUT',
            path: '/subs/:id',
            handler: 'api::sub.sub.modify',
            config: {
                auth: false,
            }
        },
        {
            method: 'DELETE',
            path: 'subs/:id',
            handler: 'api::sub.sub.delete',
            config: {
                auth: false,
            }
        }
    ]
}