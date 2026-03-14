import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../util/redux/store';
import { AppThemeProvider } from '../../theme/ThemeContext';
import LoginPage from '../LoginPage';
import * as api from '../api';

vi.mock('../api');

// ThemeToggle imports @mui/icons-material which has ESM directory-import issues in jsdom
vi.mock('../../components/ThemeToggle', () => ({
  ThemeToggle: () => null,
}));

function renderLoginPage() {
  return render(
    <Provider store={store}>
      <AppThemeProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AppThemeProvider>
    </Provider>,
  );
}

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders a sign in button', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows an error dialog on failed login', async () => {
    // loginUser throws an Error on failure
    vi.mocked(api.loginUser).mockRejectedValue(new Error('Invalid credentials'));
    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // AlertDialog renders as an MUI Dialog (role="dialog") when showAlert is true
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // The error message should appear in the dialog
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
