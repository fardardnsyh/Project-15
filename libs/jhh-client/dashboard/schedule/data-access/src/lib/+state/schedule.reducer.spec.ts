import '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';

import {
  initialScheduleState,
  scheduleReducer,
  ScheduleState,
} from './schedule.reducer';
import * as ScheduleActions from './schedule.actions';

describe('ScheduleReducer', () => {
  describe('addEvent actions', () => {
    it('should set addEvent inProgress to true', () => {
      const action = ScheduleActions.addEvent({
        payload: {
          start: new Date(),
          end: new Date(),
          title: 'example event',
          color: '#fff',
        },
      });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.addEvent.inProgress).toBe(true);
      expect(state.addEvent.success).toBe(false);
    });

    it('should add a new event and set addEvent success to true', () => {
      const newEvent = {
        id: '1337',
        start: new Date(),
        end: new Date(),
        title: 'example event',
        color: '#fff',
      };
      const action = ScheduleActions.addEventSuccess({
        payload: { addedEvent: newEvent as any },
      });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.entities[newEvent.id]).toEqual(newEvent);
      expect(state.addEvent.inProgress).toBe(false);
      expect(state.addEvent.success).toBe(true);
    });

    it('should update state with error information', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to add event' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = ScheduleActions.addEventFail({ payload: errorResponse });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.addEvent.error).toBe('Failed to add event');
      expect(state.addEvent.inProgress).toBe(false);
    });
  });

  describe('editEvent actions', () => {
    it('should set editEvent inProgress to true', () => {
      const action = ScheduleActions.editEvent({
        payload: {
          id: '1337',
          start: new Date(),
          end: new Date(),
          title: 'updated event',
          color: '#fff',
        } as any,
      });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.editEvent.inProgress).toBe(true);
      expect(state.editEvent.success).toBe(false);
    });

    it('should update a event and set editEvent success to true', () => {
      const updatedEvent = {
        id: '1337',
        start: new Date(),
        end: new Date(),
        title: 'updated event',
        color: '#fff',
      };
      const action = ScheduleActions.editEventSuccess({
        payload: { editedEvent: updatedEvent as any },
      });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.entities[updatedEvent.id]).toEqual(updatedEvent);
      expect(state.editEvent.inProgress).toBe(false);
      expect(state.editEvent.success).toBe(true);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to edit event' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = ScheduleActions.editEventFail({ payload: errorResponse });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.editEvent.error).toBe('Failed to edit event');
      expect(state.editEvent.inProgress).toBe(false);
    });
  });

  describe('removeEvent actions', () => {
    it('should set removeEvent inProgress to true', () => {
      const action = ScheduleActions.removeEvent({
        payload: {
          eventId: '1337',
        },
      });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.removeEvent.inProgress).toBe(true);
      expect(state.removeEvent.success).toBe(false);
    });

    it('should remove a event and set removeEvent success to true', () => {
      const removedEvent = {
        id: '1337',
        start: new Date(),
        end: new Date(),
        title: 'removed event',
        color: '#fff',
      };
      const action = ScheduleActions.removeEventSuccess({
        payload: { removedEvent } as any,
      });

      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.entities[removedEvent.id]).toBeUndefined();
      expect(state.removeEvent.inProgress).toBe(false);
      expect(state.removeEvent.success).toBe(true);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to remove event' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = ScheduleActions.removeEventFail({
        payload: errorResponse,
      });
      const state: ScheduleState = scheduleReducer(
        initialScheduleState,
        action
      );

      expect(state.removeEvent.error).toBe('Failed to remove event');
      expect(state.removeEvent.inProgress).toBe(false);
    });
  });
});
