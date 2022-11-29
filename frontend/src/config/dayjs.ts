import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';

import 'dayjs/locale/ja';

/** @see https://day.js.org/docs/en/i18n/changing-locale */
dayjs.locale('ja');
/** @see https://day.js.org/docs/en/plugin/calendar */
dayjs.extend(calendar);
/** @see https://day.js.org/docs/en/plugin/update-locale */
dayjs.extend(updateLocale);

dayjs.updateLocale('ja', {
  /** @see https://day.js.org/docs/en/customization/calendar */
  calendar: {
    lastDay: '[昨日] LT',
    sameDay: '[今日] LT',
    nextDay: '[明日] LT',
    lastWeek: '[先週] dddd LT',
    nextWeek: '[翌週] dddd LT',
    sameElse: 'LLLL',
  },
});
