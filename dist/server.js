"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("regenerator-runtime/runtime.js");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _db = _interopRequireDefault(require("./utils/db"));

var _auth = _interopRequireDefault(require("./utils/auth"));

var _todo = _interopRequireDefault(require("./resources/todo/todo.controllers"));

var _todo2 = _interopRequireDefault(require("./resources/todo/todo.router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var signin = _auth.default.signin,
    signup = _auth.default.signup,
    checkToken = _auth.default.checkToken,
    logout = _auth.default.logout,
    protect = _auth.default.protect;
var createTodo = _todo.default.createTodo;
var app = (0, _express.default)();
app.use((0, _cors.default)({
  origin: "http://localhost:1234",
  credentials: true
}));
app.use((0, _bodyParser.json)());
app.use((0, _morgan.default)("dev"));
app.use((0, _cookieParser.default)());
app.post("/signin", signin);
app.post("/signup", signup);
app.get("/token", checkToken);
app.post("/logout", logout);
app.use("/todos", protect, _todo2.default);

var start = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _db.default)();

          case 2:
            app.listen(3000, function () {
              console.log("Server on port 3000");
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function start() {
    return _ref.apply(this, arguments);
  };
}();

var _default = start;
exports.default = _default;