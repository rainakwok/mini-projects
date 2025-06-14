//Author kripa Pokhrel
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {SignUp} from '../components/SignUp/SignUp';
import {NavAppBar} from '../components/Navigation';
import Firebase from '../components/Firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {MemoryRouter} from 'react-router';

jest.mock('../components/Navigation');
jest.mock('../components/Firebase', () => ({
  createUser: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../components/Navigation', () => ({
  NavAppBar: jest.fn(),
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    Firebase.createUser.mockClear();
    useAuthState.mockReturnValue([null, false, null]);
  });

  it('renders the signup form and allows user to submit', async () => {
    const {getByLabelText, getByText} = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password (6+ characters)');
    const submitButton = getByText('Join');

    fireEvent.change(emailInput, {target: {value: 'test@gmail.com'}});
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(Firebase.createUser).toHaveBeenCalledWith(
        'test@gmail.com',
        'Password123!',
      ),
    );
  });
});
