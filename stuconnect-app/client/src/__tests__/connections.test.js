// Author: Ali Al-Rady

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/App';
import ConnectionsPage from '../components/Connections';
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

jest.mock('../components/Connections')

test("Renders Connections page for Connections route", () => {

    ConnectionsPage.mockImplementation(() => <div>ConnectionsPageMock</div>);
    render(
      <MemoryRouter initialEntries={["/Connections"]}>
        <ConnectionsPage/>
      </MemoryRouter>
    );
  
    expect(screen.getByText("ConnectionsPageMock")).toBeInTheDocument();
  })
  