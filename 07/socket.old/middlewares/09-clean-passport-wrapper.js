module.exports = async function cleanEmptySessionPassport(next) {
  await next();
  if (ctx.session && ctx.session.passport && Object.keys(ctx.session.passport).length === 0) {
    delete ctx.session.passport;
  }
};
