
const passport = require('koa-passport');


exports.post = async function(ctx, next) {
  const ctx = ctx;

  // only callback-form of authenticate allows to assign ctx.body=info if 401
  await passport.authenticate('local', async function(err, user, info) {
    if (err) throw err;
    if (user === false) {
      ctx.status = 401;
      ctx.newFlash.error = "Bad credentials.";
    } else {
      await ctx.login(user);
    }
    ctx.redirect('/');
  }).call(ctx, next);

};
