import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField, useTheme, Snackbar, Alert, FormLabel, RadioGroup, FormControlLabel, Radio  } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FilledInput from '@mui/material/FilledInput';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { tokens } from "../../theme";
import * as Yup from 'yup';
import { useEffect } from 'react';

dayjs.locale('es');

const CrearPaciente = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navegar = useNavigate();
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openMissingFieldsSnackbar, setOpenMissingFieldsSnackbar] = useState(false); // Nuevo Snackbar

  const location = useLocation();
  const { editMode, pacienteData } = location.state || { editMode: false, pacienteData: null };

  const [estadoCivilOptions, setEstadoCivilOptions] = useState([]);

    // Obtener los estados civiles desde la API
    useEffect(() => {
      const fetchEstadoCivil = async () => {
        try {
          const response = await fetch('https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/getEstadoCivil', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
    
          if (!response.ok) {
            throw new Error('Error al obtener los estados civiles');
          }
          const data = await response.json();
    
          // Transformar el array de arrays a un array de objetos
          const transformedData = data.map(({ id_estado_civil, nombre_estado_civil }) => ({
            id: id_estado_civil,
            nombre: nombre_estado_civil,
          }));
    
          setEstadoCivilOptions(transformedData);  // Almacenar en el estado
        } catch (error) {
          console.error('Error al fetch:', error);
        }
      };
    
      fetchEstadoCivil();
    }, []);
  
  const initialValues = editMode ? {
    Nombre: pacienteData.Nombre,
    Apellido: pacienteData.Apellido,
    Apellido2: pacienteData.Apellido2,
    Cedula: pacienteData.Cedula,
    Fecha_Nacimiento: dayjs(pacienteData.Fecha_Nacimiento),
    Celular: pacienteData.Celular,
    Residencia: pacienteData.Residencia,
    Correo_Electronico: pacienteData.Correo_Electronico,
    Ocupacion: pacienteData.Ocupacion,
    Fecha_Registro: dayjs(pacienteData.Fecha_Registro),
    id_estado_civil: pacienteData.id_estado_civil,
  } : {
    Nombre: "",
    Apellido: "",
    Apellido2: "",
    Cedula: "",
    Fecha_Nacimiento: dayjs(),
    Peso: "",
    Residencia: "",
    Correo_Electronico: "",
    Ocupacion: "",
    Fecha_Registro: dayjs(),
    id_estado_civil: '',
  };

// Define the validation schema for the patient form
const checkoutSchema = Yup.object().shape({
  Nombre: Yup.string().required('Nombre es requerido'),
  Apellido: Yup.string().required('Apellido es requerido'),
  Apellido2: Yup.string().required('Segundo Apellido es requerido'),
  Cedula: Yup.string().required('Cédula es requerida'),
  Fecha_Nacimiento: Yup.date().required('Fecha de Nacimiento es requerida'),
  Celular: Yup.number().required('Numero celular es requerido').positive(),
  Residencia: Yup.string().required('Residencia es requerida'),
  Correo_Electronico: Yup.string().email('Correo Electrónico inválido').required('Correo Electrónico es requerido'),
  Ocupacion: Yup.string().required('Ocupación es requerida'),
  Fecha_Registro: Yup.date().required('Fecha de Registro es requerida'),
  id_estado_civil: Yup.number().required('Estado Civil es requerido'),
});

const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
  const formattedFechaRegistro = values.Fecha_Registro ? values.Fecha_Registro.format('YYYY-MM-DD') : null;
  const formattedFechaNa = values.Fecha_Nacimiento ? dayjs(values.Fecha_Nacimiento).format('YYYY-MM-DD') : null;
  const formattedEstadoCivil = values.id_estado_civil ? String(values.id_estado_civil) : null;



  const dataNueva = {
    nombre_paciente: values.Nombre,
    primer_apellido_paciente: values.Apellido,
    segundo_apellido_paciente: values.Apellido2,
    fecha_nacimiento_paciente: formattedFechaNa,
    fecha_registro_paciente: formattedFechaRegistro,
    identificacion_paciente: values.Cedula,
    id_estado_civil: formattedEstadoCivil,
    ocupacion_paciente: values.Ocupacion,
    lugar_residencia_paciente: values.Residencia,
    numero_celular_paciente: values.Celular,
    correo_electronico_paciente: values.Correo_Electronico
  };

  console.log("Datos a enviar:", dataNueva);  // Solo para depuración
  setSubmitting(true);
    
  try {
    const respuesta = await fetch('https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/createPacientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataNueva),
    });
    
    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }

  // Verificar el tipo de contenido de la respuesta
  const contentType = respuesta.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await respuesta.json(); // Si es JSON, analizar como JSON
  } else {
    data = await respuesta.text(); // Si no es JSON, leerlo como texto
  }

  // Manejar la respuesta según el contenido
  if (typeof data === 'string' && data.includes('se agregó')) {
    setOpenSuccessSnackbar(true);
    resetForm();
    // Retrasar la navegación para permitir que el Snackbar se muestre
    setTimeout(() => {
      navegar('/pacientes');
    }, 4000); // 4 segundos de retraso
  } else {
    console.error('Error en la respuesta del servidor:', data);
    setOpenErrorSnackbar(true);
  }

} catch (error) {
  // Mostrar detalles del error
  console.error('Error al enviar datos al servidor:', error.message || error);
  setOpenErrorSnackbar(true);
}

setSubmitting(false);
};

  return (
    
  <Box m="20px">
    <Box 
      mt={3} 
      display="flex" 
      justifyContent="flex-end" 
      alignItems="center" 
      sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        padding: '10px'
          }}
      >

      </Box>
    <Header title={editMode ? "Editar Paciente" : "Crear Paciente"} subtitle={editMode ? "Actualiza la información del paciente" : "Agregar nuevo paciente a la base de datos"} />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isValid,
          dirty
        }) => (
          <form onSubmit={handleSubmit}>
            <Box   mt={3}>
              <h2>Información General</h2>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                <TextField
                  id="Nombre-input"
                  fullWidth
                  variant="filled"
                  label="Nombre"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Nombre || ''}
                  name="Nombre"
                  error={!!touched.Nombre && !!errors.Nombre}
                  helperText={touched.Nombre && errors.Nombre}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  id="Apellido-input"
                  fullWidth
                  variant="filled"
                  label="Apellido"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Apellido || ''}
                  name="Apellido"
                  error={!!touched.Apellido && !!errors.Apellido}
                  helperText={touched.Apellido && errors.Apellido}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  id="Apellido2-input"
                  fullWidth
                  variant="filled"
                  label="Segundo Apellido"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Apellido2 || ''}
                  name="Apellido2"
                  error={!!touched.Apellido2 && !!errors.Apellido2}
                  helperText={touched.Apellido2 && errors.Apellido2}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  id="Cedula-input"
                  fullWidth
                  variant="filled"
                  label="Cédula"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Cedula || ''}
                  name="Cedula"
                  error={!!touched.Cedula && !!errors.Cedula}
                  helperText={touched.Cedula && errors.Cedula}
                  sx={{ gridColumn: "span 1" }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="Fecha_Nacimiento-input"
                    label="Fecha de Nacimiento"
                    value={values.Fecha_Nacimiento || ''}
                    onChange={(newValue) => {
                      setFieldValue("Fecha_Nacimiento", newValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 1" }} />}
                  />
                </LocalizationProvider>
                <TextField
                  id="Celular-input"
                  fullWidth
                  variant="filled"
                  label="Numero celular"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Celular || ''}
                  name="Celular"
                  error={!!touched.Celular && !!errors.Celular}
                  helperText={touched.Celular && errors.Celular}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  id="Residencia-input"
                  fullWidth
                  variant="filled"
                  label="Residencia"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Residencia || ''}
                  name="Residencia"
                  error={!!touched.Residencia && !!errors.Residencia}
                  helperText={touched.Residencia && errors.Residencia}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  id="Correo_Electronico-input"
                  fullWidth
                  variant="filled"
                  label="Correo Electrónico"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Correo_Electronico || ''}
                  name="Correo_Electronico"
                  error={!!touched.Correo_Electronico && !!errors.Correo_Electronico}
                  helperText={touched.Correo_Electronico && errors.Correo_Electronico}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  id="Ocupacion-input"
                  fullWidth
                  variant="filled"
                  label="Ocupación"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Ocupacion || ''}
                  name="Ocupacion"
                  error={!!touched.Ocupacion && !!errors.Ocupacion}
                  helperText={touched.Ocupacion && errors.Ocupacion}
                  sx={{ gridColumn: "span 2" }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    id="Fecha_Registro-input"
                    label="Fecha de Registro"
                    value={values.Fecha_Registro || ''}
                    onChange={(newValue) => {
                      setFieldValue("Fecha_Registro", newValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 2" }} />}
                  />
                </LocalizationProvider>
                {/* Dropdown for Estado Civil */}
                <FormControl variant="filled" sx={{ gridColumn: "span 1" }}>
                <InputLabel id="estado-civil-label">Estado Civil</InputLabel>
                <Select
                  labelId="estado-civil-label"
                  id="id_estado_civil-select"
                  value={values.id_estado_civil || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="id_estado_civil"
                  error={!!touched.id_estado_civil && !!errors.id_estado_civil}
                >
                  {estadoCivilOptions.map((estadoCivil) => (
                    <MenuItem key={estadoCivil.id} value={estadoCivil.id}>
                      {estadoCivil.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {touched.id_estado_civil && errors.id_estado_civil && (
                  <FormHelperText error>{errors.id_estado_civil}</FormHelperText>
                )}
              </FormControl>
              </Box>
              {/* Botones y Snackbars */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt="40px">
                <Button
                  onClick={() => navegar('/pacientes')}
                  sx={{
                    backgroundColor: colors.redAccent[500],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    minWidth: "160px",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#868dfb",
                      "& .MuiSvgIcon-root": {
                        transform: "scale(1.2)",
                        color: colors.grey[100],
                      }
                    }
                  }}
                >
                  <ArrowBackOutlinedIcon 
                    sx={{ 
                      mr: "10px",
                      transition: "transform 0.3s ease-in-out"
                    }} 
                  />
                  Regresar
                </Button>
                <Button
                  type="button" // Cambiado de "submit" a "button"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    if (isValid && dirty) {
                      handleSubmit(); // Enviar el formulario si es válido
                    } else {
                      setOpenMissingFieldsSnackbar(true); // Mostrar Snackbar si falta información
                    }
                  }}
                  sx={{
                    backgroundColor: isValid && dirty ? colors.greenAccent[500] : colors.grey[400], // Cambiar color según validez
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    transition: "all 0.3s ease-in-out",
                    minWidth: "160px",
                    cursor: isValid && dirty ? 'pointer' : 'not-allowed', // Cambiar cursor según validez
                    "&:hover": {
                      backgroundColor: isValid && dirty ? "#868dfb" : colors.grey[400], // Solo cambiar si es válido
                      "& .MuiSvgIcon-root": {
                        transform: isValid && dirty ? "scale(1.2)" : "scale(1)",
                        color: colors.grey[100],
                      }
                    }
                  }}
                >
                  <AddCircleOutlinedIcon 
                    sx={{ 
                      mr: "10px",
                      transition: "transform 0.3s ease-in-out"
                    }} 
                  />
                  {editMode ? "Actualizar Paciente" : "Crear Nuevo Paciente"}
                </Button>
              </Box>
            </Box>
            
              {/* Snackbars */}
            <Snackbar
              open={openErrorSnackbar}
              autoHideDuration={8000}
              onClose={() => setOpenErrorSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert severity="error" sx={{ width: '100%' }}>
                Error al enviar los datos. Inténtelo de nuevo.
              </Alert>
            </Snackbar>

            <Snackbar
              open={openMissingFieldsSnackbar}
              autoHideDuration={8000}
              onClose={() => setOpenMissingFieldsSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert severity="warning" sx={{ width: '100%' }}>
                Faltan campos obligatorios por completar.
              </Alert>
            </Snackbar>

            <Snackbar
              open={openSuccessSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSuccessSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert severity="success" sx={{ width: '100%' }}>
                Paciente creado exitosamente.
              </Alert>
            </Snackbar>
          </form>
        )}
      </Formik>
    </Box>
  );
};
export default CrearPaciente;
