// Memo:
// Unit test in a sense that tests one component
// In integration tests, the wrapper components will be tested.
// As simulating the real behavior such as routing or cookies will be challenging,
// E2E testing may be preferable.

import { type Mock } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';

import { setup } from '@test/utils/user-events';
import { faker } from '@test/utils/faker';
import SignUp from '@/pages/register';
import { setupStore } from '@/store';
import { useRegisterMutation } from '@/store/api';

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/store/api/', () => ({
  useRegisterMutation: vi.fn(),
}));

(useRouter as Mock).mockReturnValue({
  asPath: '',
});

describe('Registration Page', () => {
  const register = vi.fn();
  (useRegisterMutation as Mock).mockReturnValue([register, {}]);

  it('registers successfully', async () => {
    const { user } = setup(
      <Provider store={setupStore()}>
        <SignUp />
      </Provider>
    );

    const email = faker.internet.exampleEmail();
    const password = faker.internet.password();

    await user.type(screen.getByRole('textbox', { name: /email/i }), email);
    await user.click(screen.getByRole('checkbox', { name: /password/i }));
    await user.type(
      screen.getByRole('textbox', { name: /password$/i }),
      password
    );
    await user.type(
      screen.getByRole('textbox', { name: /password confirm/i }),
      password
    );

    // cf. https://github.com/testing-library/dom-testing-library/issues/474
    // await user.click(screen.getByRole('button', { name: /create/i }));
    fireEvent.submit(screen.getByRole('form', { name: /create/i }));

    await waitFor(() => {
      expect(register).toBeCalled();
    });
  });
});
