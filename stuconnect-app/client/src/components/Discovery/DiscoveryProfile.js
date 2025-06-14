import * as React from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import { Button, Card, CardActions, CardContent, Typography, ThemeProvider, createTheme } from '@mui/material';
import Firebase from "../Firebase";
import { STATUS_ID } from "../../constants/values";
import { getDistanceFromLatLonInKm } from "../../constants/functions";

const serverURL = "";

const DiscoveryProfile = (props) =>{

  const appTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#160B9B'
      },
      secondary: {
        main: '#1B08FF',
      },
      error: {
        main: '#c71502'
      }
    }
  });

  const [user, loading, error] = useAuthState(Firebase.auth);
  const [jobAspirations, setJobAspirations] = React.useState([]);

  React.useEffect(() => {
    const asp = props.aspirations;
    if (asp && asp.length > 0 && props.user) {
      let profileAsp = asp.filter((f) => f.UID === props.user.UID);
      profileAsp = profileAsp.map((p) => p.Job);
      setJobAspirations(profileAsp);
    }
  }, [props.aspirations, props.user]);
  

  const handleRequestClick = () => {
    console.log("Requesting connection with " + props.user.Name);
    props.setLoadStatus(0);

    // Add request connections status to database
    Firebase.doGetIdToken().then(idToken => {
      callApiUpdateConnStatus(idToken, STATUS_ID.pending)
      .then(() => {
          props.loadDiscoveryMatches();
      });
    });
  };
  
  const handleRejectClick = () => {
    console.log("Rejecting connection with " + props.user.Name);
    props.setLoadStatus(0);

    // Add reject connection status to database
    Firebase.doGetIdToken().then(idToken => {
      callApiUpdateConnStatus(idToken, STATUS_ID.declined)
      .then(() => {
          props.loadDiscoveryMatches();
      });
    });
  };

  const callApiUpdateConnStatus = async (idToken, status) => {
    const url = serverURL + "/api/updateConnStatus";
    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken, // Firebase ID token
      },
      body: JSON.stringify({ 
        UID_send: user.uid, // authenticated user
        UID_receive: props.user.UID, // user belonging to the current profile card
        statusID: status
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const getDistance = () => {
    return getDistanceFromLatLonInKm(
      props.authUserInfo[0].lat,
      props.authUserInfo[0].lng,
      props.user.lat,
      props.user.lng
    ).toFixed(0);
  }

  return (
    <ThemeProvider theme={appTheme}>
      <Card
        variant="outlined"
        sx={{ boxShadow:  "0 2px 4px rgb(0 0 0 / 0.1)", margin: "10px", width: "30%", minWidth: "200px", display: 'flex', flexDirection: 'column'}}
      >
        <CardContent style={{ borderBottom: "1px solid lightgrey" }}>
          <Typography variant="h6">
            <strong>{props.user.Name}</strong>
          </Typography>
          <Typography variant="subtitle2" >
            {props.user.city + ", " + props.user.province_id}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: 'gray' }} >
            {getDistance()} km away
          </Typography>
        </CardContent>
        <CardContent sx={{ marginTop: "-10px" }} >
          <Typography variant="overline">
            CAREER INTERESTS<br/>
          </Typography>
          <Typography variant="body2">
            {jobAspirations.join(', ')}
          </Typography>
        </CardContent>
        <CardActions sx={{ marginTop: 'auto', paddingLeft: "15px", paddingBottom: "15px", justifyContent: "flex-start" }} >
          <Button variant="contained" size="small" onClick={handleRequestClick} >Request</Button>
          <Button variant="outlined" size="small" onClick={handleRejectClick} >Dismiss</Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  )
}

export default DiscoveryProfile;
