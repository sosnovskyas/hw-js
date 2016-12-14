const fs = require('fs');
const co = require('co');
const path = require('path');
const gutil = require('gulp-util');
const projectRoot = require('config').projectRoot;

const loadModels = require('../libs/db/loadModels');

module.exports = function() {

  return co(async function() {

    const args = require('yargs')
      .usage("gulp db:load --from fixture/init")
      .demand(['from'])
      .describe('from', 'file to import')
      .argv;

    const dbPath = path.join(projectRoot, args.from);

    gutil.log("loading db " + dbPath);

    await loadModels(dbPath);

    gutil.log("loaded db " + dbPath);
  });

};

