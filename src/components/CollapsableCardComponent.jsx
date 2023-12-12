import { Card, CardContent, CardHeader, Collapse, IconButton } from "@mui/material"
import KeyboardArrowDownIcon from  "@mui/icons-material/KeyboardArrowDown"; 
import KeyboardArrowUpIcon from  "@mui/icons-material/KeyboardArrowUp";


const CollapsableCardComponent = ({ title, children, open, setOpen, icon }) => {
    return (
        <Card sx={{ 
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            minWidth: 300, 
            width: '80%',
            border: "1px solid rgba(211,211,211,0.6)"
        }}> 
            <CardHeader 
                avatar={icon}
                title={title}
                action={ 
                    <IconButton
                        onClick={() => setOpen(!open)} 
                        aria-label="expand"
                        size="small"
                    > 
                        {open ? <KeyboardArrowUpIcon /> 
                            : <KeyboardArrowDownIcon />} 
                    </IconButton> 
                } 
            ></CardHeader> 
            <div style={{  
                backgroundColor: "rgba(194, 194, 194, 0.4)" 
            }}> 
                <Collapse in={open} timeout="auto"
                    > 
                    <CardContent> 
                        {children}
                    </CardContent> 
                </Collapse> 
            </div> 
        </Card>
    )
}

export default CollapsableCardComponent