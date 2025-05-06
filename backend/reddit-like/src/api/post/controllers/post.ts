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
        const postId = ctx.params.id;
        const postAuthor = await strapi.entityService.findOne('api::post.post', postId, { populate: 'author' });
        
        if (user.id !== postAuthor) {
            return ctx.unauthorized("Yo t'as pas le droit de supprimer ça, chien");
        }

        const response = await super.delete(ctx);

        return response;
    }
}));
