import User from "../models/User.js";
import Group from "../models/Group.js";
import Quiz from "../models/Quiz.js";

// Assign quizAdmin as User or Group
// Public quiz can be created by any user
// Private quiz can be created by only a group admin
export const assignQuizAdmin = async (req, res, next) => {
  const { quizAdmin } = req.body;

  if (!quizAdmin) {
    return res
      .status(400)
      .json({ success: false, message: "Quiz Admin is required" });
  }

  const userId = req.user._id;
  try {
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
          req.group = grpAdmin;
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
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Validate quizAdmin
// Only quizAdmin can modify the quiz
export const validateQuizAdmin = async (req, res, next) => {
  const { quizId } = req.params;

  // Validate the request parameters
  if (!quizId) {
    return res
      .status(400)
      .json({ success: false, message: "Quiz ID is required" });
  }

  try {
    const quiz = await Quiz.findById(quizId);

    // Validate the quiz
    if (!quiz) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz doesn't exist" });
    }

    const quizType = quiz.quizType;

    // If the quizType is Public, then the quizAdminType should be User
    if (quizType === "Public") {
      if (quiz.quizAdmin.toString() === req.user._id.toString()) {
        req.userType = "Admin";
        return next();
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Request" });
      }
    }

    // If the quizType is Private, then the quizAdminType is Group
    // Validate whether the User is the admin of the group or a member of the group
    if (quizType === "Private") {
      const group = await Group.findById(quiz.quizAdmin);

      // group admin
      if (group.groupAdmin.toString() === req.user._id.toString()) {
        req.userType = "Admin";
        return next();
      } else {
        // group member
        if (group.groupMembers.includes(req.user._id.toString())) {
          req.userType = "Member";
          return next();
        } else {
          // neither group admin nor group member
          return res
            .status(400)
            .json({ success: false, message: "Invalid Request" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
