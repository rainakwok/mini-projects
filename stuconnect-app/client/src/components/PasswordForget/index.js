import { useState } from 'react';
import { Icon } from 'react-icons-kit'
import { closeRound } from 'react-icons-kit/ionicons/closeRound'
import { styled } from '@mui/material/styles';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import Firebase from "../Firebase";

const resetPwdText = `To reset your password, please enter your email address here, and we will email you a link to reset your password.`
const successText1 = `An email with the reset password link has been sent! Please check your inbox.`

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');  
  const [successText, setSuccessText] = useState(successText1);
  const [openDialog, setOpenDialog] = useState(false);

  const resetFormState = () => {
    setEmail('');
    setEmailError('');
    setEmailSent(false);
    setSuccessText(successText1);
  };

  const handleClickOpen = () => {
    resetFormState();
    setOpenDialog(true);
  };

  const handleClose = () => {
    resetFormState();
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setSuccessText(successText1);
      const formData = new FormData(e.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      const inputEmail = formJson.email;

      try {
        await Firebase.passwordReset(inputEmail);
        setEmail(inputEmail);
        setEmailSent(true);
      } catch (error) {    
        if (error.code === 'auth/user-not-found') {
          setEmailError('A user with this email was not found');
        } else {
          setEmailError('An error occurred. Please try again later.');
          console.error(error.message);
        };
      };
    } else {
      const newText = `An email has been already been sent to ${email}! Please check your inbox.`;
      if (newText !== successText) {
        setSuccessText(newText);
      };
    };
  };

  return (
    <>
      <button className="forgot-link-btn" onClick={handleClickOpen}>
        Forgot your Password?
      </button>
      <BootstrapDialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Reset Password
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Icon icon={closeRound} size={24} />
        </IconButton>
          <DialogContent>
            <DialogContentText>
              {resetPwdText}
            </DialogContentText>
            <TextField autoFocus required
              margin="normal"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              placeholder="name@email.com"
              fullWidth
              variant="standard"
              error={!!emailError}
              helperText={emailError ? emailError : emailSent ? successText : '' }
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">Send Reset Password Email</Button>
          </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default ForgotPassword;