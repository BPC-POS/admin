import { Button as MUIButton } from "@mui/material";

interface ButtonProps extends React.ComponentProps<typeof MUIButton> {}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
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