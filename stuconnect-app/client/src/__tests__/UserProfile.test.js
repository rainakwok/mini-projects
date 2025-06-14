import React from 'react';
import Firebase from '../components/Firebase';
import '@testing-library/jest-dom';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import Profile from '../components/Profile';
import {act} from '@testing-library/react';

jest.mock('../components/Firebase', () => ({
  createUser: jest.fn(),
  getIdToken: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

describe('UserProfile Component', () => {
  test('renders UserProfile component and checks initial state', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/Name/i).value).toMatch('');
    expect(screen.getByLabelText(/University/i).textContent).toMatch('');
    expect(screen.getByLabelText(/City/i).textContent).toMatch('');
    expect(screen.getByLabelText(/Bio/i).value).toMatch('');
    expect(screen.getByText(/Save/i).textContent).toMatch('');
  });

  test('allows the user to change the Full Name field', () => {
    // fetchMock.mockResponseOnce(JSON.stringify({ express: string }));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    const fullNameInput = screen.getByLabelText(/Name/i);
    act(() => {
      fireEvent.change(fullNameInput, {target: {value: 'Jane Doe'}});
    });
    expect(fullNameInput.value).toBe('Jane Doe');
  });

  test('saves the profile after editing and shows "Save"', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    const fullNameInput = screen.getByLabelText(/Name/i);
    act(() => {
      fireEvent.change(fullNameInput, {target: {value: 'Jane Doe'}});
    });
    const saveButton = screen.getByText(/Save/i);

    await waitFor(() => expect(saveButton.textContent).toBe('Save'));

    // expect(fullNameInput).toBeDisabled();
  });
});
