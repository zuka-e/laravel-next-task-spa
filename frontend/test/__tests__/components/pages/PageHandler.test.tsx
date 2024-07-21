import { render, screen } from '@testing-library/react';

import PageHandler from '@/components/pages/PageHandler';
import { ErrorHandler } from '@/components/errors';
import { Route } from '@/routes';

vi.mock('@/components/errors', () => ({
  ErrorHandler: vi.fn(({ children }) => (
    <div data-testid="error-handler">{children}</div>
  )),
}));

vi.mock('@/routes', () => ({
  Route: vi.fn(() => <div data-testid="route" />),
}));

describe('PageHandler', () => {
  it('renders ErrorHandler', () => {
    render(<PageHandler Component={() => null} pageProps={{}} />);

    expect(ErrorHandler).toBeCalledTimes(1);
    expect(screen.getByTestId('error-handler')).toBeVisible();
  });

  it('passes props to Route component', () => {
    const props = { Component: () => null, pageProps: { foo: 'bar' } };
    render(<PageHandler {...props} />);

    expect(Route).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(props),
      expect.anything()
    );
  });
});
