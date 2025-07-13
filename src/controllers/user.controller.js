import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({ message: "user already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });
    const userSave = await newUser.save();

    const token = await createToken({ id: userSave._id });
    res.cookie("token", token);

    res.json({
      id: userSave._id,
      userName: userSave.username,
      email: userSave.email,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "user not found" });
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ massage: "password incorrect" });

    const token = await createToken({ id: userFound._id });
    res.cookie("token", token);

    res.json({
      id: userFound._id,
      userName: userFound.username,
      email: userFound.email,
      updatedAt: userFound.updatedAt,
      createdAt: userFound.createdAt,
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const { id } = req.user;
  const userFound = await User.findById(id);
  console.log(userFound);
  res.send("profile");
};

export const updateProfile = async (req, res) => {
  const { id } = req.user;
  const userFound = await User.findByIdAndUpdate(id, req.body, { new: true });
  console.log(userFound);
  res.send("profile");
};

export const deleteAccount = async (req, res) => {
  const { id } = req.user;
  const userFound = await User.findByIdAndDelete(id);
  console.log(userFound);
  res.send("profile");
};

export const tokenVerify = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "token not found" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "token not valid" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "token not valid" });

    res.json({
      id: userFound._id,
      userName: userFound.username,
      email: userFound.email,
      updatedAt: userFound.updatedAt,
      createdAt: userFound.createdAt,
    });
  });
};
