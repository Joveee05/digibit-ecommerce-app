const mongoose = require('mongoose');
exports.validateId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error('Invalid MongoDb Id');
};
