/**
 * sub controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::sub.sub', ({ strapi }) => ({
  async modify(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;

      const updated = await strapi.entityService.update(
        'api::sub.sub',
        id,
        {
            data: {
              ...data,
              publishedAt: new Date().toISOString(),
            },
          }
      );


      if (!updated) {
        return ctx.notFound('Sub non trouvé');
      }

      return ctx.send({ data: updated });
    } catch (error) {
      ctx.status = 500;
      return ctx.send({ error: error.message });
    }
  },
  async delete(ctx) {
    try {
        const { id } = ctx.params;
  
        const deleted = await strapi.entityService.delete(
          'api::sub.sub',
          id
        );
  
  
        if (!deleted) {
          return ctx.notFound('Sub non trouvé');
        }
  
        return ctx.send({ data: deleted });
      } catch (error) {
        ctx.status = 500;
        return ctx.send({ error: error.message });
      }
  }
}));
