import backgroundImage from '../assets/olivar.jpg'
import { StyledFlexFullCenter } from '../styles/StyledContainers';

function Home() { 
    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        minHeight: '92.5vh',
        backgroundRepeat: 'no-repeat'
    };
    
    return (
        <StyledFlexFullCenter style={backgroundStyle}>
            Oliges
        </StyledFlexFullCenter>
    );
} 

export default Home; 