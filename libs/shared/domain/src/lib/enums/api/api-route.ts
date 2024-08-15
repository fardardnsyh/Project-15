export enum ApiRoute {
  Test = '/test',
  //
  BaseUser = '/user',
  Login = '/login',
  Register = '/register',
  RemoveAccount = '/remove-account',
  //
  BaseProtected = '/api',
  //
  LoadAssignedData = '/data',
  //
  AddNotesGroup = '/add-notes-group',
  EditNotesGroup = '/edit-notes-group',
  DuplicateNotesGroup = '/duplicate-notes-group',
  RemoveNotesGroup = '/remove-notes-group',
  //
  AddNote = '/add-note',
  EditNote = '/edit-note',
  RemoveNote = '/remove-note',
  DuplicateNote = '/duplicate-note',
  ChangeNoteGroup = '/change-note-group',
  //
  AddBoardColumn = '/add-board-column',
  EditBoardColumn = '/edit-board-column',
  DuplicateBoardColumn = '/duplicate-board-column',
  RemoveBoardColumn = '/remove-board-column',
  UpdateBoardColumns = '/update-board-columns',
  //
  AddOffer = '/add-offer',
  EditOffer = '/edit-offer',
  RemoveOffers = '/remove-offers',
  //
  AddScheduleEvent = '/add-schedule-event',
  EditScheduleEvent = '/edit-schedule-event',
  RemoveScheduleEvent = '/remove-schedule-event',
  //
  AddPracticeQuiz = '/add-practice-quiz',
  EditPracticeQuiz = '/edit-practice-quiz',
  RemovePracticeQuiz = '/remove-practice-quiz',
  AddPracticeQuizResults = '/add-practice-quiz-results',
}
