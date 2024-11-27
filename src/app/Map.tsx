import React from 'react'
import { Box } from '@mui/material'

interface MapProps {
  mapUrl: string | null
}

const Map: React.FC<MapProps> = ({ mapUrl }) => {
  if (!mapUrl) return null
  return (
    <Box
      sx={{ 
        borderRadius: 6,
        overflow: "hidden",
        boxShadow: "0px 0px 10px 0px #00000033",
        width: "100%",
        height: { xs: "50%", md: "100%" },
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={mapUrl}
        alt="Mapa da rota"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <img src={mapUrl} alt="Mapa da rota" width="500%" height="300%" />
    </Box>
  )
}

export default Map