import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { FormControlLabel, Checkbox, CheckboxProps } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: { color: theme.palette.text.secondary },
  })
);

type LabeledCheckboxProps = {
  label: string;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
} & CheckboxProps;

const LabeledCheckbox = (props: LabeledCheckboxProps) => {
  const { label, checked, setChecked, ...checkboxProps } = props;
  const classes = useStyles();

  const handleChange = () => {
    props.setChecked(!props.checked);
  };

  return (
    <div>
      <FormControlLabel
        classes={{ root: classes.label }}
        label={props.label}
        control={
          <Checkbox
            onChange={handleChange}
            color="primary"
            size="small"
            {...checkboxProps}
          />
        }
      />
    </div>
  );
};

export default LabeledCheckbox;
