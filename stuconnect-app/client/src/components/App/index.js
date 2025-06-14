import {useState, useEffect} from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import Firebase from "../Firebase";
import PrivateRoute from './PrivateRoute';

const serverURL = '';

const App = () => {
  const [user, loading, error] = useAuthState(Firebase.auth);
  const [locations, setLocations] = useState();

  // Determine authentication status based on authUser's presence
  const authenticated = !!user && !loading;

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    console.log('Loading locations...');
    callApiloadLocations().then(res => {
      var parsed = JSON.parse(res.express);
      parsed = parsed.sort((a, b) => (b.city > a.city) ? 1 : -1)
        .sort((a, b) => (a.province_id > b.province_id) ? 1 : -1);
      setLocations(parsed);
    });
  };
  const callApiloadLocations = async () => {
    const url = serverURL + '/api/loadLocations';
    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  return (
    <div>
      {(!loading) && <PrivateRoute authenticated={authenticated} locations={locations} />}
    </div>
  );
};

export default App;
