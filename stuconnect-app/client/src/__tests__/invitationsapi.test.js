import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from '../components/App';
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";
import fetchMock from 'jest-fetch-mock';

// Mock the fetch function
fetchMock.enableMocks();

const locations = [
  {
    id: 1,
    city: "Toronto",
    province_id: "ON"
  }
];

describe('API call testing', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset the fetch mock before each test
  });

  it('should call the loadLocations API on App render', async () => {
    const string = JSON.stringify(locations);
    fetchMock.mockResponseOnce(JSON.stringify({ express: string }));
    
    // Render App component
    render(
      <MemoryRouter>
        <App/>
      </MemoryRouter>
    ); 

    // Wait for the loadLocations API call to be made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/loadLocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    });

  });
});