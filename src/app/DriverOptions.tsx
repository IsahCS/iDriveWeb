import React from "react";
import { List, ListItem, ListItemText, Button, Typography, Divider, Box, Rating } from "@mui/material";
import { DriverOption, EstimateResponse } from "./interface";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

interface DriverOptionsProps {
  estimate: EstimateResponse | null;
  handleConfirmRide: (driver: DriverOption) => void;
}

const DriverOptions: React.FC<DriverOptionsProps> = ({ estimate, handleConfirmRide }) => {
  if (!estimate) return null;

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 10px 0px #00000033",
        borderRadius: 6,
        backgroundColor: "white",
        maxHeight: "calc(100vh - 326px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ marginLeft: "10px", color: "#4D2873", padding: "10px" }}>
        <Typography color="#4D2873"
          sx={{
            fontWeight: 600,
            fontSize: "20px",
          }}
        >
          Motoristas
        </Typography>
      </Box>
      <Divider />
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
        {estimate.options.map((option, index) => (
          <React.Fragment key={option.id}>
            <Box 
              sx={{ 
                display: "flex",
                "&:hover": {
                  backgroundColor: "#FAF9FF",
                },
              }}
            >
              <ListItem 
                sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "flex-start", 
                  width: "85%",
                }}
              >
                <Box sx={{ display: "flex", overflow: "auto" }}>
                  <PermIdentityIcon sx={{ marginRight: 1, color: "#4D2873" }} />
                  <Typography color="#4D2873" >{option.name}</Typography>
                </Box>
                <ListItemText
                  primary={null}
                  secondary={
                    <>
                      <Typography color="text.primary">
                        {option.description}
                      </Typography>
                      <Typography>
                        Veículo: {option.vehicle}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography>
                          {option.review.rating}
                        </Typography>
                        <Rating value={option.review.rating} readOnly size="small" />
                      </Box>
                      <Typography>
                        Comentário: {option.review.comment}
                      </Typography>
                      <Typography color="black">
                        R$: {option.value}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Button
                onClick={() => handleConfirmRide(option)}
                sx={{
                  mt: 2,
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
                Escolher
              </Button>
            </Box>
            {index < estimate.options.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default DriverOptions;