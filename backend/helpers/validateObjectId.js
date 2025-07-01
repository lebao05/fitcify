const mongoose = require("mongoose");

const validObjectId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("ObjectId isn't valid");
};

module.exports = { validObjectId };