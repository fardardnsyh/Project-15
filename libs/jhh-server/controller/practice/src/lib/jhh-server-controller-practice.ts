import addQuiz from './add-quiz';
import editQuiz from './edit-quiz';
import removeQuiz from './remove-quiz';
import addQuizResults from './add-quiz-results';

export function JhhServerControllerPractice() {
  return {
    addQuiz,
    editQuiz,
    removeQuiz,
    addQuizResults,
  };
}
