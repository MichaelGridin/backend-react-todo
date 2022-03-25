import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      // Is a function that will throw an error if we already have this email in our database
      // If it returns false then it will throw an error
      // If it returns true then it will not throw an error
      validator: async function (email) {
        const count = await User.count({ email: email });
        return !count;
      },
      message: "Email already exist",
    },
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// Is a hook that runs before we save the document in database
userSchema.pre("save", function (next) {
  // IsModified returns true if the password was modified, and false if it was not
  // If we want to update an existing account we don't want to run bcrypt function
  if (!this.isModified("password")) {
    return next();
  }

  // hash password in order to prevent storing original password in the database
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password; // hashed pass
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

const User = mongoose.model("User", userSchema);
export default User;
