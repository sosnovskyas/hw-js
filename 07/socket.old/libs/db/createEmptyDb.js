const mongoose = require('mongoose');
const log = require('log')();
const co = require('co');
const thunkify = require('thunkify');

module.exports = async function() {

  const db;

  if (mongoose.connection.readyState == 1) { // connected
    db = mongoose.connection.db;
  } else {
    db = await thunkify(mongoose.connection.on)('open');
  }

  await clearDatabase(db);

  await ensureIndexes();

  await ensureCapped();

};

function *clearDatabase(db) {

  const collections = await new Promise(function(resolve, reject) {
    db.listCollections().toArray(function(err, items) {
      if (err) return reject(err);
      resolve(items);
    });
  });

  const collectionNames = collections
    .map(function(collection) {
      //console.log(collection.name);
      //const collectionName = collection.name.slice(db.databaseName.length + 1);
      if (collection.name.indexOf('system.') === 0) {
        return null;
      }
      return collection.name;
    })
    .filter(Boolean);

  await collectionNames.map(function(name) {
    return thunkify(db.dropCollection)(name);
  });

}



// wait till indexes are complete, especially unique
// required to throw errors
function *ensureIndexes(db) {

  await mongoose.modelNames().map(function(modelName) {
    const model = mongoose.models[modelName];
    return thunkify(model.ensureIndexes.bind(model))();
  });

}


// ensure that capped collections are actually capped
function *ensureCapped(db) {

  await mongoose.modelNames().map(function(modelName) {
    const model = mongoose.models[modelName];
    const schema = model.schema;
    if (!schema.options.capped) return;

    return thunkify(db.command)({convertToCapped: model.collection.name, size: schema.options.capped});
  });
}

