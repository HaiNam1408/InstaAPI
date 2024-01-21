const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

module.exports = userController = {
  getAllUser: asyncHandler(async (req, res) => {
    const response = await User.find({});
    res.status(200).json(response);
  }),

  getUserById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      success: user ? true : false,
      response: user ? user : "Something went wrong!",
    });
  }),

  getCurrentUser: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await User.findOne({ _id: _id }).select("-password");
    return res.status(200).json({
      response: response ? response : "Something went wrong!",
    });
  }),

  register: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing inputs!",
      });
    }

    const user = await User.findOne({ email });
    if (user)
      return res.json({
        success: false,
        message: "User has existed!",
      });
    else {
      const salt = await new bcrypt.genSalt(10);
      const hashed = await new bcrypt.hash(password, salt);
      req.body.password = hashed;
      const newUser = await User.create(req.body);
      return res.status(200).json({
        success: newUser ? true : false,
        message: newUser
          ? "Register is successfully!"
          : "Something went wrong!",
      });
    }
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing inputs!",
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User hasn't existed!",
      });
    else if (user.isBlocked)
      return res.status(400).json({
        success: false,
        message: "Unable to access this account!",
      });
    else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const { password, isAdmin, ...userData } = user.toObject();

        const accessToken = generateAccessToken(user._id, isAdmin);
        const refreshToken = generateRefreshToken(user._id);

        await User.findByIdAndUpdate(
          user._id,
          { refreshToken: refreshToken },
          { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 5 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          success: true,
          message: "Login successfully!",
          accessToken: accessToken,
          response: userData,
        });
      } else
        return res.status(400).json({
          success: false,
          message: "Wrong password!",
        });
    }
  }),

  logout: asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken) throw new Error("You haven't login!");
    await User.findOneAndUpdate(
      { refreshToken: cookie.refreshToken },
      { refreshToken: "" }
    );
    res.clearCookie("refreshToken", { httpOnly: true });
    return res.status(200).json({
      success: true,
      message: "Logout is done!",
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (_id) {
      const user = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
      }).select("-password -isAdmin -isBlocked");
      return res.status(200).json({
        success: user ? true : false,
        message: user ? "Update successfully!" : "Something went wrong!",
        response: user ? user : "User not found",
      });
    } else
      return res.status(401).json({
        success: false,
        message:
          "Update successfullyUser needs to be authenticated to perform this function!",
      });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id, { new: true });
    return res.status(200).json({
      success: user ? true : false,
      message: user ? "Delete user successfully!" : "Something went wrong!",
    });
  }),

  refreshAccessToken: asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken)
      throw new Error("No refreshToken in cookie!");
    const response = await jwt.verify(
      cookie.refreshToken,
      process.env.JWT_SECRET_KEY
    );
    const user = await User.findOne({
      id: response.id,
      refreshToken: cookie.refreshToken,
    });
    return res.status(200).json({
      success: user ? true : false,
      newAccessToken: user
        ? generateAccessToken(user.id)
        : "Refresh token not match!",
    });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error("Missing email");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetToken = user.createPasswordChangedToken();
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.
        Link này sẽ hết hạn sau 5 phút kể từ bây giờ. <a href=${process.env.URL_DEPLOY}/resetpassword/${resetToken}>Click here</a>`;

    const data = {
      email,
      html,
    };
    res.cookie("passwordResetToken", resetToken, {
      maxAge: 5 * 60 * 1000,
    });
    const rs = await sendMail(data);
    return res.status(200).json({
      success: true,
      token: resetToken,
      rs,
    });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error("Missing inputs");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken,
      passwordTokenExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalid reset token");
    const salt = await new bcrypt.genSalt(10);
    const hashed = await new bcrypt.hash(password, salt);
    user.password = hashed;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordTokenExpires = undefined;
    await user.save();
    return res.status(200).json({
      success: user ? true : false,
      mes: user ? "Updated password" : "Something went wrong",
    });
  }),
};
