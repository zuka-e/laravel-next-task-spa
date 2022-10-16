import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import type { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';

export type DatetimeInputProps = {
  initialValue?: DateTimePickerProps<Dayjs, Dayjs>['value'];
} & Partial<DateTimePickerProps<Dayjs, Dayjs>>;

/**
 * @see https://mui.com/x/react-date-pickers/date-time-picker
 */
const DatetimeInput = (props: DatetimeInputProps) => {
  const { initialValue } = props;

  const [datetime, setDatetime] = useState<Dayjs | null>(
    initialValue ? dayjs(initialValue) : null
  );

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setDatetime(initialValue ? dayjs(initialValue) : null);
  }, [initialValue]);

  return (
    <DateTimePicker
      renderInput={(params) => <TextField {...params} />}
      inputFormat="YYYY/MM/DD/ HH:mm"
      ampm={false}
      minDateTime={dayjs()}
      minutesStep={5}
      value={datetime}
      onChange={setDatetime}
      onError={console.log}
      {...props}
    />
  );
};

export default DatetimeInput;
