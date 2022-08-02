// Reproduced from: https://github.com/obsidian-tasks-group/obsidian-tasks
import {parseDate} from 'chrono-node';

export class DateParser {
    public static parseDate(
        input: string,
        forwardDate: boolean = false,
    ): moment.Moment {
        // Using start of day to correctly match on comparison with other dates (like equality).
        console.log('test')
        
        const date = parseDate(input, undefined, {
            forwardDate: forwardDate,
        })
        return window
            .moment(
                parseDate(input, undefined, {
                    forwardDate: forwardDate,
                }),
            )
            .startOf('day');
    }
}
