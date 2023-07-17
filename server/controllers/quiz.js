import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
// import uploadImageToCloudinary from "../utils/cloudinaryUpload.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Create New Quiz
// route   POST /api/quiz/create
// access  Private
export const createQuiz = async (req, res) => {
  const { quizName, quizDescription, quizDuration, quizAdmin } = req.body;

  // Validate the request body
  if (
    !(
      quizName?.trim() &&
      quizDescription?.trim() &&
      typeof quizDuration === "number" &&
      quizDuration > 0
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

// @desc   Update Quiz
// route   PUT /api/quiz/edit/:quizId
// access  Private
export const editQuiz = async (req, res) => {
  const { quizId } = req.params;

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
      questionOptions.length >= 2 &&
      questionOptions.length <= 5
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

    // Upload the option images if any
    questOptions.forEach(async (_, index) => {
      let optionImage = req.files?.[`optionImage${index + 1}`];
      if (optionImage) {
        // optionImage = await uploadImageToCloudinary(optionImage);
      }
      questOptions[index].optionImage = optionImage;
    });

    // Upload question image if it exists
    let questionImage = req.files?.questionImage;
    if (questionImage) {
      // questionImage = await uploadImageToCloudinary(questionImage);
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
export const editQuizQuestion = async (req, res) => {
  // validate the request parameters
  const { quizId, questionId } = req.params;
  if (!quizId || !questionId) {
    return res.status(400).json({
      success: false,
      message: "Quiz ID and Question ID are required",
    });
  }

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz doesn't exist" });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Question doesn't exist" });
    }

    if (!quiz.questions.includes(questionId)) {
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
      if (
        !(
          req.body?.questionOptions?.length >= 2 &&
          req.body?.questionOptions?.length <= 5
        )
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Question" });
      }

      const questOptions = [];
      let numberOfCorrectOptions = 0;

      req.body?.questionOptions.forEach((questOpt) => {
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
        fieldsToUpdate.questType = "Single Correct";
      } else {
        fieldsToUpdate.questType = "Multiple Correct";
      }
    }
    // Upload and update the images if any
    if (req.files) {
      // Upload the question image if it exists
      const questionImage = req.files?.questionImage;
      if (questionImage) {
        // const uploadedImage = await uploadImageToCloudinary(questionImage);
        // fieldsToUpdate.questionImage = uploadedImage;
      }

      // Upload the option images if any
      for (let index = 0; index < req.body.questionOptions.length; index++) {
        const optionImage = req.files?.[`optionImage${index + 1}`];
        if (optionImage) {
          // const uploadedImage = await uploadImageToCloudinary(optionImage);
          // fieldsToUpdate.options[index].optionImage = uploadedImage;
        }
      }
    }
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
  // validate the request parameters
  const { quizId, questionId } = req.params;
  if (!quizId || !questionId) {
    return res.status(400).json({
      success: false,
      message: "Quiz ID and Question ID are required",
    });
  }

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz doesn't exist" });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Question doesn't exist" });
    }

    if (!quiz.questions.includes(questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Question doesn't exist" });
    }

    // Delete the question from the quiz
    quiz.questions = quiz.questions.filter(
      (question) => question.toString() !== questionId
    );

    // Delete the question from the database
    await question.remove();

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
