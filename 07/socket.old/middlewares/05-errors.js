

module.exports = async function(ctx, next) {

  try {
    await next();
  } catch (e) {
    if (e.status) {
      // could use template methods to render error page
      ctx.body = e.message;
      ctx.statusCode = e.status;
    } else {
      ctx.body = "Error 500";
      ctx.statusCode = 500;
      console.error(e.message, e.stack);
    }

  }
};
