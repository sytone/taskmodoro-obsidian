import moment from 'moment';
import type { Moment } from 'moment';
import type { Duration } from 'moment';
import { TaskDetailsMode } from '../Enums/component-context';
import {
    DatePickerModal,
    DurationPickerModal,
    RepeatPickerModal,
} from '../Modals';
import type { TaskDetails } from '../TaskDetails';
import type { Frontmatter } from '../Parser';
import { DurationPickerType } from './../Enums/duration-picker-type';
import { formatDate } from './Helpers';

export const showDueDatePicker = (
    td: TaskDetails,
    mode: TaskDetailsMode,
    updater: () => void = null,
) => {
    const pickerStartDate = td.due == '' ? moment() : moment(td.due);
    const onSet = (newDueDate: Moment) => {
        td.due = formatDate(newDueDate);
        updater();
        if (mode == TaskDetailsMode.Update) {
            td.plugin.fileInterface.updateFMProp(td.file, newDueDate, 'due');
        }
    };
    new DatePickerModal(
        td.plugin.app,
        pickerStartDate,
        'Due date',
        onSet,
    ).open();
};

export const showScheduledDatePicker = (
    td: TaskDetails,
    mode: TaskDetailsMode,
    updater: () => void = null,
) => {
    const pickerStartDate =
        td.scheduled == '' ? moment() : moment(td.scheduled);
    const onSet = (newScheduledDate: Moment) => {
        td.scheduled = formatDate(newScheduledDate);
        updater();

        if (mode == TaskDetailsMode.Update) {
            td.plugin.fileInterface.updateFMProp(
                td.file,
                newScheduledDate,
                'scheduled',
            );
        }
    };

    new DatePickerModal(
        td.plugin.app,
        pickerStartDate,
        'Schedule date',
        onSet,
    ).open();
};

export const showRepeatPicker = (
    td: TaskDetails,
    mode: TaskDetailsMode,
    updater: () => void = null,
) => {
    const startRepeatPickerConfig = td.recurringConfig;
    const onSet = (newRepeatConfig: string) => {
        td.recurringConfig = newRepeatConfig;
        updater();
        if (mode == TaskDetailsMode.Update) {
            td.plugin.fileInterface.updateFMProp(
                td.file,
                newRepeatConfig,
                'repeat',
            );
        }
    };
    new RepeatPickerModal(td.plugin.app, startRepeatPickerConfig, onSet).open();
};

export const showEstWorktimePicker = (
    td: TaskDetails,
    mode: TaskDetailsMode,
    updater: () => void = null,
) => {
    const onSet = (estWorktime: Duration) => {
        td.estWorktime = estWorktime;
        updater();
        if (mode == TaskDetailsMode.Update) {
            td.plugin.fileInterface.updateFMProp(
                td.file,
                {
                    minutes: estWorktime.asMinutes(),
                },
                'estimated_worktime',
            );
        }
    };

    new DurationPickerModal(
        td.plugin.app,
        'Estimated worktime',
        td.estWorktime,
        DurationPickerType.Worktime,
        onSet,
    ).open();
};

export const showDailyScheduleWorktimePicker = (
    td: TaskDetails,
    mode: TaskDetailsMode,
    updater: () => void = null,
) => {
    const now = moment().format('YYYY-MM-DD');
    const replacer = (value: any, frontmatter: Frontmatter) => {
        let dailyWorktime: { [key: string]: Object } = frontmatter.get(
            'daily_scheduled_worktime',
        );
        if (!dailyWorktime) {
            dailyWorktime = {};
        }
        dailyWorktime[now] = value;
        return dailyWorktime;
    };

    const onSet = (dailyScheduledWorktime: Duration) => {
        td.dailyScheduledWorktime = dailyScheduledWorktime;
        updater();
        if (mode == TaskDetailsMode.Update) {
            td.plugin.fileInterface.updateFMProp(
                td.file,
                { minutes: dailyScheduledWorktime.asMinutes() },
                'daily_scheduled_worktime',
                false,
                replacer,
            );
        }
    };

    new DurationPickerModal(
        td.plugin.app,
        'Daily scheduled worktime',
        td.dailyScheduledWorktime,
        DurationPickerType.Worktime,
        onSet,
    ).open();
};

export const showPomoLengthPicker = (
    td: TaskDetails,
    mode: TaskDetailsMode,
    updater: () => void,
) => {
    const onSet = (newPomoDuration: Duration) => {
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

    new DurationPickerModal(
        td.plugin.app,
        'Pomodoro length',
        td.pomodoroLenght,
        DurationPickerType.PomodoroLength,
        onSet,
    ).open();
};
