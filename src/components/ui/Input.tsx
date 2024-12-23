import { InputAdornment, TextField } from "@mui/material";
import React from "react";

interface InputProps extends React.ComponentProps<typeof TextField> {
  label?: string;
  labelColor?: string;
  startIcon?: React.ReactNode; 
  endIcon?: React.ReactNode; 
}

const Input: React.FC<InputProps> = ({ label, labelColor, startIcon, endIcon, ...props }) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      size="medium"
      label={label}
      InputLabelProps={{
        sx: {
          color: 'white',
          fontFamily: 'Poppins',
          "&.Mui-focused": {
            color: labelColor || "white",
            fontFamily: 'Poppins',
          },
          "&.MuiInputLabel-shrink": {
              color: labelColor || "white",
               fontFamily: 'Poppins',
            },
          transition: "all 0.2s ease-in-out",
          transformOrigin: "top left",
        },
      }}
      sx={{
        width: "100%",
        borderRadius: 8,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#ddd",
            borderRadius: 8,
            fontFamily: 'Poppins'

          },
          "&:hover fieldset": {
            borderColor: "#bbb",
            fontFamily: 'Poppins'

          },
          "&.Mui-focused fieldset": {
            borderColor: "#aaa",
            fontFamily: 'Poppins'

          },
          "& input": {
            color: "white",
            fontFamily: 'Poppins'

          }
        },
      }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start" style={{color: 'white'}}> 
            {startIcon}
          </InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ) : null
      }}
    />
  );
};

export default Input;