
module.exports = function *flash(next) {
  ctx.flash = ctx.session.flash || {};

  ctx.session.flash = {};

  Object.defineProperty(ctx, 'newFlash', {
    get: function() {
      return ctx.session.flash;
    },
    set: function(val) {
      ctx.session.flash = val;
    }
  });

  await *next;

  // now ctx.session can be null
  // (logout does that)

  if (ctx.session && Object.keys(ctx.session.flash).length === 0) {
    // don't write empty flash
    delete ctx.session.flash;
  }

  if (ctx.status == 302 && ctx.session && !ctx.session.flash) {
    // pass on the flash over a redirect
    ctx.session.flash = ctx.flash;
  }
};
