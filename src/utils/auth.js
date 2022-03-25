import User from "../resources/user/user.model";
import jwt from "jsonwebtoken";
import baseConfig from "../config/index";
import Todo from "../resources/todo/todo.model";

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(401).send({ message: "Missing fields" });
  }
  const user = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  };
  try {
    const newUser = await User.create(user);
    return res.status(201).send({ newUser });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

function newToken(user) {
  return jwt.sign({ id: user.id }, baseConfig.jwt, { expiresIn: "1d" });
}

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, baseConfig.jwt, (err, payload) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(payload);
    });
  });

const checkToken = async (req, res) => {
  if (!req.cookies.token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = req.cookies.token.split("Bearer ")[1];
  try {
    const payload = await verifyToken(token);
    const user = await User.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    return res.status(201).send({ user });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "Missing fields" });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }
  try {
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const token = newToken(user);
    res.cookie("token", "Bearer " + token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      httpOnly: true,
    });
    return res.status(201).send({ user });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(201).send({ token: null });
};

const protect = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = req.cookies.token.split("Bearer ")[1];
  try {
    const payload = await verifyToken(token);
    const user = await User.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

const controllers = {
  signup,
  signin,
  checkToken,
  logout,
  protect,
};

export default controllers;
