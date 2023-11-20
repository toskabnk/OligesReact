import { Button } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CollapsableCardComponent from "../CollapsableCardComponent";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const EditCardComponent = ({children, title, info, open, setOpen, error, isLoading}) => {

    return (
        <CollapsableCardComponent
            title={title}
            open={open}
            setOpen={setOpen}
            icon={<AccountCircleIcon />}>
                <form onSubmit={info.handleSubmit}>
                            {children}
                            <LoadingButton
                                loading={isLoading}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                disabled={error}
                                variant="contained" 
                                type="submit"
                                color="primary" 
                                style={{ 
                                    marginLeft: "auto", 
                                    marginRight: "auto", 
                                    marginTop: "10px", 
                                    display: "flex"
                                }}
                                >{isLoading ? 'Updating...' : 'Update'}</LoadingButton>
                </form>
        </CollapsableCardComponent>
    )
}

export default EditCardComponent











