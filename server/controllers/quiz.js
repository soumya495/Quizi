import mongoose from "mongoose";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Create New Quiz
// route   POST /api/quiz/create
// access  Private
export const createQuiz = async (req, res) => {
  const { quizName, quizDescription, quizDuration, quizTopic, quizAdmin } =
    req.body;

  // Validate the request body
  if (
    !(
      quizName?.trim() &&
      quizDescription?.trim() &&
      typeof quizDuration === "number" &&
      quizDuration > 0 &&
      quizTopic?.trim()
    )
  ) {
    res.status(400).json({ success: false, message: "All input is required" });
  }

  if (quizDuration < 60000) {
    return res.status(400).json({
      success: false,
      message: "Quiz duration should be at least 1 minute",
    });
  }

  // from middleware
  const quizAdminType = req.quizAdminType;

  const quiz = new Quiz({
    quizAdmin,
    adminModel: quizAdminType === "User" ? "User" : "Group",
    quizName,
    quizDescription,
    quizDuration,
    quizTopic,
    quizType: quizAdminType === "User" ? "Public" : "Private",
    quizStatus: "Draft",
  });

  try {
    // Save the quiz
    await quiz.save();

    // push the quizId to the specific user/group
    if (quizAdminType === "User") {
      const user = req.user;
      user.createdQuizzes.push(quiz._id);
      await user.save();
    } else {
      const group = req.group;
      group.quizzes.push(quiz._id);
      await group.save();
    }

    // Return the created quiz
    return res
      .status(201)
      .json({ success: true, message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error In Creating Quiz ", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create quiz" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Get All Created Quizzes
// route   GET /api/quiz/created-quizzes
export const getCreatedQuizzes = async (req, res) => {
  try {
    const user = req.user;

    // Pagination options
    const page = parseInt(req.query.page) || 1; // Page number, default is 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of quizzes per page, default is 10

    // Calculate the number of documents to skip based on the page and page size
    const skip = (page - 1) * pageSize;

    // Find the user by their ID and populate the 'createdQuizzes' field with the Quiz documents
    const populatedUser = await User.findById(user._id).populate({
      path: "createdQuizzes",
      model: Quiz,
      options: {
        skip: skip,
        limit: pageSize,
        sort: { createdAt: -1 },
      },
    });

    if (!populatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the populated quizzes from the user object
    const createdQuizzes = populatedUser.createdQuizzes;

    // Get the total count of created quizzes for pagination
    const totalQuizzesCount = user.createdQuizzes.length;
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalQuizzesCount / pageSize);

    res.status(200).json({
      success: true,
      message: "Created quizzes fetched successfully",
      data: {
        quizzes: createdQuizzes,
        totalQuizzes: totalQuizzesCount,
        currentPage: page,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching created quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Get quiz details
// route   GET /api/quiz/quiz-details/:quizId
// access  Private
export const getQuizDetails = async (req, res) => {
  const { quizId } = req.params;

  // Pagination options
  const page = parseInt(req.query.page) || 1; // Page number, default is 1
  const pageSize = 10; // Number of quizzes per page, default is 10

  // Calculate the number of documents to skip based on the page and page size
  const skip = (page - 1) * pageSize;

  try {
    const quiz = await Quiz.findById(quizId);

    const populatedQuiz = await Quiz.findById(quizId)
      .populate({
        path: "quizQuestions",
        model: Question,
        options: {
          skip: skip,
          limit: pageSize,
        },
      })
      .populate("quizAdmin", "firstName lastName profilePicture");

    if (!populatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Get the total count of questions for pagination
    const totalQuestionsCount = quiz.quizQuestions.length;

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalQuestionsCount / pageSize);

    return res.status(200).json({
      success: true,
      message: "Quiz details fetched successfully",
      data: {
        quiz: populatedQuiz,
        currentPage: page,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Update Quiz
// route   PUT /api/quiz/edit/:quizId
// access  Private
export const editQuiz = async (req, res) => {
  // Only the quiz admin can update the quiz
  if (req.userType === "Member") {
    return res.status(403).json({ success: false, message: "Not Authorized" });
  }

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No fields to update" });
  }

  const { quizId } = req.params;

  const allowedFields = [
    "quizName",
    "quizDescription",
    "quizDuration",
    "quizStatus",
    "quizTopic",
  ];
  const fieldsToUpdate = {};

  if (
    req.body?.["quizDuration"] &&
    (typeof req.body?.["quizDuration"] !== "number" ||
      req.body?.["quizDuration"] < 60000)
  ) {
    return res.status(400).json({
      success: false,
      message: "Quiz duration should be at least 1 minute",
    });
  }

  // Extract only the allowed fields from the request body
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      fieldsToUpdate[key] = req.body[key];
    }
  });

  try {
    // Update the quiz with the fields from the request body
    await Quiz.updateMany({ _id: quizId }, { $set: fieldsToUpdate });

    // Return the updated quiz or success message
    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      updatedFields: fieldsToUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update quiz" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Add Question to Quiz
// route   POST /api/quiz/add-question/:quizId
// access  Private
export const addQuizQuestion = async (req, res) => {
  // Only the quiz admin can add questions to the quiz
  if (req.userType === "Member") {
    return res.status(403).json({ success: false, message: "Not Authorized" });
  }

  const { quizId } = req.params;

  let { question, questionOptions, questionPoints } = req.body;

  questionOptions = JSON.parse(questionOptions);

  // Validate the request body
  if (
    !(
      question?.trim() &&
      questionPoints > 0 &&
      questionOptions?.length >= 2 &&
      questionOptions?.length <= 5
    )
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Question" });
  }

  // Validate and add the question options
  const questOptions = [];
  let numberOfCorrectOptions = 0;

  try {
    questionOptions.forEach((questOpt) => {
      const { option, correct } = questOpt;
      if (option.trim() && typeof correct === "boolean") {
        if (correct) {
          numberOfCorrectOptions++;
        }
        questOptions.push({ option, correct });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Question" });
      }
    });

    // Validate the number of correct options
    let questType;
    if (numberOfCorrectOptions === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Question" });
    }

    // Determine the question type (Single or Multiple)
    if (numberOfCorrectOptions === 1) {
      questType = "Single Correct";
    } else {
      questType = "Multiple Correct";
    }

    const questId = new mongoose.Types.ObjectId();

    const quiz = await Quiz.findById(quizId);

    // Create the question object
    let quest = {
      __id: questId,
      quizId,
      question,
      questionType: questType,
      options: questOptions,
      points: questionPoints,
    };

    quest = new Question(quest);

    // Save the question to the database
    const savedQuestion = await quest.save();

    // Add the question to the quiz
    quiz.quizQuestions.push(savedQuestion._id);

    // Save the quiz
    await quiz.save();

    // Return the saved question
    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: savedQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add question" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Edit a particular question of a quiz
// route   PUT /api/quiz/edit-question/:quizId/:questionId
// access  Private
export const editQuizQuestion = async (req, res) => {
  // Only the quiz admin can add questions to the quiz
  if (req.userType === "Member") {
    return res.status(403).json({ success: false, message: "Not Authorized" });
  }

  // validate the request parameters
  const { quizId, questionId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);

    const question = await Question.findById(questionId);

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Question doesn't exist" });
    }

    if (!quiz.quizQuestions.includes(questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Question doesn't exist" });
    }

    const fieldsToUpdate = {};

    if (req.body?.question) {
      if (!req.body.question.trim())
        return res
          .status(400)
          .json({ success: false, message: "Invalid Question" });

      fieldsToUpdate.question = req.body.question;
    }

    if (req.body?.questionPoints) {
      if (req.body.questionPoints <= 0)
        return res
          .status(400)
          .json({ success: false, message: "Invalid Question" });

      fieldsToUpdate.points = req.body.questionPoints;
    }

    if (req.body?.questionOptions) {
      const questionOptions = JSON.parse(req.body?.questionOptions);
      if (!(questionOptions?.length >= 2 && questionOptions?.length <= 5)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Question" });
      }

      const questOptions = [];
      let numberOfCorrectOptions = 0;

      questionOptions.forEach((questOpt) => {
        const { option, correct } = questOpt;
        if (option.trim() && typeof correct === "boolean") {
          if (correct) {
            numberOfCorrectOptions++;
          }
          questOptions.push({ option, correct });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Invalid Question" });
        }
      });

      fieldsToUpdate.options = questOptions;

      // Validate the number of correct options
      if (numberOfCorrectOptions === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Question" });
      }

      // Determine the question type (Single or Multiple)
      if (numberOfCorrectOptions === 1) {
        fieldsToUpdate.questionType = "Single Correct";
      } else {
        fieldsToUpdate.questionType = "Multiple Correct";
      }
    }

    console.log("updated fields", fieldsToUpdate);

    // save the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      fieldsToUpdate,
      { new: true }
    );

    console.log("updated question", updatedQuestion);

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error in Updating Question", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update question" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Delete a particular question of a quiz
// route   DELETE /api/quiz/delete-question/:quizId/:questionId
// access  Private
export const deleteQuizQuestion = async (req, res) => {
  // Only the quiz admin can add questions to the quiz
  if (req.userType === "Member") {
    return res.status(403).json({ success: false, message: "Not Authorized" });
  }

  // validate the request parameters
  const { quizId, questionId } = req.params;
  if (!questionId) {
    return res.status(400).json({
      success: false,
      message: "Question ID are required",
    });
  }

  try {
    const quiz = await Quiz.findById(quizId);

    const question = await Question.findById(questionId);

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Question doesn't exist" });
    }

    if (!quiz.quizQuestions.includes(questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Question doesn't exist" });
    }

    // Delete the question from the quiz
    quiz.quizQuestions = quiz.quizQuestions.filter(
      (question) => question.toString() !== questionId.toString()
    );

    // Delete the question from the database
    await Question.findByIdAndDelete(questionId);

    // Save the quiz
    await quiz.save();

    return res
      .status(200)
      .json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error in Deleting Question", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete question" });
  }
};
