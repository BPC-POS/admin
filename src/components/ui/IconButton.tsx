import { IconButton as MUIIconButton } from '@mui/material';

interface IconButtonProps extends React.ComponentProps<typeof MUIIconButton> {}

const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
    return (
        <MUIIconButton {...props}>
            {children}
        </MUIIconButton>
    );
};

export default IconButton;