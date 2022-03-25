"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("regenerator-runtime/runtime.js");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Schema = _mongoose.default.Schema;
var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      // Is a function that will throw an error if we already have this email in our database
      // If it returns false then it will throw an error
      // If it returns true then it will not throw an error
      validator: function () {
        var _validator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email) {
          var count;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return User.count({
                    email: email
                  });

                case 2:
                  count = _context.sent;
                  return _context.abrupt("return", !count);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function validator(_x) {
          return _validator.apply(this, arguments);
        }

        return validator;
      }(),
      message: "Email already exist"
    }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}); // Is a hook that runs before we save the document in database

userSchema.pre("save", function (next) {
  var _this = this;

  // IsModified returns true if the password was modified, and false if it was not
  // If we want to update an existing account we don't want to run bcrypt function
  if (!this.isModified("password")) {
    return next();
  } // hash password in order to prevent storing original password in the database


  _bcrypt.default.hash(this.password, 8, function (err, hash) {
    if (err) {
      return next(err);
    }

    _this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  var passwordHash = this.password; // hashed pass

  return new Promise(function (resolve, reject) {
    _bcrypt.default.compare(password, passwordHash, function (err, same) {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

var User = _mongoose.default.model("User", userSchema);

var _default = User;
exports.default = _default;