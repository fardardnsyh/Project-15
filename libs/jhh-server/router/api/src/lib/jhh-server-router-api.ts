import { Router } from 'express';

import { ApiRoute } from '@jhh/shared/domain';

import { JhhServerControllerDashboard } from '@jhh/jhh-server/controller/dashboard';
import { JhhServerControllerNotes } from '@jhh/jhh-server/controller/notes';
import { JhhServerControllerBoard } from '@jhh/jhh-server/controller/board';
import { JhhServerControllerOffers } from '@jhh/jhh-server/controller/offers';
import { JhhServerControllerSchedule } from '@jhh/jhh-server/controller/schedule';
import { JhhServerControllerPractice } from '@jhh/jhh-server/controller/practice';

export function JhhServerRouterApi(): Router {
  const router: Router = Router();

  const dashboardController = JhhServerControllerDashboard();
  const notesController = JhhServerControllerNotes();
  const boardController = JhhServerControllerBoard();
  const offersController = JhhServerControllerOffers();
  const scheduleController = JhhServerControllerSchedule();
  const practiceController = JhhServerControllerPractice();

  router.get(ApiRoute.Test, (req, res) => {
    res.send('Hello World!');
  });

  router.get(ApiRoute.LoadAssignedData, dashboardController.loadAssignedData);

  router.post(ApiRoute.AddNotesGroup, notesController.addNotesGroup);
  router.put(ApiRoute.EditNotesGroup, notesController.editNotesGroup);
  router.post(
    ApiRoute.DuplicateNotesGroup,
    notesController.duplicateNotesGroup
  );
  router.delete(ApiRoute.RemoveNotesGroup, notesController.removeNotesGroup);

  router.post(ApiRoute.AddNote, notesController.addNote);
  router.put(ApiRoute.EditNote, notesController.editNote);
  router.post(ApiRoute.DuplicateNote, notesController.duplicateNote);
  router.patch(ApiRoute.ChangeNoteGroup, notesController.changeNoteGroup);
  router.delete(ApiRoute.RemoveNote, notesController.removeNote);

  router.post(ApiRoute.AddBoardColumn, boardController.addBoardColumn);
  router.patch(ApiRoute.EditBoardColumn, boardController.editBoardColumn);
  router.post(
    ApiRoute.DuplicateBoardColumn,
    boardController.duplicateBoardColumn
  );
  router.delete(ApiRoute.RemoveBoardColumn, boardController.removeBoardColumn);
  router.patch(ApiRoute.UpdateBoardColumns, boardController.updateBoardColumns);

  router.post(ApiRoute.AddOffer, offersController.addOffer);
  router.put(ApiRoute.EditOffer, offersController.editOffer);
  router.delete(ApiRoute.RemoveOffers, offersController.removeOffers);

  router.post(ApiRoute.AddScheduleEvent, scheduleController.addEvent);
  router.put(ApiRoute.EditScheduleEvent, scheduleController.editEvent);
  router.delete(ApiRoute.RemoveScheduleEvent, scheduleController.removeEvent);

  router.post(ApiRoute.AddPracticeQuiz, practiceController.addQuiz);
  router.put(ApiRoute.EditPracticeQuiz, practiceController.editQuiz);
  router.delete(ApiRoute.RemovePracticeQuiz, practiceController.removeQuiz);
  router.post(
    ApiRoute.AddPracticeQuizResults,
    practiceController.addQuizResults
  );

  return router;
}
