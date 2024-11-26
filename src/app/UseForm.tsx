import React from 'react'
import { Box, TextField, Button, InputAdornment } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import { Autocomplete } from '@react-google-maps/api'
import PersonIcon from '@mui/icons-material/Person'

interface UserFormProps {
  userId: string
  setUserId: (value: string) => void
  originAddress: string
  setOriginAddress: (value: string) => void
  destinationAddress: string
  setDestinationAddress: (value: string) => void
  onLoadOrigin: (autocomplete: google.maps.places.Autocomplete) => void
  onLoadDestination: (autocomplete: google.maps.places.Autocomplete) => void
  onPlaceChangedOrigin: () => void
  onPlaceChangedDestination: () => void
  handleEstimate: () => void
}

const UserForm: React.FC<UserFormProps> = ({
  userId,
  setUserId,
  originAddress,
  setOriginAddress,
  destinationAddress,
  setDestinationAddress,
  onLoadOrigin,
  onLoadDestination,
  onPlaceChangedOrigin,
  onPlaceChangedDestination,
  handleEstimate,
}) => {
  return (
    <Box
      sx={{
        borderRadius: 6,
        backgroundColor: "#C5BDEB",
        padding: 2,
        boxShadow: "0px 0px 10px 0px #00000033",
      }}
    >
      <TextField
        placeholder="Id do usuário"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 6,
            height: "45px",
            backgroundColor: "white",
            ".MuiInputBase-input": {
              color: "#4D2873",
            },
          },
        }}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <Autocomplete onPlaceChanged={onPlaceChangedOrigin} onLoad={onLoadOrigin}>
          <TextField
            placeholder="Origem"
            value={originAddress}
            onChange={(e) => setOriginAddress(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MyLocationIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 6,
                height: "45px",
                backgroundColor: "white",
                ".MuiInputBase-input": {
                  color: "#4D2873",
                },
              },
            }}
          />
        </Autocomplete>
        <Autocomplete onPlaceChanged={onPlaceChangedDestination} onLoad={onLoadDestination}>
          <TextField
            placeholder="Destino"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationSearchingIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 6,
                height: "45px",
                backgroundColor: "white",
                ".MuiInputBase-input": {
                  color: "4D2873",
                },
              },
            }}
          />
        </Autocomplete>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={handleEstimate}
          sx={{
            mt: 2,
            backgroundColor: '#6153A2',
            borderRadius: 6,
            height: '45px',
            color: 'white',
            textTransform: 'none',
            padding: '10px 20px',
            "&:hover": {
              backgroundColor: '#4D2873',
            },
          }}
        >
          Estimar Valor da Viagem
        </Button>
      </Box>
    </Box>
  )
}

export default UserForm