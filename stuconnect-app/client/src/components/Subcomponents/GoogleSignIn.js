import Firebase from "../Firebase";
import GoogleImg from '../../assets/google_logo.png';

const GoogleSignIn = ({text}) => {
  
 const googleLogin = (e) => {
    e.preventDefault();
    Firebase.signInWithGoogle().then(() => {
      console.log("Google sign in successful");
    }).catch(error => {
      console.log("Google sign-in error:", error);
    });
  };

  return (    
    <button className="google-sign-in-button" onClick={googleLogin}>
      <div className="google-icon-wrapper">
        <img className="google-icon" src={GoogleImg} alt="Google Icon" />
      </div>
      <span className="button-text">{text}</span>
    </button>
  )
};

export default GoogleSignIn;