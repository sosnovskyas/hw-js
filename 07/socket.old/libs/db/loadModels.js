const mongoose = require('mongoose');
const co = require('co');
const thunkify = require('thunkify');

// tried using pow-mongoose-fixtures,
// but it fails with capped collections, it calls remove() on them => everything dies
// so rolling my own tiny-loader
module.exports = async function(data) {
  const modelsData = (typeof data == 'string') ? require(data) : data;

  for(const modelName in modelsData) {
    const Model = mongoose.models[modelName];
    await Model.remove({});
    await loadModel(Model, modelsData[modelName]);
  }
};

// load data into the DB, replace if _id is the same
function *loadModel(Model, data) {

  for (const i = 0; i < data.length; i++) {
    await Model.create(data[i]);
  }

}

