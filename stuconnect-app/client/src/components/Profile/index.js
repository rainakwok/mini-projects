import {useState, useEffect} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import Firebase from '../Firebase';
import {NavAppBar} from '../Navigation';
import { PROVINCES } from '../../constants/values';
import { arraysEqual, getUniqueObjects } from '../../constants/functions';
import './Profile.css';

const serverURL = '';
const emptyProfile = {
  Name: '[Enter Name]',
  university: '',
  cityID: '',
  Bio: '',
  careerInterests: [],
  pictureURL: '' 
}

 const UserProfile = ({userProfile, setUserProfile, locations}) => {
  const [user, loading, error] = useAuthState(Firebase.auth);
  
  const [aspirations, setAspirations] = useState([]);
  const [uniqueAspirations, setUniqueAspirations] = useState([]);
  const [cities, setCities] = useState(locations);
  const [unis, setUni] = useState([]);
  const [imageUploadURL, setImageUploadURL] = useState('');
  const [profile, setProfile] = useState(emptyProfile);
  const [newProfile, setNewProfile] = useState();
  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState('');

  const uploadProfilePicture = (file) => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
      };
      const storageRef = ref(Firebase.storage, `profile_images/${file.name + v4()}`);
      uploadBytes(storageRef, file).then(async () => {
        console.log('Uploaded a blob/image file!');
        const downloadURL = await getDownloadURL(storageRef);
        resolve(downloadURL);
      });
    });
  };

  // Load universities, initial profile state and load aspirations from table from database
  useEffect(() => {
    loadOntarioUniversities();
    
    Firebase.doGetIdToken().then(idToken => {
      callApiLoadUserAspirations(idToken).then((res) => {
        if (userProfile && userProfile.length > 0) {
          appendAspirationsToProfile(res, userProfile[0]);
        } else {
          appendAspirationsToProfile(res, emptyProfile);
        };
        setUniqueAspirations(getUniqueObjects(res, 'Job_id'));
      });
    });
  }, []);

  const appendAspirationsToProfile = (asp, p) => {
    const newP = { ...p,
      careerInterests: asp.filter(a => a.UID == p.UID).map(o => o.Job)
    };
    setProfile(newP);
    setNewProfile(newP);

    // Set cities dropdown list based on province
    if (newP.province_name) {
      const provinceCode = PROVINCES.find(prov => prov.name == newP.province_name).code;
      const filteredCities = locations.filter(loc => loc.province_id == provinceCode);
      setCities(filteredCities);
    };
  };

  useEffect(() => {
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(newProfile);
  }, [newProfile]);

  const handleProfileChange = (field, value) => {
    setNewProfile(ogProfile => ({
      ...ogProfile,
      [field]: value,
    }));
  };

  const handleProfilePictureChange = event => {
    const file = event.target.files[0];
    if (file) {
      uploadProfilePicture(file).then(url => {
        setImageUploadURL(url);
        handleProfileChange('pictureURL', url);
      });
    }
  };

  const handleInspirationsChange = event => {
    const { target: {value} } = event;
    handleProfileChange(
      'careerInterests',
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleProvinceChange = (event, key) => {
    var provinceCode = key.key.slice(2);
    var filteredCities = locations.filter(loc => loc.province_id == provinceCode);
    setCities(filteredCities);

    handleProfileChange('province_name', event.target.value);
    handleProfileChange('city', '');
  };

  const handleCityChange = (event, key) => {
    var key2 = key.key.slice(2);
    var provinceCode = cities.find(city => city.id == key2).province_id;
    handleProfileChange('city', event.target.value);
    handleProfileChange('province_name', PROVINCES.find(prov => prov.code == provinceCode).name);
  };  

  const callApiLoadUserAspirations = async (idToken) => {
    const url = serverURL + "/api/loadUserAspirations";
    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken, // Firebase ID token
      },
    })
    const body = await response.json();
    if (response.status !== 200) throw Error('Error fetching user aspirations:', body.message);
    const aspirations = JSON.parse(body.express);
    setAspirations(aspirations);
    return aspirations;
  };

  const loadOntarioUniversities = async () => {
    const url = serverURL + "/api/loadOntarioUniversities";
    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const body = await response.json();
    if (response.status !== 200) throw Error('Error fetching user universities:', body.message);
    const uni = JSON.parse(body.express);
    setUni(uni);
  };

  const callApiAddUserAspirations = async (idToken, newAspList) => {
    const url = serverURL + "/api/addUserAspiration";
    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken, // Firebase ID token
      },
      body: JSON.stringify({
        uid: user.uid,
        aspirationsList: newAspList
      }),
    })
    const body = await response.json();
    if (response.status !== 200) throw Error('Error adding user aspirations:', body.message);
    return;
  };

  const canSaveChanges = () => {
    return (
      newProfile &&
      newProfile.Name &&
      newProfile.university &&
      newProfile.city &&
      newProfile.Bio &&
      newProfile.careerInterests.length > 0
    );
  }

  const handleSave = async () => {
    console.log('Saving profile...');
    if (!canSaveChanges()) {
      console.log('Form validation failed. Cannot save profile.');
      setFormError('Please complete all fields before saving.');
      return;
    } else {
      setFormError('');
      setEditMode(false);

      // UPDATE PROFILE STATE
      const idToken = await Firebase.doGetIdToken();
      if (!arraysEqual(profile.careerInterests, newProfile.careerInterests)) {
        const aspObject = uniqueAspirations.filter(a => newProfile.careerInterests.includes(a.Job));     
        callApiAddUserAspirations(idToken, aspObject);
      };
      setProfile(newProfile);
      setUserProfile([newProfile]);
      
      // UPDATE PROFILE
      callApiSaveProfile(idToken, imageUploadURL);
    };
  };

  const callApiSaveProfile = async (idToken, imageURL) => {
    const url = serverURL + "/api/saveUserProfileInfo";
    console.log(url);
    const city_id = cities.find(c => c.city == newProfile.city).id;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken, // Firebase ID token
      },
      body: JSON.stringify({
        uid: user.uid,
        name: newProfile.Name,
        university: newProfile.university,
        cityID: city_id,
        bio: newProfile.Bio,
        pictureURL: imageURL
      }),
    })
    const body = await response.json();
    if (response.status !== 200) throw Error('Error saving user profile:', body.message);
    console.log('Profile saved');
    return body;
  }; 

  const handleCancel = () => {
    setFormError('');
    setNewProfile(profile);
    setEditMode(false);
  };

  return (
    <>
    { (profile && newProfile)
    &&
    <div className="profile-page">
      <NavAppBar />
      {(profile && newProfile) &&
      <Paper
        sx={{
          paddingX: 4,
          paddingY: 2,
          margin: 'auto',
          width: '800px !important',
          maxWidth: '100%',
          // minHeight: '800px',
          border: '1px solid black',
        }}
      >
        <div>
          <Typography variant="subtitle1" sx={{marginBottom: 2}}>{user.email}</Typography>
        </div>
        <form noValidate autoComplete="off" onSubmit={e => e.preventDefault()}>
          { editMode ?
          <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Avatar
                src={newProfile.pictureURL ? newProfile.pictureURL : null}
                alt="Profile Picture"
                className="profilePic"
                sx={{
                  width: 80,
                  height: 80,
                  marginBottom: '10px',
                }}
              />
              { editMode &&
              <>
                <input
                  accept="image/*"
                  type="file"
                  id="select-profile-picture"
                  style={{display: 'none'}}
                  onChange={handleProfilePictureChange}
                />
                <label htmlFor="select-profile-picture">
                  <Button
                    variant="contained"
                    component="span"
                    sx={{
                      marginBottom: '20px',
                      backgroundColor: 'rgb(128,128,128)',
                      ':hover': {backgroundColor: '#a49fe1'},
                      borderRadius: '1px',
                      padding: '5px 5px',
                      minWidth: '120px',
                      width: 'fit-content',
                    }}
                  >
                    {newProfile.pictureURL ? 'Edit Profile Picture' : 'Add Profile Picture'}
                  </Button>
                </label>
              </>}
            </Box>
            <div className="inputFormField2">
              { editMode ?
                <TextField
                  size="small"
                  label="Full Name"
                  variant="standard"
                  value={newProfile.Name}
                  onChange={e => handleProfileChange('Name', e.target.value)}
                  sx={{
                    margin: '10px',
                    width: '800px',
                  }}
                />
                : <h2>{newProfile.Name}</h2>
              }
            </div>
          </Box>
          <div className="inputFormField2">
            <FormControl fullWidth sx={{marginBottom: 2}}>
              <InputLabel id="University-label">University</InputLabel>
              <Select
                size="small"
                labelId="University-label"
                value={newProfile.university}
                onChange={event =>
                  handleProfileChange('university', event.target.value)
                }
                disabled={!editMode}
              >
                {unis.map(university => (
                  <MenuItem
                    key={university.id}
                    value={university.university_name}
                  >
                    {university.university_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="inputFormField2">
            <FormControl fullWidth sx={{marginBottom: 2}}>
              <InputLabel id="inspirations-label">Career Interest</InputLabel>
              <Select
                size="small"
                labelId="inspirations-label"
                multiple={true}
                value={newProfile.careerInterests}
                onChange={handleInspirationsChange}
                renderValue={selected => (
                  <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                    {selected.map(value => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                disabled={!editMode}
              >
                {/* {aspirations.filter((v,i,a) => a.indexOf(v) == i).map(aspiration => (
                  <MenuItem key={aspiration.Job_id} value={aspiration.Job}>
                    {aspiration.Job}
                  </MenuItem>
                ))} */}
                {[...new Map(aspirations.map(item =>
                        [item['Job_id'], item])).values()].map(aspiration => (
                          <MenuItem key={aspiration.Job_id} value={aspiration.Job}>
                            {aspiration.Job}
                          </MenuItem>
                        )
                )}
              </Select>
            </FormControl>
          </div>
          <div className="inputFormField2">
            <FormControl fullWidth sx={{marginBottom: 2}}>
              <InputLabel id="province-label">Province</InputLabel>
              <Select
                size="small"
                labelId="province-label"
                value={newProfile.province_name}
                onChange={handleProvinceChange}
                disabled={!editMode}
              >
                {PROVINCES.map(prov => (
                  <MenuItem key={prov.code} value={prov.name}>
                    {prov.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="inputFormField2">
            <FormControl fullWidth sx={{marginBottom: 2}}>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                size="small"
                labelId="city-label"
                value={newProfile.city}
                onChange={handleCityChange}
                disabled={!editMode}
              >
                {cities.map(loc => (
                  <MenuItem key={loc.id} value={loc.city}>
                    {loc.city}, {loc.province_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField
            size="small"
            label="Bio"
            multiline
            rows={2}
            variant="outlined"
            value={newProfile.Bio}
            onChange={e => handleProfileChange('Bio', e.target.value)}
            disabled={!editMode}
            sx={{marginBottom: 2, width: 'calc(100% - 20px)'}}
          />
          </>

        : <ReadProfile profile={profile} />
        }
          <Box sx={{marginTop: 4, gap: 1}}>
            {editMode ? (
            <>
            <div>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'rgb(40, 25, 208)',
                  '&:hover': {backgroundColor: 'rgb(30, 15, 198)'},
                  marginX: 1,
                }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'rgb(128,128,128)',
                  '&:hover': {backgroundColor: 'rgb(108,108,108)'},
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              </div>
              <div>                
                {formError && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    color="error"
                  >
                    {formError}
                  </Typography>
                )}
              </div>
            </>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'rgb(40, 25, 208)',
                  '&:hover': {backgroundColor: 'rgb(30, 15, 198)'},
                }}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </Box>
        </form>
      </Paper>
      }
    </div>
    }
    </>
  );
};

const ReadProfile = ({profile}) => {
  return (
    <>
      <div>
        <Avatar
          src={profile.pictureURL ? profile.pictureURL : null}
          alt="Profile Picture"
          className="profilePic"
          sx={{
            width: 80,
            height: 80,
            marginBottom: '10px',
          }}
        />
      </div>
      <div>
        <h2>{profile.Name}</h2>
        <p><strong>University:</strong> {profile.university}</p>
        <p><strong>City:</strong> {profile.city}</p>
        <p><strong>Province:</strong> {profile.province_name}</p>
        <p><strong>Bio:</strong></p>
        <input multiline disabled
          type="text"
          value={profile.Bio}
          style={{ width: '95%', lineHeight: '15px', textAlignVertical: "top", padding: '10px' }}
        />
        <p><strong>Career Interests:</strong> {profile.careerInterests.join(', ')}</p>
      </div>
      {/* {(!profile || profile.length == 0) && (
        <div>
          <Typography
            variant="caption"
            color="gray"
          >
            Please complete your profile setup to access other features of this application.
          </Typography>
        </div>
      )} */}
    </>
  );
};

export default UserProfile;