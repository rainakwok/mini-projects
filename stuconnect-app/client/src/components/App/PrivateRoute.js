import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import paths from '../../constants/routes';
import Firebase from '../Firebase';
import Home from '../Landing';
import {SignUp} from '../SignUp/SignUp';
import {LogIn} from '../LogIn/LogIn';
import Discovery from '../Discovery';
import Profile from '../Profile';
import ConnectionsPage from '../Connections';
import InvitationsPage from '../Invitations';

const serverURL = "";

const PrivateRoute = ({authenticated, locations}) => {

  const [user, loading, error] = useAuthState(Firebase.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    updateProfile();
  }, []);

  useEffect(() => {
    if (!loading){
      updateProfile();
    };
  }, [user]);

  const updateProfile = () => {
    if (authenticated && user){      
      checkProfileExists();
    } else {
      setProfile(null);
    };
  };

  const checkProfileExists = async () => {
    await Firebase.doGetIdToken().then(idToken => {
      callApiLoadUserProfile(idToken).then((res) => {
        var parsed = JSON.parse(res.express);
        if (parsed && (parsed.length > 0) && parsed[0]){
          setProfile(parsed);
        } else {
          console.log("No profile found for authenticated user");
          setProfile([]);
        };
      });
    });
  };

  const callApiLoadUserProfile = async (idToken) => {
    const url = serverURL + "/api/loadUserProfileInfo";
    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken, // Firebase ID token
      },
      body: JSON.stringify({uid: user.uid}),
    })
    const body = await response.json();
    if (response.status !== 200) throw Error('Error fetching user profile:', body.message);
    return body;
  };

  const profileExists = () => {
    return (profile != null && (profile && profile.length == 0));
  }

  return (
    <Routes>
      <Route
        path={paths.LANDING}
        element={authenticated ? <Navigate replace to="/Discovery" /> : <Home />}
      />
      <Route
        path={paths.SIGNUP}
        element={(!authenticated || profile == null) ? <SignUp />
          : (!profile) ? <Navigate replace to={paths.PROFILE} />
          : <Navigate replace to={paths.DISCOVERY} /> }
      />
      <Route
        path={paths.LOGIN}
        element={(!authenticated || profile == null) ? <LogIn />
          : (!profile) ? <Navigate replace to={paths.PROFILE} />
          : <Navigate replace to={paths.DISCOVERY} /> }
      />
      <Route
        path={paths.PROFILE}
        element={!authenticated ? <Navigate replace to={paths.LANDING} />
          : (profile != null) && <Profile userProfile={profile} setUserProfile={setProfile} locations={locations} /> }
      />
      <Route
        path={paths.DISCOVERY}
        element={!authenticated ? <Navigate replace to={paths.LANDING} />
          : profileExists() ? <Navigate replace to={paths.PROFILE} />
          : (profile) && <Discovery locations={locations} />}
      />
      <Route
        path={paths.CONNECTIONS}
        element={!authenticated ? <Navigate replace to={paths.LANDING} />
          : profileExists() ? <Navigate replace to={paths.PROFILE} />
          : (profile) && <ConnectionsPage />}
      />
      <Route
        path={paths.INVITATIONS}
        element={!authenticated ? <Navigate replace to={paths.LANDING} />
          : profileExists() ? <Navigate replace to={paths.PROFILE} />
          : (profile) && <InvitationsPage />}
      />
    </Routes>
  );
};

export default PrivateRoute;