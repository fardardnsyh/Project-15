import addEvent from './add-event';
import editEvent from './edit-event';
import removeEvent from './remove-event';

export function JhhServerControllerSchedule() {
  return {
    addEvent,
    editEvent,
    removeEvent,
  };
}
