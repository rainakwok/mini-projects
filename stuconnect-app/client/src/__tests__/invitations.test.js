import React from 'react';
import Firebase from '../components/Firebase';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import InvitationsPage from '../components/Invitations';
import { MemoryRouter } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';

jest.mock('../components/Firebase', () => ({
  createUser: jest.fn(),
  getIdToken: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

//import { auth } from "../components/firebase.js";
//import { TextEncoder } from 'util';

// global.TextEncoder = TextEncoder;

// const { TextEncoder, TextDecoder } = require('util');
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

// const { JSDOM } = require("jsdom");
// const Environment = require('jest-environment-jsdom');

// module.exports = class CustomTestEnvironment extends Environment {
//   async setup() {
//     await super.setup();
//     if (typeof this.global.TextEncoder === 'undefined') {
//       const { TextEncoder, TextDecoder } = require('util');
//       this.global.TextEncoder = TextEncoder;
//       this.global.TextDecoder = TextDecoder;
//     }
//   }
// };


test('Renders InvitationsPage component', async () => {
  render(
    <MemoryRouter>
      <InvitationsPage />
    </MemoryRouter>
  );

  // Assert that the component renders successfully
  await waitFor(() => expect(screen.getByRole('tab', { name: /Invitations/ })).toBeInTheDocument());
});

