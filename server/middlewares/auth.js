import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "You must be logged in" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "You must be logged in" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

export default auth;
