import '@angular/compiler';
import * as ScheduleSelectors from './schedule.selectors';

describe('Schedule Selectors Full Suite', () => {
  const mockInitialState = {
    schedule: {
      ids: ['1', '2'],
      entities: {
        '1': {
          id: '1',
          name: 'event 1',
          start: new Date(),
          end: new Date(),
          color: '#fff',
        },
        '2': {
          id: '2',
          name: 'event 2',
          start: new Date(),
          end: new Date(),
          color: '#fff',
        },
      },
      addEvent: { inProgress: false, error: 'Error', success: true },
      editEvent: { inProgress: true, error: null, success: false },
      removeEvent: { inProgress: false, error: 'Error', success: true },
    } as any,
  };

  describe('addEvent', () => {
    it('should select the addEvent inProgress state', () => {
      const result = ScheduleSelectors.selectAddEventInProgress.projector(
        mockInitialState.schedule
      );
      expect(result).toBe(false);
    });

    it('should select the addEvent error state', () => {
      const result = ScheduleSelectors.selectAddEventError.projector(
        mockInitialState.schedule
      );
      expect(result).toBe('Error');
    });

    it('should select the addEvent success state', () => {
      const result = ScheduleSelectors.selectAddEventSuccess.projector(
        mockInitialState.schedule
      );
      expect(result).toBe(true);
    });
  });

  describe('editEvent', () => {
    it('should select the editEvent inProgress state', () => {
      const result = ScheduleSelectors.selectEditEventInProgress.projector(
        mockInitialState.schedule
      );
      expect(result).toBe(true);
    });

    it('should select the editEvent error state', () => {
      const result = ScheduleSelectors.selectEditEventError.projector(
        mockInitialState.schedule
      );
      expect(result).toBe(null);
    });

    it('should select the editEvent success state', () => {
      const result = ScheduleSelectors.selectEditEventSuccess.projector(
        mockInitialState.schedule
      );
      expect(result).toBe(false);
    });
  });

  describe('removeEvent', () => {
    it('should select the removeEvent inProgress state', () => {
      const result = ScheduleSelectors.selectRemoveEventInProgress.projector(
        mockInitialState.schedule
      );
      expect(result).toBe(false);
    });

    it('should select the removeEvent error state', () => {
      const result = ScheduleSelectors.selectRemoveEventError.projector(
        mockInitialState.schedule
      );
      expect(result).toBe('Error');
    });

    it('should select the removeEvent success state', () => {
      const result = ScheduleSelectors.selectRemoveEventSuccess.projector(
        mockInitialState.schedule
      );
      expect(result).toBe(true);
    });
  });
});
