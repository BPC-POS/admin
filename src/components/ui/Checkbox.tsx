import { FormControlLabel, Checkbox as MUICheckbox } from "@mui/material";
import React from "react";

interface CheckboxProps extends React.ComponentProps<typeof MUICheckbox> {}

const Checkbox: React.FC<CheckboxProps> = ({ ...props }) => {
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