import { useEffect, useState } from 'react';

import moment from 'moment';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import type { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';

export type DatetimeInputProps = {
  initialValue?: DateTimePickerProps<moment.Moment, moment.Moment>['value'];
} & Partial<DateTimePickerProps<moment.Moment, moment.Moment>>;

/**
 * @see https://mui.com/x/react-date-pickers/date-time-picker
 */
const DatetimeInput = (props: DatetimeInputProps) => {
  const { initialValue } = props;

  const [datetime, setDatetime] = useState<moment.Moment | null>(
    initialValue ? moment(initialValue) : null
  );

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setDatetime(initialValue ? moment(initialValue) : null);
  }, [initialValue]);

  return (
    <DateTimePicker
      renderInput={(params) => <TextField {...params} />}
      inputFormat="YYYY/MM/DD/ HH:mm"
      ampm={false}
      minDateTime={moment()}
      minutesStep={5}
      value={datetime}
      onChange={setDatetime}
      onError={console.log}
      {...props}
    />
  );
};

export default DatetimeInput;
