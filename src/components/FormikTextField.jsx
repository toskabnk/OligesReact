import { TextField } from "@mui/material";

const FormikTextField = ({ id, type, label, required=false, fullWidth, formik, sx=null, disabled=false}) => {
    return (
        <TextField 
            margin='normal' 
            id={id} 
            type={type} 
            label={label} 
            sx={sx}
            required={required} 
            fullWidth={fullWidth} 
            disabled={disabled}
            onBlur={formik.handleBlur} 
            error={formik.touched[id] && Boolean(formik.errors[id])} 
            value={formik.values[id]} 
            onChange={formik.handleChange} 
            helperText={formik.touched[id] && formik.errors[id]}
        />
    );
}

export default FormikTextField;