import { Button as MUIButton } from "@mui/material";
import React from "react";

const Button: React.FC<React.ComponentProps<typeof MUIButton>> = ({ children, ...props }) => {
  return (
    <MUIButton
      {...props}
      variant="contained"
      sx={{
        fontWeight: 900,
        textTransform: "none",
        borderRadius: 8,
        ":hover": {
          backgroundColor: "rgba(0,0,0,0.1)",
        },
      }}
    >
      {children}
    </MUIButton>
  );
};

export default Button;