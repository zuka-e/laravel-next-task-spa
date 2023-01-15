import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * @see https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
 * @see https://testing-library.com/docs/user-event/setup
 */
const setup = (jsx: JSX.Element) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

export default setup;
