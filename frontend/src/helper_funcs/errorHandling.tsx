/*
    Helper function that parses the error message that is received from the payload from the backend into a more appropriate format.
*/
export const errorParser = (error: any) => {
    try {
        const status = error.response.status;
        let errorMsg;
        
        if(typeof error.response.data.error === 'string') {
            errorMsg = error.response.data.error;
        }
        else {
            errorMsg = error.response.data.error[0];
        }
        if(errorMsg === 'Rejected') { // Update error message to show something better to user.
            errorMsg = 'Something unexpected happened';
        }
         
        // Handles if something went wrong with the parsing
        if(!status && !errorMsg)
            return [500, 'Something unexpected happened']
        else if(!status)
            return [500, errorMsg]
        else if(!errorMsg)
            return [status, 'Something unexpected happened']
        else // Status and error message could be retrieved from the backend.
            return [status, errorMsg]
    }
    catch {
        return [500, 'Something unexpected happened']
    }
};