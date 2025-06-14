import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Typography, Grid} from '@mui/material';
import Firebase from '../Firebase';
import {NavAppBar} from '../Navigation';
import GoogleSignIn from '../Subcomponents/GoogleSignIn';
import PasswordForget from '../PasswordForget';
import './LogIn.css';
import paths from '../../constants/routes';

export const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    let isValid = false;
    if (!email && !pass) {
      setLoginError('Email and password are required');
    } else if (!email) {
      setLoginError('Email is required');
    } else if (!pass) {
      setLoginError('Password is required');
    } else {
      isValid = true;
    };
    return isValid;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      Firebase.signInWithEmailPassword(email, pass)
        .then(() => console.log('Logged in!'))
        .catch(err => {
          if (err == 'auth/invalid-credential') {
            console.log('Invalid credentials entered');
            setLoginError('Invalid email or password');
          } else {
            console.log('Some other error occured while signing in:', err);
            setLoginError('An error occurred while signing in');
          }
        });
    };
  };

  return (
    <>
    <NavAppBar />
    <div className="login-page">
      <Grid container className="login-grid">
        <Grid item xs={5} className="login-image-container">
        </Grid>
        <Grid item xs={7} className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              fontFamily={'Cursive'}
              fontWeight={'900px'}
              fontSize={'40px'}
              className="login-title"
            >
              StuConnect Log In
              <div style={{display: 'block'}}>Welcome Back!</div>
            </Typography>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="********"
              />
            </div>
            <button type="submit" className="log-in-btn">
              Log In
            </button>
            {loginError && (
              <div>
                <Typography
                  variant="caption"
                  className="error-message"
                  color="error"
                >
                  {loginError}
                </Typography>
              </div>
            )}

            <GoogleSignIn className="login-form" text="Login with Google" />
            <button className="link-btn" onClick={() => navigate(paths.SIGNUP)}>
              Don't have an account? Register here
            </button>
            <PasswordForget />
          </form>
        </Grid>
      </Grid>
    </div>
    </>
  );
};

export default LogIn;
