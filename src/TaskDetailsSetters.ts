import { TaskDetails } from './TaskDetails';
import { TaskDetailsMode } from './Enums/component-context';
import type { Duration } from 'moment';

export const onSetPomoLength = (
  td: TaskDetails,
  newPomoDuration: Duration,
  mode: TaskDetailsMode,
  updater: () => void,
) => {
  td.pomodoroLenght = newPomoDuration;
  updater();
  if (mode == TaskDetailsMode.Update) {
    td.plugin.fileInterface.updateFMProp(
      td.file,
      {
        minutes: newPomoDuration.asMinutes(),
      },
      'pomodoro_length',
    );
  }
};
