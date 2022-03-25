"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _todo = _interopRequireDefault(require("./todo.controllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");

var router = express.Router();
var createTodo = _todo.default.createTodo,
    getTodos = _todo.default.getTodos,
    deleteTodo = _todo.default.deleteTodo,
    updateTodo = _todo.default.updateTodo;
router.post("/", createTodo);
router.get("/", getTodos);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);
var _default = router;
exports.default = _default;