import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import axios from "axios";
import DriverOptions from "./DriverOptions";
import Map from "./Map";
import UserForm from "./UseForm";
import { EstimateResponse, ConfirmRideRequest, DriverOption } from "./interface";
import { toast } from 'react-toastify';
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const placesLibrary: Libraries = ["places"];
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [mapUrl, setMapUrl] = useState<string>(
    `https://maps.googleapis.com/maps/api/staticmap?size=1000x800&scale=2&center=-23.55052,-46.633308&zoom=13&key=${googleMapsApiKey}`
  );

  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: placesLibrary,
  });

  const onLoadOrigin = (autocomplete: google.maps.places.Autocomplete) => {
    originAutocompleteRef.current = autocomplete;
  };

  const onLoadDestination = (autocomplete: google.maps.places.Autocomplete) => {
    destinationAutocompleteRef.current = autocomplete;
  };

  const onPlaceChangedOrigin = () => {
    if (originAutocompleteRef.current) {
      const place = originAutocompleteRef.current.getPlace();
      if (!place || !place.geometry) {
        console.error("Nenhum resultado encontrado ou resultado inválido.");
        return;
      }
      setOriginAddress(place.formatted_address || "");
    }
  };

  const onPlaceChangedDestination = () => {
    if (destinationAutocompleteRef.current) {
      const place = destinationAutocompleteRef.current.getPlace();
      if (!place || !place.geometry) {
        console.error("Nenhum resultado encontrado ou resultado inválido.");
        return;
      }
      setDestinationAddress(place.formatted_address || "");
    }
  };

  const handleEstimate = async () => {
    try {
      const response = await axios.post("http://localhost:8080/ride/estimate", {
        customer_id: userId,
        origin: originAddress,
        destination: destinationAddress,
      });
      setEstimate(response.data);
      const { origin, destination } = response.data;
      const newMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=1000x800&scale=2&path=color:0x0000ff|weight:5|${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}&markers=color:green|label:A|${origin.latitude},${origin.longitude}&markers=color:red|label:B|${destination.latitude},${destination.longitude}&key=${googleMapsApiKey}`;
      setMapUrl(newMapUrl);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(<span>{error.response.data.error_message}<br />{error.response.data.error}</span>);
      } else {
        toast.error("Erro ao fazer a requisição." + error);
      }
    }
  };

  const handleConfirmRide = async (driver: DriverOption) => {
    if (!estimate) return;

    const confirmRideRequest: ConfirmRideRequest = {
      customer_id: userId,
      origin: originAddress,
      destination: destinationAddress,
      distance: estimate.distance,
      duration: estimate.duration,
      driver: {
        id: driver.id,
        name: driver.name,
      },
      value: driver.value,
    };

    try {
      await axios.patch("http://localhost:8080/ride/confirm", confirmRideRequest);
      toast.success("Viagem confirmada com sucesso!");
      navigate("/ride-history");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(<span>{error.response.data.error_message}<br />{error.response.data.error}</span>);
      } else {
        console.error("Erro ao confirmar a viagem:", error);
      }
    }
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fbf6ff", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "50%", padding: "20px" }}>
        <UserForm
          userId={userId}
          setUserId={setUserId}
          originAddress={originAddress}
          setOriginAddress={setOriginAddress}
          destinationAddress={destinationAddress}
          setDestinationAddress={setDestinationAddress}
          onLoadOrigin={onLoadOrigin}
          onLoadDestination={onLoadDestination}
          onPlaceChangedOrigin={onPlaceChangedOrigin}
          onPlaceChangedDestination={onPlaceChangedDestination}
          handleEstimate={handleEstimate}
        />
        <Box 
          sx={{ 
            paddingTop: "20px",
          }}
        >
          <DriverOptions estimate={estimate} handleConfirmRide={handleConfirmRide} />
        </Box>
      </Box>
      <Box
        sx={{
          width: "50%",
          height: "100vh",
          position: "relative",
          padding: "20px",
        }}
      >
        <Map mapUrl={mapUrl} />
      </Box>
    </Box>
  );
};

export default Dashboard;