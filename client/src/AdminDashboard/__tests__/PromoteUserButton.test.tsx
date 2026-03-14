import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../util/redux/store';
import { AppThemeProvider } from '../../theme/ThemeContext';
import PromoteUserButton from '../PromoteUserButton';
import * as api from '../api';

vi.mock('../api');

function renderPromoteButton(currentRole = 'user') {
  const onSuccess = vi.fn();
  return {
    onSuccess,
    ...render(
      <Provider store={store}>
        <AppThemeProvider>
          <MemoryRouter>
            <PromoteUserButton
              userId="test-id"
              currentRole={currentRole}
              onSuccess={onSuccess}
            />
          </MemoryRouter>
        </AppThemeProvider>
      </Provider>,
    ),
  };
}

describe('PromoteUserButton', () => {
  it('renders a role dropdown', () => {
    renderPromoteButton();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders an Assign button that is disabled when role is unchanged', () => {
    renderPromoteButton('user');
    const button = screen.getByRole('button', { name: /assign/i });
    expect(button).toBeDisabled();
  });

  it('calls onSuccess after successful role assignment', async () => {
    // upgradeUser returns true on success
    vi.mocked(api.upgradeUser).mockResolvedValue(true);
    const { onSuccess } = renderPromoteButton('user');

    // Open the MUI Select dropdown and pick "Admin" (exact match avoids "Superadmin")
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Admin' }));

    // Assign button should now be enabled (selected role differs from currentRole)
    const button = screen.getByRole('button', { name: /assign/i });
    expect(button).not.toBeDisabled();

    await userEvent.click(button);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('admin');
    });
  });
});
