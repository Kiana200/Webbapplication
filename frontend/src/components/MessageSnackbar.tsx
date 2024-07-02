import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert }  from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeSnackbar } from '@/redux/slices/auth';

const MessageSnackbar: React.FunctionComponent= () =>  {
    const dispatch = useAppDispatch();

    const { snackbarMessage, open, severity } = useAppSelector(state => state.persistedReducers.auth);

    function handleClose() {
        dispatch(closeSnackbar());
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
        >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {snackbarMessage}
        </Alert>
        </Snackbar>
    );
}
export default MessageSnackbar;