import React from 'react';
import Firebase from '../components/Firebase';
import {render, fireEvent} from '@testing-library/react';
import InvitationsPage from '../components/Invitations';
import { MemoryRouter } from "react-router";
import {useAuthState} from 'react-firebase-hooks/auth';


jest.mock('../components/Firebase', () => ({
  createUser: jest.fn(),
  getIdToken: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

describe('InvitationsPage Tests', () => {
  it('should allow switching between Received and Sent views', () => {
    const {getByText} =
      render(
        <MemoryRouter>
          <InvitationsPage/>
        </MemoryRouter>
      );

    const sentTab = getByText('Sent');

    expect(getByText('Received Invitations')).toBeInTheDocument();

    fireEvent.click(sentTab);

    expect(getByText('Sent Invitations')).toBeInTheDocument();
  });
});
