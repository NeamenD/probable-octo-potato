// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

// Declare a function named getLearnerData with three parameters: course, assignmentGroup, and learnerSubmissions
function getLearnerData(course, assignmentGroup, learnerSubmissions) {
  // Create an empty object to store learner scores
  const learnerScores = {};
  // Begin a try block to catch any potential errors
  try {
    // Iterate over each submission in the learnerSubmissions array
    for (const submission of learnerSubmissions) {
      // Find the assignment corresponding to the submission ID in the assignmentGroup
      const assignment = findAssignment(
        assignmentGroup,
        submission.assignment_id
      );
      // If the assignment does not exist or the submission is before the due date, skip to the next iteration
      if (!assignment || isSubmissionBeforeDue(assignment, submission)) {
        continue;
      }
      // Calculate the score for the submission
      const score = calculateScore(submission, assignment);
      // Update the learnerScores object with the calculated score
      updateLearnerScores(learnerScores, submission, score);
    }
    // Create an empty array to store the formatted result
    const result = [];
    // Iterate over each learner's scores stored in the learnerScores object
    for (const learnerId in learnerScores) {
      // Retrieve the scores for the current learner
      const scores = learnerScores[learnerId];
      // Calculate the average score for the current learner
      const avg = calculateAverage(scores, assignmentGroup.assignments);

      // Create an object to store data for the current learner
      const learnerData = { id: learnerId, avg: avg };
      // Iterate over each assignment in the assignmentGroup
      for (const assignment of assignmentGroup.assignments) {
        // If the current assignment has a score for the learner, calculate the percentage and add it to the learnerData object
        if (scores[assignment.id]) {
          learnerData[assignment.id] = calculatePercentage(
            scores[assignment.id],
            assignment.points_possible
          );
        }
      }
      // Push the learnerData object to the result array
      result.push(learnerData);
    }

    return result;
    // If any errors occur during execution, catch them and log the error message
  } catch (error) {
    console.error("An error occurred: ", error.message);
    return [];
  }
}

function findAssignment(assignmentGroup, assignmentID) {
  // Use the find method to search for an assignment in the assignmentGroup with a matching ID
  return assignmentGroup.assignments.find(
    (assignment) => assignment.id === assignmentID
  );
}

function isSubmissionBeforeDue(assignment, submission) {
  // Compare the submission date with the due date of the assignment and return true if the submission is before the due date
  return submission.submission.submitted_at < assignment.due_at;
}

function calculateScore(submission, assignment) {
  // If the submission is late, apply a late penalty to the score
  let latePenalty = 1;
  if (submission.submission.submitted_at > assignment.due_at) {
    latePenalty = 0.9; // Penalty if submission is late
  }
  // Calculate the score by multiplying the submission score with the late penalty
  return submission.submission.score * latePenalty;
}

function updateLearnerScores(learnerScores, submission, score) {
  // If the learnerScores object does not have an entry for the current learner, create one
  if (!learnerScores[submission.learner_id]) {
    learnerScores[submission.learner_id] = {};
  }
  // Update the learnerScores object with the calculated score for the current submission
  learnerScores[submission.learner_id][submission.assignment_id] = score;
}

function calculateAverage(scores, assignments) {
  let totalPoints = 0;
  let totalPossible = 0;

  // Iterate over each assignment in the assignments array
  for (const assignment of assignments) {
    // If the learner has a score for the current assignment, add it to the total points
    if (scores[assignment.id]) {
      totalPoints += scores[assignment.id];
      totalPossible += assignment.points_possible;
    } else {
      // If the learner didn't submit the assignment, add the total possible points
      totalPossible += assignment.points_possible;
    }
  }

  // Return the average score
  return totalPoints / totalPossible;
}

function calculatePercentage(score, pointsPossible) {
  return (score / pointsPossible) * 100;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
