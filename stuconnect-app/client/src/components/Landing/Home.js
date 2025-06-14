import {useState, useEffect} from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from '@mui/material';
import { NavAppBar } from '../Navigation';
import studyConnectSymbol from './study-connect-symbol.png';
import image1 from './canva.png';
import './Home.css';

const Home = () => {
  const ImageCard = ({image, title}) => (
    <Card sx={{maxWidth: '50%', width: '50%', height: 'auto'}}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{height: '100%', objectFit: 'cover'}}
        />
      </CardActionArea>
    </Card>
  );
  // did not do the flip card
  const InfoCard = ({title, frontContent, backContent, isHighlighted}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

    return (
      <div className="card-flip" onClick={handleFlip}>
        <Card className={`info-card ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-front">
            <Typography
              className="info-card-title"
              variant="h5"
              component="div"
              fontFamily={'Verdana, sans-serif'}
              fontWeight={'900px'}
              align="center"
              borderRadius={'75px'}
            >
              {title}
            </Typography>
            <Typography variant="body2">{frontContent}</Typography>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="home">
      <NavAppBar />
      <img
        src={studyConnectSymbol}
        alt="Study and Connect Symbol"
        className="study-connect-symbol"
      />
      <div className="card-container">
        <ImageCard image={image1} title="Image Card 1" />
        <ImageCard image={image1} title="Image Card 2" />
      </div>
      <div className="homepage-phrase">Connect and grow together</div>
      <div className="cards">
        <InfoCard
          title="Connect with Peers Who Share Your Career Passion!"
          frontContent=""
        />
        <InfoCard title="Accept, Reject, Connect" frontContent="" />
        <InfoCard title="SignUp today!!" frontContent="" />
      </div>
    </div>
  );
};

export default Home;
