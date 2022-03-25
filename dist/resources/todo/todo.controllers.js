"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.array.find.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

var _todo = _interopRequireDefault(require("./todo.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createTodo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var todo, newTodo;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.body.description) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              message: "Missing fields"
            }));

          case 2:
            console.log(req.user);
            todo = {
              description: req.body.description,
              urgent: Boolean(req.body.urgent),
              createdBy: req.user._id
            };
            _context.prev = 4;
            _context.next = 7;
            return _todo.default.create(todo);

          case 7:
            newTodo = _context.sent;
            return _context.abrupt("return", res.status(201).send({
              newTodo: newTodo
            }));

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](4);
            return _context.abrupt("return", res.status(401).send({
              error: _context.t0.message
            }));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11]]);
  }));

  return function createTodo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getTodos = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var todos;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _todo.default.find({
              createdBy: req.user._id
            });

          case 3:
            todos = _context2.sent;
            return _context2.abrupt("return", res.status(201).send({
              todos: todos
            }));

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", res.status(401).send({
              error: _context2.t0.message
            }));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function getTodos(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var deleteTodo = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var deletedTodo;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _todo.default.findOneAndDelete({
              _id: req.params.id
            });

          case 3:
            deletedTodo = _context3.sent;
            return _context3.abrupt("return", res.status(201).send({
              deletedTodo: deletedTodo
            }));

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", res.status(401).send({
              error: _context3.t0.message
            }));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function deleteTodo(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var updateTodo = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var updatedTodo;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (req.body.description) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return", res.status(401).send({
              message: "Missing fields"
            }));

          case 2:
            _context4.prev = 2;
            _context4.next = 5;
            return _todo.default.findOneAndUpdate({
              _id: req.params.id
            }, {
              description: req.body.description,
              urgent: Boolean(req.body.urgent)
            }, {
              new: true
            });

          case 5:
            updatedTodo = _context4.sent;
            return _context4.abrupt("return", res.status(201).send({
              updatedTodo: updatedTodo
            }));

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            return _context4.abrupt("return", res.status(401).send({
              error: _context4.t0.message
            }));

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function updateTodo(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var todoControllers = {
  createTodo: createTodo,
  getTodos: getTodos,
  deleteTodo: deleteTodo,
  updateTodo: updateTodo
};
var _default = todoControllers;
exports.default = _default;