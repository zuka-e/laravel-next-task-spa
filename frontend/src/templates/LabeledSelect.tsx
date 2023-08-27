import { memo } from 'react';

import {
  FormControl,
  InputLabel,
  Input,
  Select,
  SelectProps,
  MenuItem,
  MenuItemProps,
} from '@mui/material';

type LabeledSelectProps = {
  label: string;
  options: Record<string, MenuItemProps['value']>;
} & SelectProps;

const LabeledSelect = memo(function LabeledSelect(
  props: LabeledSelectProps
): JSX.Element {
  const { label, options, color, ...selectProps } = props;

  const htmlId = 'filter';
  const labelId = htmlId + '-label';

  return (
    <FormControl className="m-2 w-32">
      <InputLabel
        id={labelId}
        color={color}
        classes={{ focused: color ? undefined : 'text-white' }}
      >
        {label}
      </InputLabel>
      <Select
        id={htmlId}
        labelId={labelId}
        input={
          <Input classes={{ underline: color ? undefined : 'text-white' }} />
        }
        {...selectProps}
      >
        {Object.values(props.options).map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default LabeledSelect;
