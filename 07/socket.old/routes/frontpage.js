exports.get = async function(ctx, next) {
  //console.log(ctx.isAuthenticated(), ctx.user);

  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('welcome');
  } else {
    ctx.body = ctx.render('login');
  }

};

