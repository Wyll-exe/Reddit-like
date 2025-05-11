/**
 * sub controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::sub.sub', ({ strapi }) => ({
  async modify(ctx) {
    try {
      const { id: documentId } = ctx.params;
  
      const sub = await strapi.db.query('api::sub.sub').findOne({ where: { documentId }, populate: ['author'] });
      if (!sub) {
        return ctx.notFound('Sub non trouvé');
      }
  
      if (!sub.author || sub.author.id !== ctx.state.user.id) {
        return ctx.unauthorized("Vous n’êtes pas l’auteur de ce sub");
      }
  
      const updated = await strapi.entityService.update(
        'api::sub.sub',
        sub.id,
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
  
      const sub = await strapi.db.query('api::sub.sub').findOne({ where: { documentId }, populate: ['author'] });
  
      if (!sub) {
        return ctx.notFound('Sub non trouvé');
      }
  
      if (!sub.author || sub.author.id !== ctx.state.user.id) {
        return ctx.unauthorized("Vous n’êtes pas l’auteur de ce sub");
      }
  
      const deleted = await strapi.entityService.delete('api::sub.sub', sub.id);
  
      return ctx.send({ data: deleted });
    } catch (error) {
      ctx.status = 500;
      return ctx.send({ error: error.message });
    }
  },  
  async create(ctx) {
    try {
   
      const { Name, Description, Banner } = ctx.request.body;
  
      const created = await strapi.entityService.create('api::sub.sub', {
        data: {
          Name,
          Description,
          Banner,
          author: ctx.state.user.id,
          publishedAt: new Date().toISOString(),
        },
        populate: ['author'],
      });
  
      if (!created) {
        return ctx.notFound('Problème lors de la création du sub');
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
      .query('api::sub.sub')
      .findOne({
        where: { documentId },
        populate: ['author'],
      })
          if (!post) {
            return ctx.notFound('Sub non trouvé');
          }
          return ctx.send(post)
        } catch (error) {
          ctx.status = 500;
          return ctx.send({ error: error.message });
        }
      },
}));
