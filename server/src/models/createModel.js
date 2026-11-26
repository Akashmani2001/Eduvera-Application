const mongoose = require('mongoose');
const { isMongoose } = require('../config/db');
const { getCollection } = require('../config/localDb');

function createModel(name, schemaDefinition, indexes = []) {
  let MongooseModel;
  try {
    const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
    indexes.forEach(idx => schema.index(idx));
    MongooseModel = mongoose.models[name] || mongoose.model(name, schema);
  } catch (err) {
    // Fallback if mongoose compilation encounters an issue
  }

  const localColl = getCollection(name.toLowerCase() + 's');

  return {
    async find(filter = {}) {
      if (isMongoose() && MongooseModel) {
        return MongooseModel.find(filter).lean();
      }
      return localColl.find(filter);
    },

    async findOne(filter = {}) {
      if (isMongoose() && MongooseModel) {
        return MongooseModel.findOne(filter).lean();
      }
      return localColl.findOne(filter);
    },

    async findById(id) {
      if (isMongoose() && MongooseModel) {
        return MongooseModel.findById(id).lean();
      }
      return localColl.findById(id);
    },

    async create(data) {
      if (isMongoose() && MongooseModel) {
        const doc = await MongooseModel.create(data);
        return doc.toObject();
      }
      return localColl.create(data);
    },

    async findByIdAndUpdate(id, updates, options = { new: true }) {
      if (isMongoose() && MongooseModel) {
        return MongooseModel.findByIdAndUpdate(id, updates, options).lean();
      }
      return localColl.findByIdAndUpdate(id, updates, options);
    },

    async findByIdAndDelete(id) {
      if (isMongoose() && MongooseModel) {
        return MongooseModel.findByIdAndDelete(id).lean();
      }
      return localColl.findByIdAndDelete(id);
    },

    async deleteMany(filter = {}) {
      if (isMongoose() && MongooseModel) {
        return MongooseModel.deleteMany(filter);
      }
      return localColl.deleteMany(filter);
    },

    async countDocuments(filter = {}) {
      if (isMongoose() && MongooseModel) {
        return MongooseModel.countDocuments(filter);
      }
      return localColl.countDocuments(filter);
    },

    getMongooseModel() {
      return MongooseModel;
    }
  };
}

module.exports = createModel;
