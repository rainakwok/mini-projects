import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Grid, Box, TextField, MenuItem, Button, Typography, CssBaseline, Card, CardContent } from '@mui/material';
import Firebase from "../Firebase";
import { NavAppBar, NavDrawer } from '../Navigation';

const InvitationsPage = () => {
    const [user, loading] = useAuthState(Firebase.auth);

    const [receivedInvitations, setReceivedInvitations] = useState([]);
    const [sentInvitations, setSentInvitations] = useState([]);
    const [aspirations, setAspirations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAspiration, setSelectedAspiration] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        Firebase.doGetIdToken().then(idToken => {
            fetchReceivedInvitations(idToken);
            fetchSentInvitations(idToken);
            fetchProfileAspirations(idToken);
        });
    }, []);


    const mapAspirationsToInvitations = (invitations) => {
      const combinedMap = new Map();
  
      invitations.forEach(inv => {
          // Check if we already have an entry for this UID
          if (combinedMap.has(inv.UID)) {
              // If so, just add the aspiration to the existing entry
              const existingEntry = combinedMap.get(inv.UID);
              existingEntry.Aspirations = [...new Set([...existingEntry.Aspirations.split(', '), inv.Aspirations])].join(', ');
          } else {
              // If not, add the entry to the map
              combinedMap.set(inv.UID, { ...inv, Aspirations: inv.Aspirations });
          }
      });
      return Array.from(combinedMap.values());
  };
  

  const fetchReceivedInvitations = async (idToken) => {
    const url = "/api/getReceivedInvitations";
    console.log(url);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': idToken, // Firebase ID token
        },
        body: JSON.stringify({ userId: user.uid })
    });
    const data = await response.json();
    if (response.status === 200) {
        const enrichedInvitations = mapAspirationsToInvitations(JSON.parse(data.express));
        setReceivedInvitations(enrichedInvitations);
    } else {
        console.error("Error fetching received invitations:", data.error);
    };
};

const fetchSentInvitations = async (idToken) => {
    const url = "/api/getSentInvitations";
    console.log(url);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken, // Firebase ID token
    },
        body: JSON.stringify({ userId: user.uid })
    });
    const data = await response.json();
    if (response.status === 200) {
        setSentInvitations(JSON.parse(data.express));
    } else {
        console.error("Error fetching sent invitations:", data.error);
    };
};


    const fetchProfileAspirations = async (idToken) => {
        const url = "/api/loadUserAspirations";
        console.log(url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': idToken, // Firebase ID token
            },
        });
        const data = await response.json();
        if (response.status === 200) {
            setAspirations(JSON.parse(data.express));
        } else {
            console.error("Error fetching aspirations:", data.error);
        };
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAspirationChange = (e) => {
        setSelectedAspiration(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSelectedAspiration('');
        setSortOption('');
    };

    // const filteredAndSortedReceivedInvitations = receivedInvitations
    // .filter(inv => 
    //     inv.Name.toLowerCase().includes(searchTerm) &&
    //     (!selectedAspiration || inv.Aspirations.includes(selectedAspiration))
    // )
    // .sort((a, b) => {
    //     if (sortOption === 'firstNameAsc') {
    //         return a.Name.localeCompare(b.Name);
    //     }
    //     if (sortOption === 'firstNameDesc') {
    //         return b.Name.localeCompare(a.Name);
    //     }
    //     return 0;
    // });

    // // Apply search, filter, and sort to sent invitations
    // const filteredAndSortedSentInvitations = sentInvitations
    //     .filter(inv => 
    //         inv.Name.toLowerCase().includes(searchTerm) &&
    //         (!selectedAspiration || inv.Aspirations.includes(selectedAspiration))
    //     )
    //     .sort((a, b) => {
    //         if (sortOption === 'firstNameAsc') {
    //             return a.Name.localeCompare(b.Name);
    //         }
    //         if (sortOption === 'firstNameDesc') {
    //             return b.Name.localeCompare(a.Name);
    //         }
    //         return 0;
    //     });

    // Apply search, filter, and sort to received invitations

    return (
        <>
        <CssBaseline />
            <Box sx={{ minHeight: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <NavAppBar />
                <Box className="brandColour-bg" sx={{ flex: 1 }}>
                    <Grid container direction='row'>
                        <Grid item xs={2} sx={{ height: '100%' }}>
                            <NavDrawer path='Invitations' />
                        </Grid>
                        <Grid item xs={10} sx={{ maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
                            <Box p={3}>
                                <div style={{ padding: '20px' }}>
                                <h3 style={{ marginBottom: '20px', color: '#333' }}>My Invitations</h3>
                                    {/* <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <TextField
                                            type="text"
                                            label="Search by name"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            variant="outlined"
                                        />
                                        <TextField
                                            select
                                            label="Filter by aspirations"
                                            value={selectedAspiration}
                                            onChange={handleAspirationChange}
                                            variant="outlined"
                                            style={{ width: '200px' }}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            {aspirations.map((asp, index) => (
                                                <MenuItem key={index} value={asp.Job}>{asp.Job}</MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            select
                                            label="Sort"
                                            value={sortOption}
                                            onChange={handleSortChange}
                                            variant="outlined"
                                            style={{ width: '150px' }}
                                        >
                                            <MenuItem value="">None</MenuItem>
                                            <MenuItem value="firstNameAsc">First Name (A-Z)</MenuItem>
                                            <MenuItem value="firstNameDesc">First Name (Z-A)</MenuItem>
                                        </TextField>
                                        <Button onClick={handleClear} variant="contained" sx={{ backgroundColor: '#7B1FA2', color: 'white' }}>
                                            Clear
                                        </Button>
                                    </Box> */}
                                    <div style={{ marginTop: '20px' }}>
                                        <Typography variant="h7" >Received</Typography>
                                    </div>
                                    {receivedInvitations.map((invitation, index) => (
                                        <Card
                                            key={index}
                                            variant="outlined"
                                            sx={{ boxShadow:  "0 2px 4px rgb(0 0 0 / 0.1)", marginTop: "10px", width: "100%", minWidth: "200px", display: 'flex', flexDirection: 'column'}}
                                        >
                                            <CardContent style={{ borderBottom: "1px solid lightgrey" }}>
                                                <Typography variant="subtitle1">Name: {invitation.Name}</Typography>
                                                <Typography variant="body1">Aspirations: {invitation.Aspirations}</Typography>
                                                <Typography variant="body1">Date Invited: {new Date(invitation.DateInvited).toLocaleDateString()}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <div style={{ marginTop: '20px' }}>
                                        <Typography variant="h7" >Sent</Typography>
                                    </div>
                                    {sentInvitations.map((invitation, index) => (
                                        <Card
                                            key={index}
                                            variant="outlined"
                                            sx={{ boxShadow:  "0 2px 4px rgb(0 0 0 / 0.1)", marginTop: "10px", width: "100%", minWidth: "200px", display: 'flex', flexDirection: 'column'}}
                                        >
                                            <CardContent style={{ borderBottom: "1px solid lightgrey" }}>
                                                <Typography variant="subtitle1">Name: {invitation.Name}</Typography>
                                                <Typography variant="body1">Aspirations: {invitation.Aspirations}</Typography>
                                                <Typography variant="body1">Date Sent: {new Date(invitation.DateSent).toLocaleDateString()}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
  };
  
  export default InvitationsPage;
