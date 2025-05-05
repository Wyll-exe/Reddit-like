'use strict';

/**
 * post controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post.post', () => ({
    async modify(ctx) {
        try {
            ctx.body = 'ok hello';
            console.log("aa");
        } catch (err) {
            ctx.body = err;
            console.log("zz");
        }
    }
}));
