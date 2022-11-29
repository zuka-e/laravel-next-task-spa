import { useState } from 'react';

import { TextField, TextFieldProps } from '@mui/material';

import { FormAction } from 'store/slices/taskBoardSlice';
import { TitleForm } from '.';

type EditableTitleProps = FormAction & {
  inputStyle?: string;
  disableMargin?: boolean;
  maxRows?: number;
} & TextFieldProps;

const EditableTitle = (props: EditableTitleProps) => {
  const { inputStyle, disableMargin, maxRows, ...formProps } = props;
  const { method, model, variant, ...textFieldProps } = formProps;
  const defaultValue = props.method === 'PATCH' ? props.data.title : '';
  const [editing, setEditing] = useState(false);

  const handleOpenForm = () => {
    setEditing(true);
  };

  const handleCloseForm = () => {
    setEditing(false);
  };

  return editing ? (
    <TitleForm
      handleClose={handleCloseForm}
      defaultValue={defaultValue || ''}
      multiline
      className="-ml-1.5"
      InputProps={{
        className: 'font-bold ' + (props.inputStyle ?? ''),
        classes: { multiline: 'p-1.5' },
      }}
      FormHelperTextProps={{
        className: 'mt-0 ml-1',
      }}
      {...formProps}
    />
  ) : (
    <TextField
      fullWidth
      value={defaultValue || ''} // `defaultValue`の場合初レンダリング時の値を固定
      inputProps={{ title: defaultValue }}
      multiline
      maxRows={props.maxRows || 1}
      variant="outlined"
      className="-ml-1.5"
      InputProps={{
        onClick: handleOpenForm,
        className:
          'rounded outline-1 hover:outline font-bold p-1.5 ' +
          (props.disableMargin ? '' : 'mb-5'),
        classes: {
          inputMultiline: 'line-clamp-1 ' + (props.inputStyle ?? ''),
          notchedOutline: 'border-none',
        },
      }}
      {...textFieldProps}
    />
  );
};

export default EditableTitle;
