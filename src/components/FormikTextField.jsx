import { TextField } from "@mui/material";

const FormikTextField = ({ id, type, label, required=false, fullWidth, formik }) => {
    return (
        <TextField 
            margin='normal' 
            id={id} 
            type={type} 
            label={label} 
            required={required} 
            fullWidth={fullWidth} 
            onBlur={formik.handleBlur} 
            error={formik.touched[id] && Boolean(formik.errors[id])} 
            value={formik.values[id]} 
            onChange={formik.handleChange} 
            helperText={formik.touched[id] && formik.errors[id]}
        />
    );
}

export default FormikTextField;