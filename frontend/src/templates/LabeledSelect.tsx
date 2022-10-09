import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  SelectProps,
  MenuItem,
  MenuItemProps,
} from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    label: {
      fontWeight: 'bold',
      '&.inputLabel-default.Mui-focused': {
        color: theme.palette.primary.contrastText,
      },
      '&.inputLabel-primary.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '&.inputLabel-secondary.Mui-focused': {
        color: theme.palette.secondary.main,
      },
    },
    input: {
      '&.input-default:after': {
        borderColor: theme.palette.primary.contrastText,
      },
      '&.input-primary:after': {
        borderColor: theme.palette.primary.main,
      },
      '&.input-secondary:after': {
        borderColor: theme.palette.secondary.main,
      },
    },
  })
);

type LabeledSelectProps = {
  label: string;
  options: Record<string, MenuItemProps['value']>;
} & SelectProps;

const LabeledSelect = (props: LabeledSelectProps) => {
  const { label, options, color, ...selectProps } = props;
  const classes = useStyles();

  const htmlId = 'filter';
  const labelId = htmlId + '-label';

  return (
    <FormControl classes={{ root: classes.root }}>
      <InputLabel
        id={labelId}
        classes={{ focused: classes.label }}
        className={`inputLabel-${props.color || 'default'}`}
      >
        {props.label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={htmlId}
        value={props.value}
        onChange={props.onChange}
        input={
          <Input
            classes={{ underline: classes.input }}
            className={`input-${props.color || 'default'}`}
          />
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
};

export default LabeledSelect;
