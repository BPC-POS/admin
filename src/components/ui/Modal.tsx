import { Box, Modal, Typography } from "@mui/material"
import style from "styled-jsx/style"
import { useState } from "react"

const ModalDialog = () => {
    const [open, ] = useState(false);
    return(
        <Modal
        open={open}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
        </Box>
        </Modal>
    )
}

export default ModalDialog;