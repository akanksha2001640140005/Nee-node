const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// method to compare password in db
userSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
//hook to hash password before save
userSchema.pre("save", async function (next) {
  try {
    //check if password modified
    const user = this;
    if (!user.isModified("password")) next();
    //generate salt
    const salt = await bcrypt.genSalt(10);
    //hash password
    const hashedPassword = await bcrypt.hash(this.password, salt);
    //replace hashed_Password
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
