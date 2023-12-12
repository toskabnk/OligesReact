import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const Register = () => {
    return (
        <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        bgcolor: 'gray.300',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: '2px 2px 10px gray',
          borderRadius: '4px',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          width: '50%',
        }}>
        <Typography variant="h4" color="text.primary" align="center" gutterBottom>
          What are you?
        </Typography>
        <Box>
          <Button component={RouterLink} to="/register-farmer"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Farmer
          </Button>
          <Button component={RouterLink} to="/register-cooperative"
            variant="contained"
            color="primary"
          >
            Cooperative
          </Button>
        </Box>
      </Box>
    </Container>

    );
};

export default Register;