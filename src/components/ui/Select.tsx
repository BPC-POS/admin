import {
    FormControl,
    InputLabel,
    Select as MUISelect,
    MenuItem,
    SelectChangeEvent,
    OutlinedInput,
  } from "@mui/material";
  import React from "react";
  
  interface SelectOption<T> {
    value: T;
    label: string;
  }
  
  interface SelectProps<T>
    extends Omit<React.ComponentProps<typeof MUISelect>, "value" | "onChange"> {
    label: string;
    options: SelectOption<T>[];
    value?: T | null;
    labelColor?: string;
    onChange?: (value: T | null) => void;
  }
  
  const Select = <T extends string | number = string>({
    label,
    options,
    value,
    onChange,
    labelColor,
    ...props
  }: SelectProps<T>) => {
    const handleChange = (event: SelectChangeEvent<T>) => {
      if (onChange) {
        onChange(event.target.value as T);
      }
    };
  
    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel
          id={`${label}-label`}
          sx={{
            color: "white",
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
          }}
        >
          {label}
        </InputLabel>
        <MUISelect
          {...props}
          value={value}
        //   onChange={handleChange}
          labelId={`${label}-label`}
          size="medium"
          input={<OutlinedInput label={label} />}
          sx={{
            borderRadius: 8,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ddd",
                borderRadius: 8,
                fontFamily: 'Poppins',
              },
              "&:hover fieldset": {
                borderColor: "#bbb",
                fontFamily: 'Poppins',
              },
              "&.Mui-focused fieldset": {
                borderColor: "#aaa",
                 fontFamily: 'Poppins',
              },
              "& .MuiSelect-select": {
                color: "white",
                 fontFamily: 'Poppins',
              },
            },
            "& .MuiSvgIcon-root": {
              color: 'white'
            }
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MUISelect>
      </FormControl>
    );
  };
  
  export default Select;