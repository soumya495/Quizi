import Group from "../models/Group.js";
import User from "../models/User.js";

// Check whether quizAdmin is User or Group
// Public quiz can be created by any user
// Private quiz can be created by only group admin
const validateQuizAdmin = async (req, res, next) => {
  const { quizAdmin } = req.body;

  if (!quizAdmin) {
    return res
      .status(400)
      .json({ success: false, message: "Quiz Admin is required" });
  }

  const userId = req.user._id;

  // If User, check whether user exists
  const userAdmin = await User.findById(quizAdmin);
  if (userAdmin) {
    // Check request user is the admin of the quiz
    if (userAdmin._id.toString() === userId.toString()) {
      req.quizAdminType = "User";
      return next();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Request" });
    }
  } else {
    // If Group, check whether group exists
    const grpAdmin = await Group.findById(quizAdmin);
    // If group exists, check whether request user is the admin of the group
    if (grpAdmin) {
      if (grpAdmin.groupAdmin.toString() === userId.toString()) {
        req.quizAdminType = "Group";
        return next();
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Request" });
      }
    } else {
      // If neither, return error
      return res
        .status(400)
        .json({ success: false, message: "Invalid Request" });
    }
  }
};

export default validateQuizAdmin;
