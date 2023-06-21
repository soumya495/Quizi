import Quiz from "../models/Quiz.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Create New Quiz
// route   POST /api/quiz/create
// access  Private
export const createQuiz = async (req, res) => {
  const { quizName, quizDescription, quizDuration, quizStatus, quizAdmin } =
    req.body;

  // Validate the request body
  if (
    !(
      quizName.trim() &&
      quizDescription.trim() &&
      quizDuration.trim() &&
      quizStatus.trim()
    )
  ) {
    res.status(400).send({ message: "All input is required" });
  }

  // from middleware
  const quizAdminType = req.quizAdminType;

  const quiz = new Quiz({
    quizAdmin,
    adminModel: quizAdminType === "User" ? "User" : "Group",
    quizName,
    quizDescription,
    quizDuration,
    quizType: quizAdminType === "User" ? "Public" : "Private",
    quizStatus,
  });

  try {
    // Save the quiz
    await quiz.save();
    // Return the created quiz
    return res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error In Creating Quiz ", error);
    return res.status(500).json({ message: "Failed to create quiz" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Update Quiz
// route   PUT /api/quiz/edit/:quizId
// access  Private
export const editQuiz = async (req, res) => {
  const { quizId } = req.params;

  // Validate the request parameters
  if (!quizId) {
    return res.status(400).send({ message: "Quiz ID is required" });
  }

  const quiz = await Quiz.findById(quizId);

  // Validate the quiz
  if (!quiz) {
    return res.status(400).send({ message: "Quiz doesn't exist" });
  }

  const allowedFields = [
    "quizName",
    "quizDescription",
    "quizDuration",
    "quizStatus",
  ];
  const fieldsToUpdate = {};

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
    res.json({
      message: "Quiz updated successfully",
      updatedFields: fieldsToUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update quiz" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Add Question to Quiz
// route   POST /api/quiz/add-question/:quizId
// access  Private
export const addQuizQuestion = async (req, res) => {
  const { quizId } = req.params;

  // Validate the request parameters
  if (!quizId) {
    return res.status(400).send({ message: "Quiz ID is required" });
  }

  const quiz = await Quiz.findById(quizId);

  // Validate the quiz
  if (!quiz) {
    return res.status(400).send({ message: "Quiz doesn't exist" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Edit a particular question of a quiz
// route   PUT /api/quiz/edit-question/:quizId/:questionId
// access  Private
export const editQuizQuestion = async (req, res) => {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Delete a particular question of a quiz
// route   DELETE /api/quiz/delete-question/:quizId/:questionId
// access  Private
export const deleteQuizQuestion = async (req, res) => {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Attempt Quiz
// route   POST /api/quiz/attempt/:quizId
// access  Private
export const attemptQuiz = async (req, res) => {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Submit Quiz
// route   POST /api/quiz/submit/:quizId
// access  Private
export const submitQuiz = async (req, res) => {};
