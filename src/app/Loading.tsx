import React from 'react';
import { Box } from '@mui/material';
import { ClipLoader } from 'react-spinners';

const Loading: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ClipLoader size={50} color={"#123abc"} loading={true} />
    </Box>
  );
};

export default Loading;