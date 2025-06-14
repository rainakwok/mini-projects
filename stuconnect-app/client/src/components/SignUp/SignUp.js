import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import {MdVisibility, MdVisibilityOff} from 'react-icons/md';
import { Box, Typography } from '@mui/material';
import Firebase from '../Firebase';
import {NavAppBar} from '../Navigation';
import GoogleSignIn from '../Subcomponents/GoogleSignIn';
import './SignUp.css';
import paths from '../../constants/routes';

const PWD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const SignUp = () => {
  const navigate = useNavigate();

  const [signupError, setSignupError] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [passConfirmation, setPassConfirmation] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');
  const [pwdType, setPwdType] = useState('password');
  const [confirmPwdType, setConfirmPwdType] = useState('password');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPassError('');
    setConfirmPassError('');
    setSignupError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    }
    if (!pass.trim()) {
      setPassError('Password is required');
      isValid = false;
    } else if (!PWD_REGEX.test(pass)) {
      setPassError(
        'Password must be at least 6 characters long, include a number, a special character, a lowercase and an uppercase letter.',
      );
      isValid = false;
    }
    if (!passConfirmation.trim()) {
      setConfirmPassError('Please confirm your password');
      isValid = false;
    } else if (pass !== passConfirmation) {
      setConfirmPassError('Passwords do not match');
      isValid = false;
    };

    return isValid;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await Firebase.createUser(email, pass);
        console.log('New user created');
      } catch (err) {
        if (err === 'auth/email-already-in-use') {
          setSignupError('An account with that email address already exists.');
        } else { 
          setTimeout(() => {
            setSignupError('An error occurred. Please try again.');
          }, 5000);
        }
      };
    }
  };

  const handlePwdToggle = () => {
    if (pwdType === 'password') {
      setPwdType('text');
    } else {
      setPwdType('password');
    }
  };
  
  const handleConfirmPwdToggle = () => {
    if (confirmPwdType === 'password') {
      setConfirmPwdType('text');
    } else {
      setConfirmPwdType('password');
    }
  };

  return (
    <div className="signup-page">
      <NavAppBar />
      <Box className="main-content">
        <div className="auth-form-container">
          <h2 style={{width: '100%', textAlign: 'center', alignSelf: 'center'}}>
            StuConnect Sign Up
          </h2>
          <form className="SignUp-form" onSubmit={handleSubmit}>
            <div className="inputFormField">
              <label htmlFor="email">Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="youremail@gmail.com"
                id="email"
                name="email"
                className="email-input"
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="inputFormField">
              <label htmlFor="password">Password (6+ characters)</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyItems: 'space-between',
                }}
              >
                <input
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  type={pwdType}
                  placeholder="********"
                  id="password"
                  name="password"
                  style={{marginRight: '20px'}}
                  className="password-input"
                />
                <span style={{position: 'relative'}} onClick={handlePwdToggle}>
                  {pwdType == 'password' ? (
                    <MdVisibility size={20} />
                  ) : (
                    <MdVisibilityOff size={20} />
                  )}
                </span>
              </div>
              {passError && <div className="error-message">{passError}</div>}
            </div>
            <div className="inputFormField">
              <label htmlFor="passwordConfirmation">Confirm Password</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyItems: 'space-between',
                }}
              >
                <input
                  value={passConfirmation}
                  onChange={e => setPassConfirmation(e.target.value)}
                  type={confirmPwdType}
                  placeholder="********"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  style={{marginRight: '20px'}}
                  className="password-input"
                />
                <span style={{position: 'relative'}} onClick={handleConfirmPwdToggle}>
                  {confirmPwdType == 'password' ? (
                    <MdVisibility size={20} />
                  ) : (
                    <MdVisibilityOff size={20} />
                  )}
                </span>
              </div>
              {confirmPassError && <div className="error-message">{confirmPassError}</div>}
            </div>
            <button type="submit" className="sign-up-btn">
              Join
            </button>
            {signupError && (
              <div>
                <Typography
                  variant="caption"
                  className="error-message"
                >
                  {signupError}
                </Typography>
              </div>
            )}
          </form>
          <GoogleSignIn text="Sign-up with Google" />
          <button className="link-btn" onClick={() => navigate(paths.LOGIN)}>
            Already have an account? Log in here.
          </button>
        </div>
      </Box>
    </div>
  );
};
