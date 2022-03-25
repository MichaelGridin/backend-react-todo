"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

var _user = _interopRequireDefault(require("../resources/user/user.model"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = _interopRequireDefault(require("../config/index"));

var _todo = _interopRequireDefault(require("../resources/todo/todo.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var signup = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var user, newUser;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!req.body.email || !req.body.password || !req.body.name)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              message: "Missing fields"
            }));

          case 2:
            user = {
              email: req.body.email,
              password: req.body.password,
              name: req.body.name
            };
            _context.prev = 3;
            _context.next = 6;
            return _user.default.create(user);

          case 6:
            newUser = _context.sent;
            return _context.abrupt("return", res.status(201).send({
              newUser: newUser
            }));

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", res.status(401).send({
              error: _context.t0.message
            }));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 10]]);
  }));

  return function signup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function newToken(user) {
  return _jsonwebtoken.default.sign({
    id: user.id
  }, _index.default.jwt, {
    expiresIn: "1d"
  });
}

var verifyToken = function verifyToken(token) {
  return new Promise(function (resolve, reject) {
    _jsonwebtoken.default.verify(token, _index.default.jwt, function (err, payload) {
      if (err) {
        reject(err);
        return;
      }

      resolve(payload);
    });
  });
};

var checkToken = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var token, payload, user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.cookies.token) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", res.status(401).send({
              message: "Unauthorized access"
            }));

          case 2:
            token = req.cookies.token.split("Bearer ")[1];
            _context2.prev = 3;
            _context2.next = 6;
            return verifyToken(token);

          case 6:
            payload = _context2.sent;
            _context2.next = 9;
            return _user.default.findById(payload.id).select("-password").lean().exec();

          case 9:
            user = _context2.sent;
            return _context2.abrupt("return", res.status(201).send({
              user: user
            }));

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", res.status(401).send({
              error: _context2.t0.message
            }));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 13]]);
  }));

  return function checkToken(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var signin = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var user, match, token;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(!req.body.email || !req.body.password)) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return", res.status(400).send({
              message: "Missing fields"
            }));

          case 2:
            _context3.next = 4;
            return _user.default.findOne({
              email: req.body.email
            });

          case 4:
            user = _context3.sent;

            if (user) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", res.status(401).send({
              message: "Invalid credentials"
            }));

          case 7:
            _context3.prev = 7;
            _context3.next = 10;
            return user.checkPassword(req.body.password);

          case 10:
            match = _context3.sent;

            if (match) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", res.status(401).send({
              message: "Invalid credentials"
            }));

          case 13:
            token = newToken(user);
            res.cookie("token", "Bearer " + token, {
              expires: new Date(Date.now() + 8 * 3600000),
              // cookie will be removed after 8 hours
              httpOnly: true
            });
            return _context3.abrupt("return", res.status(201).send({
              user: user
            }));

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](7);
            return _context3.abrupt("return", res.status(401).send({
              error: _context3.t0.message
            }));

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[7, 18]]);
  }));

  return function signin(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var logout = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            res.clearCookie("token");
            res.status(201).send({
              token: null
            });

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function logout(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var protect = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var token, payload, user;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (req.cookies.token) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt("return", res.status(401).send({
              message: "Unauthorized access"
            }));

          case 2:
            token = req.cookies.token.split("Bearer ")[1];
            _context5.prev = 3;
            _context5.next = 6;
            return verifyToken(token);

          case 6:
            payload = _context5.sent;
            _context5.next = 9;
            return _user.default.findById(payload.id).select("-password").lean().exec();

          case 9:
            user = _context5.sent;
            req.user = user;
            next();
            _context5.next = 17;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", res.status(401).send({
              error: _context5.t0.message
            }));

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 14]]);
  }));

  return function protect(_x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();

var controllers = {
  signup: signup,
  signin: signin,
  checkToken: checkToken,
  logout: logout,
  protect: protect
};
var _default = controllers;
exports.default = _default;