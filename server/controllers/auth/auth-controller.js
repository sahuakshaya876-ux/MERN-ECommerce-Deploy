
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

/* =========================
   AUTH MIDDLEWARE
========================= */
const authMiddleware = (req, res, next) => {
  try {
    // token stored in httpOnly cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user! No token provided",
      });
    }

    // verify token
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");

    // attach user to request
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
      userName: decoded.userName,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user! Invalid or expired token",
    });
  }
};

/* =========================
   REGISTER
========================= */
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists! Please login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (e) {
    console.log("REGISTER ERROR:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

/* =========================
   LOGIN
========================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    const token = jwt.sign(
      {
        _id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "120m" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // true in production (HTTPS)
        sameSite: "lax",
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: checkUser._id,
          _id: checkUser._id,
          email: checkUser.email,
          role: checkUser.role,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log("LOGIN ERROR:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

/* =========================
   LOGOUT
========================= */
const logoutUser = (req, res) => {
  return res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

/* =========================
   EXPORTS
========================= */
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};
