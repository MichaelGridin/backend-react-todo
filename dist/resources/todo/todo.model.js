"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
var todoSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  urgent: {
    type: Boolean,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

var Todo = _mongoose.default.model("Todo", todoSchema);

var _default = Todo;
exports.default = _default;