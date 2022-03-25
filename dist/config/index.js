"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var baseConfig = {
  jwt: "secretjwtkey",
  dbUrl: "mongodb://localhost:27017/exam-react-auth"
};
var _default = baseConfig;
exports.default = _default;