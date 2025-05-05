/**
 * post controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;
        
        if(!user) {
            return ctx.unauthorized("hop hop hop pas la permission de créer un post, chien")
        }

        ctx.request.body.data.author = user.id

        const response = await super.create(ctx);

        return response;
    },

    async delete(ctx) {
        const user = ctx.state.user;
        const post = ctx.request.body.data.author

        if (!user.id === post) {
            return ctx.unauthorized("Yo t'as pas le droit de supprimer ça, chien");
        }

        const response = await super.delete(ctx);

        return response;
    }
}));
