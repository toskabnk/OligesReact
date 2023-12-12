import { Box, Typography } from '@mui/material';
import backgroundImage from '../assets/olivar.jpg'

function Home() { 
    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        minHeight: '92.5vh',
        backgroundRepeat: 'no-repeat',
    };

    const centerStyle = {
        position: 'absolute',
        left: '50%',
        top: '30%',
        transform: 'translate(-50%, -50%)'
    };
    
    return (
        <div style={backgroundStyle}>
            <div style={centerStyle}>
                <Box>
                    <Typography variant="h1" component="div" gutterBottom fontFamily='system-ui'>
                        Welcome to Oliges
                    </Typography>
                    <Typography variant="h5" component="div" gutterBottom fontFamily='system-ui'>
                    An easy-to-use web application, designed to streamline the management of olive oil cooperatives, covering everything from olive intake management to the automated generation of documents.
                    </Typography>
                </Box>
            </div>
        </div>
    );
} 

export default Home; 