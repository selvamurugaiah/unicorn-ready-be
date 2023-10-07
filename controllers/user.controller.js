import { Users } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sessions } from "../models/session.model.js";
import nodemailer from "nodemailer";

const createUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  await bcrypt.hash(password, 10, async (err, hashedPassword) => {
    try {
      const userData = { email, password: hashedPassword };
      const user = new Users(userData);
      const token = jwt.sign(
        { _id: user._id + Date.now() },
        process.env.SECRET
      );
      const sessionData = new Sessions({ userId: user._id, token });
      await user.save();
      await sessionData.save();
      res.status(201).send(sessionData);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "User already exists" });
    }
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email: email });
  if (!user) return res.status(400).send({ message: "Invalid Credentials" });
  bcrypt.compare(password, user.password, async (err, result) => {
    if (!result) res.status(401).send({ message: "Invalid Credentials" }); // NOTE: For not found user, use status code 401
    if (result) {
      const token = jwt.sign({ _id: user.id + Date.now() }, process.env.SECRET);
      const sessionData = new Sessions({ userId: user._id, token });
      await user.save();
      await sessionData.save();
      res.status(200).send(sessionData);
    }
  });
};

const authUser = async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await Users.findById(userId);

    if (!user) return res.status(403).send({ message: "Please SignUp" });
    else {
      return res.status(200).send({ isAdmin: user.isAdmin });
    }
  } catch (error) {
    return res.status(400).send(err);
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const expireToken = await Sessions.findOneAndUpdate(
      { token },
      { expired: true },
      { new: true }
    );
    await expireToken.save();
    return res.status(200).send({ message: "Logged Out Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error" });
  }
};

const changePassword = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  console.log(req.body);
  try {
    await bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const user = await Users.findByIdAndUpdate(id, {
        password: hashedPassword,
      });
      console.log(user);
      const token = jwt.sign(
        { _id: user._id + Date.now() },
        process.env.SECRET
      );
      const sessionData = new Sessions({ userId: user._id, token });
      await user.save();
      await sessionData.save();
      res.status(200).send(sessionData);
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

async function nodeMailer(email, token) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.EMAIL_TEST,
      pass: process.env.EMAIL_TEST_APP_PSWD,
    },
  });
  let info = await transporter.sendMail({
    from: '"Selvam m 👻" <mselvajune@gmail.com>', // sender address
    to: `${email}, mselvajune@gmail.com`, // list of receivers
    subject: "Change Password Request", // Subject line
    text: `Copy and Paste this link in browser - ${token}`, // plain text body
    html: `<b>Copy and Paste this link in browser within 10mins - <mark>${token}</mark></b>`, // html body
  });
  console.log("Message sent: %s", info.messageId);
}

const forgetPassword = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    console.log(user);
    if (!user) return res.status(403).send({ message: "User not found" });
    const token = jwt.sign(
      { _id: user._id, email: email },
      process.env.SECRET,
      {
        expiresIn: "10m",
      }
    );
    console.log(token);
    await nodeMailer(email, token);
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const tokenVerification = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log(decodedToken);
    res.status(200).send({ message: "Verified" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
export {
  loginUser,
  createUser,
  authUser,
  logoutUser,
  changePassword,
  forgetPassword,
  tokenVerification,
};
