import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useRouter } from 'next/router';
import { Provider } from 'react-redux';

import { initializeStore, store } from 'mocks/store';
import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import SignUp from 'pages/register';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: 'any',
  })),
}));

beforeEach(() => {
  initializeStore();
});

describe('Sign Up', () => {
  const signUpFormName = /Create an account/i;
  const emailFieldName = /Email Address/i;
  const passwordFieldName = /^Password(?!.*Confirm)/i;
  const passwordConfirmFieldName = /Password Confirmation/i;
  const submitButtonName = /Create an account/i;

  describe('Form setup', () => {
    it('should display a registration form', () => {
      render(
        <Provider store={store}>
          <SignUp />
        </Provider>
      );

      expect(
        screen.getByRole('heading', { name: signUpFormName })
      ).toBeVisible();
    });
  });

  it('has a link to the login page', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    render(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );

    await userEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    expect(useRouter().push).toHaveBeenCalledWith('/login');
  });

  it('should display password by a show password option', async () => {
    render(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );

    expect(
      screen.queryByRole('textbox', { name: passwordFieldName })
    ).toBeNull();

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Show password/i })
    );

    const passwordField = screen.getByRole('textbox', {
      name: passwordFieldName,
    });
    const passwordConfirmField = screen.getByRole('textbox', {
      name: passwordConfirmFieldName,
    });

    expect(passwordField).toBeVisible();
    expect(passwordConfirmField).toBeVisible();
  });

  describe('Form input', () => {
    const newEmail = 'test' + GUEST_EMAIL;
    const password = 'password';

    it('should not be registered with the wrong email input', async () => {
      render(
        <Provider store={store}>
          <SignUp />
        </Provider>
      );

      const invalidEmail = GUEST_EMAIL + '@example';
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });

      expect(store.getState().auth.signedIn).toBe(undefined);

      userEvent.type(emailField, invalidEmail);
      userEvent.type(passwordField, password);
      userEvent.type(passwordConfirmField, password + 'a');
      userEvent.click(submit);

      await waitFor(() => {
        expect(store.getState().auth.signedIn).toBeFalsy();
      });
    });

    it('should not be registered with the wrong password input', async () => {
      render(
        <Provider store={store}>
          <SignUp />
        </Provider>
      );

      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });

      expect(store.getState().auth.signedIn).toBe(undefined);

      await userEvent.type(emailField, newEmail);
      await userEvent.type(passwordField, password);
      await userEvent.type(passwordConfirmField, password + 'a');
      await userEvent.click(submit);

      await waitFor(() => {
        expect(store.getState().auth.signedIn).toBeFalsy();
      });
    });

    it('should display an error message when email already exists', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <SignUp />
        </Provider>
      );

      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });
      const errorMessage = /^Error/;

      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.queryByText(errorMessage)).toBeNull();

      await user.type(emailField, GUEST_EMAIL);
      await user.type(passwordField, GUEST_PASSWORD);
      await user.type(passwordConfirmField, GUEST_PASSWORD);
      await user.click(submit);

      expect(await screen.findByRole('alert')).toBeVisible();
      expect(screen.getByText(errorMessage)).toBeVisible();
    });

    it('should be registered with the right input', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <SignUp />
        </Provider>
      );

      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });

      await user.type(emailField, newEmail);
      await user.type(passwordField, password);
      await user.type(passwordConfirmField, password);
      await user.click(submit);

      await waitFor(() => {
        expect(store.getState().auth.signedIn).toBe(true);
      });

      expect(store.getState().auth.afterRegistration).toBe(true);
      expect(store.getState().auth.user?.email).toBe(newEmail);
    });
  });
});
