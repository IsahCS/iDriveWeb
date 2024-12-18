import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Select, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { CustomAxiosError, Driver, Errors, Ride } from "./interface";

const RideHistory = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCustomerId = queryParams.get("customer_id") || "";
  const initialDriverId = queryParams.get("driver_id") || "all";

  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [driverId, setDriverId] = useState(initialDriverId);
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [errors, setErrors] = useState({ customerId: false });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get<Driver[]>(`${import.meta.env.VITE_URL_BACKEND}/drivers`);
        setDrivers(response.data);
      } catch (error) {
        console.error("Erro ao buscar motoristas:", error);
      }
    };

    fetchDrivers();
  }, []);

  const fetchRideHistory = async (customerId: string, driverId: string) => {
    try {
      const url = `${import.meta.env.VITE_URL_BACKEND}/ride/${customerId}`;
      const params = driverId !== "all" ? { driver_id: driverId } : {};
      const response = await axios.get<{ customer_id: string; rides: Ride[] }>(url, { params });
      setRides(response.data.rides);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as CustomAxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 404) {
            toast.error(axiosError.response.data.error_description);
            setRides([]);
          } else if (axiosError.response.status === 400) {
            toast.error(React.createElement("span", null, axiosError.response.data.error_message, React.createElement("br"), axiosError.response.data.error));
            setRides([]);
          }
        }
      } else {
        console.error("Erro ao buscar histórico de viagens:", error);
      }
    }
  };

  const handleFilter = () => {
    const hasErrors = !customerId.trim();
    setErrors({ customerId: hasErrors });
    fetchRideHistory(customerId, driverId);
  };

  const formatDuration = (duration: string) => {
    const durationInSeconds = parseInt(duration.split("s")[0], 10);
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours > 0 ? `${hours} hrs ` : ""}${minutes} mins`;
  };

  const formatDistance = (distance: number) => {
    return `${(distance / 1000).toFixed(2)} km`;
  };

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 10px 0px #00000033",
        borderRadius: 6,
        backgroundColor: "white",
        maxHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        margin: "auto",
        mt: 5,
        maxWidth: 600,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#4D2873" }}>
        Histórico de Viagens
      </Typography>
      <TextField
        label="Usuário"
        value={customerId}
        onChange={(e) => {
          setCustomerId(e.target.value);
          if (e.target.value.trim()) {
            setErrors((prevErrors: Errors) => ({ ...prevErrors, customerId: false }));
          }
        }}
        fullWidth
        sx={{ mb: 2 }}
        error={errors.customerId}
        InputProps={{
          sx: {
            borderRadius: 6,
          },
        }}
      />
      <Select
        value={driverId}
        onChange={(e) => setDriverId(e.target.value as string)}
        fullWidth
        displayEmpty
        sx={{ mb: 2, borderRadius: 6 }}
      >
        <MenuItem value="all">Todos os Motoristas</MenuItem>
        {drivers.map((driver: Driver) => (
          <MenuItem key={driver.id} value={driver.id}>
            {driver.name}
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        color="primary"
        onClick={handleFilter}
        fullWidth
        sx={{
          mb: 2,
          backgroundColor: "#6153A2",
          borderRadius: 6,
          height: "45px",
          color: "white",
          textTransform: "none",
          padding: "10px 20px",
          "&:hover": {
            backgroundColor: "#4D2873",
          },
        }}
      >
        Aplicar Filtro
      </Button>
      <List
        sx={{
          overflowY: "auto",
          padding: 0,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4D2873",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        {rides.map((ride: Ride) => (
          <React.Fragment key={ride.id}>
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ color: "#4D2873", fontSize: "18px" }}>
                      {ride.driver.name}
                    </Typography>
                    <Typography component="span" sx={{ display: "flex", alignItems: "center", color: "grey", fontSize: "15px" }}>
                      <WatchLaterIcon sx={{ fontSize: "13px", marginRight: 1 }} />
                      {new Date(ride.date).toLocaleString()}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography>Origem: {ride.origin}</Typography>
                    <Typography>Destino: {ride.destination}</Typography>
                    <Typography>Distância: {formatDistance(ride.distance)}</Typography>
                    <Typography>Tempo: {formatDuration(ride.duration)}</Typography>
                    <Typography>Valor: R$ {ride.value.toFixed(2)}</Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RideHistory;