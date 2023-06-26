import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import uploadImageToCloudinary from "../utils/cloudinaryUpload.js";

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
      quizName?.trim() &&
      quizDescription?.trim() &&
      quizDuration > 0 &&
      quizStatus?.trim()
    )
  ) {
    res.status(400).json({ success: false, message: "All input is required" });
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

// @desc   Update Quiz
// route   PUT /api/quiz/edit/:quizId
// access  Private
export const editQuiz = async (req, res) => {
  const { quizId } = req.params;

  // Validate the request parameters
  if (!quizId) {
    return res
      .status(400)
      .json({ success: false, message: "Quiz ID is required" });
  }

  const quiz = await Quiz.findById(quizId);

  // Validate the quiz
  if (!quiz) {
    return res
      .status(400)
      .json({ success: false, message: "Quiz doesn't exist" });
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
  const { quizId } = req.params;

  // Validate the request parameters
  if (!quizId) {
    return res
      .status(400)
      .json({ success: false, message: "Quiz ID is required" });
  }

  const quiz = await Quiz.findById(quizId);

  // Validate the quiz
  if (!quiz) {
    return res
      .status(400)
      .json({ success: false, message: "Quiz doesn't exist" });
  }

  const { question, questionOptions, questionPoints } = req.body;

  // Validate the request body
  if (
    !(
      question.trim() &&
      questionPoints > 0 &&
      questionOptions.length > 2 &&
      questionOptions.length <= 5
    )
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Question" });
  }

  // Validate and add the question options
  const questOptions = [];

  try {
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

    // Upload the option images if any
    questOptions.forEach(async (_, index) => {
      let optionImage = req.files?.[`optionImage${index + 1}`];
      if (optionImage) {
        optionImage = await uploadImageToCloudinary(optionImage);
      }
      questOptions[index].optionImage = optionImage;
    });

    // Upload question image if it exists
    let questionImage = req.files?.questionImage;
    if (questionImage) {
      questionImage = await uploadImageToCloudinary(questionImage);
    }

    // Create the question object
    let quest = {
      quizId,
      question,
      questionImage: questionImage ? questionImage : undefined,
      questionType: questType,
      options: questOptions,
      points: questionPoints,
    };

    quest = new Question(quest);
    console.log("question", quest);
    // Save the question to the database
    const savedQuestion = await quest.save();
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
