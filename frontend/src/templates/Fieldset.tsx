import { memo } from 'react';

type FieldsetProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

const Fieldset = memo(function Fieldset(props: FieldsetProps): JSX.Element {
  const { children, disabled } = props;

  return (
    <fieldset
      disabled={disabled}
      className={
        'm-0 border-none p-0' +
        (disabled ? ' pointer-events-none opacity-50' : '')
      }
    >
      {children}
    </fieldset>
  );
});

export default Fieldset;
