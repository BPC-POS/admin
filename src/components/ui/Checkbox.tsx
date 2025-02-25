import { FormControlLabel, Checkbox as MUICheckbox } from "@mui/material";
import React from "react";

const Checkbox: React.FC<React.ComponentProps<typeof MUICheckbox>> = ({ ...props }) => {
  return (
    <FormControlLabel
      control={
        <MUICheckbox
          {...props}
          size="small"
          sx={{
            color: "white",
            "&.Mui-checked": {
              color: "white",
            },
          }}
        />
      }
      label={undefined}
      style={{
        color: "white",
      }}
    />
  );
};

export default Checkbox;