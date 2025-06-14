import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MdViewModule, MdOutlineViewArray, MdArrowBack, MdArrowForward } from "react-icons/md";
import {
  Grid,
  Box,
  CssBaseline,
  IconButton,
} from '@mui/material';
import DiscoveryProfile from './DiscoveryProfile.js';
import FilterUsers from './FilterUsers.js';
import Firebase from '../Firebase';
import { NavAppBar, NavDrawer } from '../Navigation';

const serverURL = '';

const Discovery = (props) => {
  const [user, loading, error] = useAuthState(Firebase.auth);
  
  const [viewMode, setViewMode] = useState('grid');
  const [authUserInfo, setAuthUserInfo] = useState();
  const [initialMatchingIDs, setInitialMatchingIDs] = useState([]);
  const [userAspirations, setUserAspirations] = useState();
  const [activeUserAspirations, setActiveUserAspirations] = useState();
  const [matchedUserInfo, updateMatchedUserInfo] = useState([]);
  const [sortedMatches, updateSortedMatches] = useState();
  const [filteredUserInfo, setFilteredUserInfo] = useState([]);
  const [loadStatus, setLoadStatus] = useState(0);
  const [selectedLoc, setSelectedLoc] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Firebase.doGetIdToken().then((idToken) => {
      callApiloadMatches(idToken, [user.uid]).then((res) => {
        var parsed = JSON.parse(res.express);
        if (parsed.length !== 0) {
          setAuthUserInfo(parsed);
        }
      }).then(() => {
        loadAspirations();
      });
    });
  }, []);

  useEffect(() => {
    if (activeUserAspirations) {
      loadDiscoveryMatches();
    };
  }, [activeUserAspirations]);

  useEffect(() => {
    const initialMatchesLen = initialMatchingIDs.length;
    if (initialMatchesLen === 0) {
      updateMatchedUserInfo([]);
      setFilteredUserInfo([]);
      updateSortedMatches([]);
    } else {
      if (initialMatchesLen <= matchedUserInfo.length) {
        const matchedUserInfoUpdated = matchedUserInfo.filter(o =>
          initialMatchingIDs.includes(o.UID),
        );
        // if all updated initialMatchingIDs are included in existing matchedUserInfo list, don't call callApiloadMatches again
        if (initialMatchesLen === matchedUserInfoUpdated.length) {
          updateMatchedUserInfo(matchedUserInfoUpdated);
          setFilteredUserInfo(matchedUserInfoUpdated);
          const sortedUpdated = sortedMatches.filter(o => initialMatchingIDs.includes(o.UID));
          updateSortedMatches(sortedUpdated);
          return;
        };
      };
      Firebase.doGetIdToken().then(idToken => {
        callApiloadMatches(idToken, initialMatchingIDs)
        .then(res => {
          var parsed = JSON.parse(res.express);
          if (parsed.length != 0) {
            updateMatchedUserInfo(parsed);
            setFilteredUserInfo(parsed);
          }
          return parsed;
        }).then(res2 => {
          if (res2.length == 0) return;
          let sorted = sortMatches(
            res2,
            userAspirations,
            activeUserAspirations[0],
          );
          updateSortedMatches(sorted);
        });
      });
    };
  }, [initialMatchingIDs]);
  
  // Update filter list when sorted matches are loaded
  useEffect(() => {
    if (sortedMatches && sortedMatches.length > 0) {
      filterUsers();
      setLoadStatus(1);
    } else {
      setLoadStatus(0);
    }
  }, [sortedMatches]);

  // Load user aspirations and set active user aspirations
  const loadAspirations = () => {        
    return new Promise((resolve, reject) => {
      Firebase.doGetIdToken().then(idToken => {
        callApiLoadUserAspirations(idToken)
        .then(res => {
            var parsed = JSON.parse(res.express);
            setUserAspirations(parsed);
          
            return parsed;
        }).then(list => {
            const activeAsp = list.filter(aspiration => aspiration.UID == user.uid);
            setActiveUserAspirations(activeAsp);
            resolve(list);
        });
      });
    });
  };

  const loadDiscoveryMatches = () => {
      return new Promise((resolve, reject) => {
          // Load initial matches
          Firebase.doGetIdToken().then(idToken => {
              callApiLoadInitialMatchingIDs(idToken)
              .then(res => {
                  var parsed = JSON.parse(res.express);
                  parsed = parsed.map(o => o.UID);
                  setInitialMatchingIDs(parsed);
                  return parsed;                
              });
          });
      });
  };

  const callApiLoadInitialMatchingIDs = async (idToken) => {
      const url = serverURL + "/api/loadInitialDiscoveryMatchIDs";
      console.log(url);

      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': idToken, // Firebase ID token
            },
          body: JSON.stringify({
              id: user.uid
          })
      });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
  }
  const callApiLoadUserAspirations = async (idToken) => {
      const url = serverURL + "/api/loadUserAspirations";
      console.log(url);

      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': idToken, // Firebase ID token
            }
      });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
  };
  const callApiloadMatches = async (idToken, idArray) => {
      const url = serverURL + "/api/getDiscoveryMatches";
      console.log(url);

      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": idToken, // Firebase ID token
            },
          body: JSON.stringify({
              IDs: idArray
          })
      });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
  };


  const sortMatches = (matches, userAsp, activeAsp) => {
    console.log('Sorting matches...');
    var sorted = matches.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Get user a and user b aspirations
      let userA = userAsp.find(o => o.UID == a.UID);
      let userB = userAsp.find(o => o.UID == b.UID);
      if (!userA && !userB) {
        return 0;
      } else if (!userB) {
        return -1;
      } else if (!userA) {
        return 1;
      };
    
      if (activeAsp.Job_id == userA.Job_id) {
        scoreA += 1;
      } else if (activeAsp.Group_id == userA.Group_id) {
        scoreA += 2;
      } else {
        scoreA += 10;
      }
      if (activeAsp.Job_id == userB.Job_id) {
        scoreB += 1;
      } else if (activeAsp.Group_id == userB.Group_id) {
        scoreB += 2;
      } else {
        scoreB += 10;
      }
      return scoreA - scoreB; // If scoreA < scoreB, a comes first

      // // ALT TEST: Sort by matching career, then by matching group
      // let activeAspIDs = activeAsp.map(i => i.Job_id);
      // let activeAspGroups = activeAsp.map(i => i.Group_id);
      // let userA_aspMatchList = userAsp.filter(o => (o.UID == a.UID && activeAspIDs.includes(o.Job_id)));
      // let userB_aspMatchList = userAsp.filter(o =>(o.UID == b.UID && activeAspIDs.includes(o.Job_id)));
      // let userA_groupMatchList = userAsp.filter(o => (o.UID == a.UID && activeAspGroups.includes(o.Group_id)));
      // let userB_groupMatchList = userAsp.filter(o =>(o.UID == b.UID && activeAspGroups.includes(o.Group_id)));

      // if (userA_aspMatchList.length > userB_aspMatchList.length) {
      //   scoreA += 1;
      // } else if (userA_aspMatchList.length < userB_aspMatchList.length) {
      //   scoreB += 1;
      // };

      // scoreA += userA_aspMatchList.length;
      // scoreB += userB_aspMatchList.length;
      // scoreA += userA_groupMatchList.length;
      // scoreB += userB_groupMatchList.length;
    });
    console.log('Matches sorted!');
    return sorted;
  };

  const filterUsers = () => {
    console.log('Applying filters...');
    var filtered = sortedMatches;
    if (selectedLoc && selectedLoc.length > 0) {
      console.log('Filters found! Filtering...');
      filtered = sortedMatches.filter(user =>
        selectedLoc.includes(user.city + ', ' + user.province_id),
      );
    }
    setFilteredUserInfo(filtered);
    console.log('Setting match load status to 1...');
  };
  
  // Reload matched users when location filter changes
  useEffect(() => {        
      if (sortedMatches) {
          console.log("Reloading matched users with new location filter,", selectedLoc);
          filterUsers();
      }
  }, [selectedLoc]);  

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredUserInfo.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredUserInfo.length) % filteredUserInfo.length);
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <NavAppBar />
        <Box className="brandColour-bg" sx={{ flex: 1 }}>
          <Grid container>
            <Grid item sx={{ height: '100%', width: '100%' }} xs={2}>
              <NavDrawer path="Discovery" />
            </Grid>
            <Grid item sx={{ height:'100%', flexGrow: 1, paddingTop: '20px' }} xs={10}>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={4}
                sx={{ height: '100%', width: '95%' }}
              >
                <Grid item xs={2} sx={{ width: '100%' }} > 
                  <Grid container
                    direction='row'
                    justifyContent='flex-start'
                    alignItems='center'
                    sx={{ height: '100%', width: '100%' }}                    
                  >                
                    <Grid item>
                      {props.locations &&
                        <FilterUsers
                          locations={props.locations}
                          selectedLoc={selectedLoc}
                          setSelectedLoc={setSelectedLoc}
                        />
                      }
                    </Grid>
                    <Grid item sx={{ marginLeft: 'auto' }} >
                      <IconButton onClick={() => setViewMode(prevMode => prevMode === 'grid' ? 'single' : 'grid')}>
                        {viewMode === 'grid' ? <MdOutlineViewArray /> : <MdViewModule />}
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sx={{ width: '100%' }} justifyContent='flex-start'> 
                    {viewMode === 'grid' ? (
                      <Grid
                        container
                        spacing={1}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        sx={{ padding: '20px', height: '100%' }}
                      >
                        {loadStatus === 0 ? (
                          <div style={{textAlign: 'center'}}>
                            <h3>Loading Your Matches...</h3>
                          </div>
                        ) : (
                          filteredUserInfo.map((u, index) => (
                            <DiscoveryProfile
                              user={u}
                              authUserInfo={authUserInfo}
                              aspirations={userAspirations}
                              setLoadStatus={setLoadStatus}
                              setInitialMatchingIDs={setInitialMatchingIDs}
                              loadDiscoveryMatches={loadDiscoveryMatches}
                            />
                          ))
                        )}
                      </Grid>
                    ) : (
                      <>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        // sx={{ minHeight: 'calc(100vh - 64px)' }} // Adjust this value based on the actual height of your AppBar
                      >
                        <Grid item xs={2} display="flex" justifyContent="flex-end">
                          <IconButton onClick={handlePrevious} size="large">
                            <MdArrowBack />
                          </IconButton>
                        </Grid>
                        <Grid item xs={8} display="flex" justifyContent="center" sx={{ width: '100%' }}>
                          <DiscoveryProfile
                            user={filteredUserInfo[currentIndex]}
                            authUserInfo={authUserInfo}
                            aspirations={userAspirations}
                            setLoadStatus={setLoadStatus}
                            setInitialMatchingIDs={setInitialMatchingIDs}
                            loadDiscoveryMatches={loadDiscoveryMatches}
                          />
                        </Grid>
                        <Grid item xs={2} display="flex" justifyContent="flex-start">
                          <IconButton onClick={handleNext} size="large">
                            <MdArrowForward />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <div style={{textAlign: 'center'}}>
                        <h5>Match: {currentIndex+1} / {filteredUserInfo.length} </h5>
                      </div>
                      </>
                    )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );  
}

export default Discovery;
