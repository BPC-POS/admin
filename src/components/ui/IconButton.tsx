import { IconButton as MUIIconButton } from '@mui/material';

const IconButton: React.FC<React.ComponentProps<typeof MUIIconButton>> = ({ children, ...props }) => {
    return (
        <MUIIconButton {...props}>
            {children}
        </MUIIconButton>
    );
};

export default IconButton;