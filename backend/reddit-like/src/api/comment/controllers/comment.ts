/**
 * comment controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
    async modify(ctx) {
        try {
          const { id: documentId } = ctx.params;
      
          const comment = await strapi.db.query('api::comment.comment').findOne({ where: { documentId }, populate: ['author', 'comments'] });
          if (!comment) {
            return ctx.notFound("Comment non trouvé");
          }
      
          if (!comment.author || comment.author.id !== ctx.state.user.id) {
            return ctx.unauthorized("Vous n’êtes pas l’auteur de ce comment");
          }
      
          const updated = await strapi.entityService.update(
            'api::comment.comment',
            comment.id,
            {
              data: {
                ...ctx.request.body,
                publishedAt: new Date().toISOString(),
              },
            }
          );
      
          return ctx.send({ data: updated });
        } catch (error) {
          ctx.status = 500;
          return ctx.send({ error: error.message });
        }
      },
    async delete(ctx) {
      try {
        const { id: documentId } = ctx.params;
    
        const comment = await strapi.db.query('api::comment.comment').findOne({ where: { documentId }, populate: ['author', 'comments'] });
    
        if (!comment) {
          return ctx.notFound("Comment non trouvé");
        }
    
        const deleted = await strapi.entityService.delete('api::comment.comment', comment.id);
    
        return ctx.send({ data: deleted });
      } catch (error) {
        ctx.status = 500;
        return ctx.send({ error: error.message });
      }
    },  
    async create(ctx) {
      try {
        const { Description, User, Profile_picture, Share, Reward, Answer, Up_vote, Down_vote, Share_text, Answer_text, Reward_text, post } = ctx.request.body.data;
    
        const created = await strapi.entityService.create('api::comment.comment', {
          data: {
            Description,
            User,
            Profile_picture,
            Share,
            Reward,
            Answer,
            Up_vote,
            Down_vote,
            Share_text,
            Answer_text,
            Reward_text,
            author: ctx.state.user.id,
            comments: post,
            publishedAt: new Date().toISOString(),
          },
          populate: ['author', 'comments'],
        });
    
        if (!created) {
          return ctx.notFound("Problème lors de la création du comment");
        }
        return ctx.send({ data: created });
      } catch (error) {
        ctx.status = 500;
        return ctx.send({ error: error.message });
      }
    },
    async findone(ctx) {
      try {
        const { id: documentId } = ctx.params;
    
          const post = await strapi.db
    .query('api::comment.comment')
    .findOne({
      where: { documentId },
      populate: ['author', 'comments'],
    })
        if (!post) {
          return ctx.notFound('Comment non trouvé');
        }
        return ctx.send(post)
      } catch (error) {
        ctx.status = 500;
        return ctx.send({ error: error.message });
      }
    }
}));