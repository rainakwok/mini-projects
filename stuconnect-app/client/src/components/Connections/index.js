import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { CssBaseline, Grid, Box, TextField, MenuItem, Button, Card, CardContent } from '@mui/material';
import Firebase from "../Firebase";
import { NavAppBar, NavDrawer } from '../Navigation';

function ConnectionsPage() {
    const [user, loading, error] = useAuthState(Firebase.auth);

    const [connections, setConnections] = useState([]);
    const [filteredConnections, setFilteredConnections] = useState([]);
    const [aspirations, setAspirations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAspiration, setSelectedAspiration] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [connectionDatetime, setConnectionDatetime] = useState('');

    useEffect(() => {
        Firebase.doGetIdToken().then(idToken => {
            fetchConnections();
            fetchProfileAspirations(idToken);
            fetchConnectionDatetime();
        });
    }, []);

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

    const fetchConnections = async () => {
        const url = "/api/getConnections";
        console.log(url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.uid }) // Use your user ID here
        });
        const data = await response.json();
        if (response.status === 200) {
            setConnections(JSON.parse(data.express));
            setFilteredConnections(JSON.parse(data.express));
        } else {
            console.error("Error fetching connections:", data.error);
        }
    };  

    const fetchConnectionDatetime = async () => {
        const url = "/api/getConnectionDatetime";
        console.log(url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.uid }) // Use your user ID here
        });
        const data = await response.json();
        if (response.status === 200) {
            setConnectionDatetime(data.express); // Set the connection datetime state
        } else {
            console.error("Error fetching connection datetime:", data.error);
        };
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        filterConnections(searchTerm, selectedAspiration);
    };

    const handleAspirationChange = (e) => {
        const aspiration = e.target.value;
        setSelectedAspiration(aspiration);
        filterConnections(searchTerm, aspiration);
    };

    const handleSortChange = (e) => {
        const option = e.target.value;
        setSortOption(option);
        sortConnections(connections, option);
    };

    const filterConnections = (searchTerm, aspiration) => {
        const filtered = connections.filter(connection =>
            connection.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (aspiration === '' || aspirations.find(a => a.UID === connection.UID)?.Job.toLowerCase().includes(aspiration.toLowerCase()))
        );
        sortConnections(filtered, sortOption);
    };

    const sortConnections = (filtered, sortOption) => {
        switch (sortOption) {
            case 'firstNameAsc':
                filtered.sort((a, b) => a.Name.split(' ')[0].localeCompare(b.Name.split(' ')[0]));
                break;
            case 'firstNameDesc':
                filtered.sort((a, b) => b.Name.split(' ')[0].localeCompare(a.Name.split(' ')[0]));
                break;
            case 'lastNameAsc':
                filtered.sort((a, b) => a.Name.split(' ')[1].localeCompare(b.Name.split(' ')[1]));
                break;
            case 'lastNameDesc':
                filtered.sort((a, b) => b.Name.split(' ')[1].localeCompare(a.Name.split(' ')[1]));
                break;
            default:
                // Do nothing if no sorting option selected
                break;
        };
        setFilteredConnections([...filtered]);
        // setConnections([...filtered]);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSelectedAspiration('');
        setSortOption('');
        fetchConnections();
    };

    return (
        <>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <NavAppBar/>
                <Box className="brandColour-bg" sx={{ flex: 1 }}>
                    <Grid container direction='row'>
                        <Grid item xs={2} sx={{ height: '100%' }}>
                            <NavDrawer path='Connections' />
                        </Grid>
                        <Grid item xs={10}>
                            <Box p={3} sx={{ maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ marginBottom: '20px', color: '#333' }}>My Connections</h3>
                                    <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
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
                                            {(aspirations && aspirations.length > 0) && 
                                                aspirations.map(aspiration => (
                                                <MenuItem key={aspiration.UID} value={aspiration.Job}>{aspiration.Job}</MenuItem>
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
                                            <MenuItem value="lastNameAsc">Last Name (A-Z)</MenuItem>
                                            <MenuItem value="lastNameDesc">Last Name (Z-A)</MenuItem>
                                        </TextField>
                                        <Button onClick={handleClear} variant="contained" style={{ backgroundColor: '#7B1FA2', color: 'white', fontSize: '0.875rem' }}>
                                            Clear
                                        </Button>
                                    </Box>
                                    {(connections && connections.length === 0)
                                    ?
                                        <h3>You have no connections</h3>
                                    : 
                                    (filteredConnections && filteredConnections.length === 0)
                                    ?
                                        <h3>No results</h3>
                                    :
                                    <>                                                         
                                        {filteredConnections.map((connection) => (
                                            <Card
                                                key={connection.UID}
                                                variant="outlined"
                                                sx={{ boxShadow:  "0 2px 4px rgb(0 0 0 / 0.1)", marginTop: "10px", width: "100%", minWidth: "200px", display: 'flex', flexDirection: 'column'}}
                                            >
                                                <CardContent style={{ borderBottom: "1px solid lightgrey" }}>
                                                    <div>Name: {connection.Name}</div>
                                                    <div>Aspirations: {aspirations.find(a => a.UID === connection.UID)?.Job}</div>
                                                    <div>Date Connected: {connectionDatetime.substring(0, 10)}</div> {/* Display only the date */}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </>
                                    }
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}

export default ConnectionsPage;
