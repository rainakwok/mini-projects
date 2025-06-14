// Author: Raina Kwok

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
// import App from '../components/App';
import Discovery from '../components/Discovery';
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";
import fetchMock from 'jest-fetch-mock';
// import {act} from '@testing-library/react';

// Mock the fetch function
fetchMock.enableMocks();

jest.mock('../components/Discovery');

// const mockUID = 3;
// const mockIDarray = [1,2,3];
// const mockAPIresponse = {express: '[]'};

const locations = [
  {
    id: 1,
    city: "Toronto",
    province_id: "ON"
  }
];

const renderDiscovery = () => {
  render(
    <MemoryRouter>
      <Discovery locations={locations}/>
    </MemoryRouter>
  );
};

test("Renders Discovery page for Discovery route", () => {
  
  Discovery.mockImplementation(() => <div>DiscoveryPageMock</div>);

  renderDiscovery();
  expect(screen.getByText("DiscoveryPageMock")).toBeInTheDocument();

  // const provinceFilter = screen.getByTestId('discov_filterByProv');
  // expect(provinceFilter).toBeInTheDocument();
});


// describe('API call testing', () => {
//   beforeEach(() => {
//     fetchMock.resetMocks(); // Reset the fetch mock before each test
//   });

//   it('should call the loadInitialDiscoveryMatchIDs, getDiscoveryMatches, and loadUserAspirations APIs on Discovery render', async () => {
//     const response = JSON.stringify({ express: JSON.stringify([{ UID: 1 }])});
//     // fetchMock.mockResponseOnce(response);
//     fetchMock.mockResponses(response, response, response);

//     renderDiscovery();
//     // render(
//     //   <MemoryRouter initialEntries={["/Discovery"]}>
//     //     <App/>
//     //   </MemoryRouter>
//     // );
//     // Wait for the loadInitialDiscoveryMatchIDs API call to be made
//     // await waitFor(expectAPIcall('/api/loadInitialDiscoveryMatchIDs', {id: mockUID}));
//     await waitFor(() => {
//       expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/loadInitialDiscoveryMatchIDs', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             id: mockUID
//         })
//       });
//     });

//   // });

//   // it('should call the getDiscoveryMatches APIs on Discovery render', async () => {
//     // fetchMock.mockResponseOnce(JSON.stringify(mockAPIresponse));
    
//     // Wait for the loadLocations API call to be made
//     // await waitFor(expectAPIcall('/api/getDiscoveryMatches', {IDs: mockIDarray}));
//     // await waitFor(() => {
//     //   expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/getDiscoveryMatches', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({
//     //         IDs: mockIDarray
//     //     })
//     //   });
//     // });
//   // });
    
//   // it('should call the loadUserAspirations APIs on Discovery render', async () => {
//     // fetchMock.mockResponseOnce(JSON.stringify(mockAPIresponse));
    
//     // Wait for the loadLocations API call to be made
//     // await waitFor(expectAPIcall('/api/loadUserAspirations', null));
//     // await waitFor(() => {
//     //   expect(fetchMock).toHaveBeenCalledWith('/api/loadUserAspirations', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' } // add 'Authorization: idToken' later
//     //   });
//     // });
//   });
// });