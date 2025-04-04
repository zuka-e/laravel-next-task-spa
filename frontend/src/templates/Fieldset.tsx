import { memo, type JSX } from 'react';

/**
 * [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset) for use with MUI.
 *
 * @example
 * <Fieldset disabled={isLoading}>...</Fieldset>
 */
const Fieldset = memo(function Fieldset(
  props: JSX.IntrinsicElements['fieldset'],
): JSX.Element {
  return (
    <fieldset
      className={
        'm-0 border-none p-0' +
        (props.disabled ? ' pointer-events-none opacity-50' : '')
      }
      {...props}
    />
  );
});

export default Fieldset;
