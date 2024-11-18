import * as React from 'react';
import { Box, Button, TextField, Typography, Grid,  useTheme, Snackbar, Alert, IconButton, FormControlLabel } from "@mui/material";
import { Formik, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import RadioButtons from '../../RadioButtons';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit'; 
import SaveIcon from '@mui/icons-material/Save';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'; 
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { tokens } from '../../theme';
import { Link } from "react-router-dom";

dayjs.locale('es');

const EditarPaciente = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navegar = useNavigate();
  const location = useLocation();
  const { userData } = location.state || { userData: null };
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Estados para controlar la visibilidad de los Snackbars
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  // Estados para controlar la visibilidad del diálogo de confirmación
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);


  const [initialValues, setInitialValues] = useState({
    id: userData ? userData.id :"" ,
    nombre: userData ? userData.nombre :"" ,
    primerApellido: userData ? userData.primerApellido :"",
    segundoApellido: userData ? userData.segundoApellido :"",
    dateOfBirth: userData ? userData.dateOfBirth :"",
    fecha_registro_paciente: userData ? userData.fecha_registro_paciente :"",
    identificacion_paciente: userData ? userData.identificacion_paciente :"",
    id_estado_civil: userData ? userData.id_estado_civil :"",
    ocupacion_paciente: userData ? userData.ocupacion_paciente :"",
    lugar_residencia_paciente: userData ? userData.lugar_residencia_paciente :"",
    numero_celular_paciente: userData ? userData.numero_celular_paciente :"",
    correo_electronico_paciente: userData ? userData.correo_electronico_paciente :"",
    primer_chequeo: userData ? userData.primer_chequeo :"",
    diabetes_heredofamiliar: userData ? userData.diabetes_heredofamiliar :"",
    cardiacos_heredofamiliar: userData ? userData.cardiacos_heredofamiliar :"",
    hta_heredofamiliar: userData ? userData.hta_heredofamiliar :"",
    cancer_heredofamiliar: userData ? userData.cancer_heredofamiliar :"",
    cancer_mama_heredofamiliar: userData ? userData.cancer_mama_heredofamiliar :"",
    enfermedades_mentales_heredofamiliar: userData ? userData.enfermedades_mentales_heredofamiliar :"",
    epi: userData ? userData.epi :"",
    Hepatitis: userData ? userData.Hepatitis :"",
    HTA: userData ? userData.HTA :"",
    Diabetes: userData ? userData.Diabetes :"",
    cirugias_abdominales_antecedente: userData ? userData.cirugias_abdominales_antecedente :"",
    EdadMenarca: userData ? userData.EdadMenarca :"",
    RMP: userData ? userData.RMP :"",
    id_cantidad_sangrado: userData ? userData.id_cantidad_sangrado :"",
    Dismenorrea: userData ? userData.Dismenorrea :"",
    EdadDePRS: userData ? userData.EdadDePRS :"",
    id_orientacion_sexual: userData ? userData.id_orientacion_sexual :"",
    ParejasSexuales: userData ? userData.ParejasSexuales :"",
    FRS: userData ? userData.FRS :"",
    Dispareunia: userData ? userData.Dispareunia :"",
    Libido: userData ? userData.Libido :"",
    Sangrado: userData ? userData.Sangrado :"",
    Orgasmo: userData ? userData.Orgasmo :"",
    lubricacion: userData ? userData.lubricacion :"",
    FechaPAP: userData ? userData.FechaPAP :"",
    fecha_ultima_mamografia: userData ? userData.fecha_ultima_mamografia :"",
    fecha_ultima_densitometria: userData ? userData.fecha_ultima_densitometria :"",
    fecha_ultimo_ultrasonido_pelvico: userData ? userData.fecha_ultimo_ultrasonido_pelvico :"",
    metodos_anticonceptivos_tiempo: userData ? userData.metodos_anticonceptivos_tiempo :"",
    numero_gestaciones: userData ? userData.numero_gestaciones :"",
    numero_abortos: userData ? userData.numero_abortos :"",
    numero_total_partos: userData ? userData.numero_total_partos :"",
    numero_total_embarazos: userData ? userData.numero_total_embarazos :"",
    Partos: userData ? userData.Partos :"",
    Puerperios: userData ? userData.Puerperios :"",
    lactancia: userData ? userData.lactancia :"",
    //DispareuniaFinal: '',
    fecha_ultima_menstruacion: userData ? userData.fecha_ultima_menstruacion :"",
    FechaUltimoParto: userData ? userData.FechaUltimoParto :"",
    MotivoConsulta: userData ? userData.MotivoConsulta :"",
    PA: userData ? userData.PA :"",
    Pulso: userData ? userData.Pulso :"",
    FC: userData ? userData.FC :"",
    FR: userData ? userData.FR :"",
    peso: userData ? userData.peso :"",
    altura: userData ? userData.altura :"",
    IMC: userData ? userData.IMC :"",
    CabezaCuello: userData ? userData.CabezaCuello :"",
    Torax: userData ? userData.Torax :"",
    Mamas: userData ? userData.Mamas :"",
    abdomen_examen: userData ? userData.abdomen_examen :"",
    FosasIliacas: userData ? userData.FosasIliacas :"",
    Vulva: userData ? userData.Vulva :"",
    Cuello: userData ? userData.Cuello :"",
    bulbo_uretral_skene_examen: userData ? userData.bulbo_uretral_skene_examen :"",
    Utero: userData ? userData.Utero :"",
    Perine: userData ? userData.Perine :"",
    Vagina: userData ? userData.Vagina :"",
    colposcopia_examen: userData ? userData.colposcopia_examen :"",
    anexos_uterinos_examen: userData ? userData.anexos_uterinos_examen :"",
    ResumenProblemas: userData ? userData.ResumenProblemas :"",
    PlanSeguimiento: userData ? userData.PlanSeguimiento :"",
  });

  useEffect(() => {
    if (userData) {
      console.log('User data received:', userData);
      setInitialValues({
        id_paciente: userData.id_paciente,
        nombre_paciente: userData.nombre_paciente,
        primer_apellido_paciente: userData.primer_apellido_paciente,
        segundo_apellido_paciente: userData.segundo_apellido_paciente,
        fecha_nacimiento_paciente: userData.fecha_nacimiento_paciente,
        fecha_registro_paciente: userData.fecha_registro_paciente,
        identificacion_paciente: userData.identificacion_paciente,
        id_estado_civil: userData.id_estado_civil ,
        ocupacion_paciente: userData.ocupacion_paciente,
        lugar_residencia_paciente: userData.lugar_residencia_paciente ,
        numero_celular_paciente: userData.numero_celular_paciente ,
        correo_electronico_paciente: userData.correo_electronico_paciente ,
        primer_chequeo: userData.primer_chequeo ,
        diabetes_heredofamiliar: userData.diabetes_heredofamiliar ,
        cardiacos_heredofamiliar: userData.cardiacos_heredofamiliar ,
        hta_heredofamiliar:  userData.hta_heredofamiliar ,
        cancer_heredofamiliar:  userData.cancer_heredofamiliar ,
        cancer_mama_heredofamiliar: userData.cancer_mama_heredofamiliar,
        enfermedades_mentales_heredofamiliar:  userData.enfermedades_mentales_heredofamiliar,
        epi: userData.epi ,
        Hepatitis: userData.Hepatitis,
        HTA:  userData.HTA ,
        Diabetes: userData.Diabetes ,
        cirugias_abdominales_antecedente:  userData.cirugias_abdominales_antecedente ,
        EdadMenarca: userData.EdadMenarca,
        RMP:userData.RMP ,
        id_cantidad_sangrado: userData.id_cantidad_sangrado ,
        Dismenorrea:  userData.Dismenorrea ,
        EdadDePRS:  userData.EdadDePRS ,
        id_orientacion_sexual: userData.id_orientacion_sexual,
        ParejasSexuales: userData.ParejasSexuales,
        FRS:  userData.FRS ,
        Dispareunia:  userData.Dispareunia ,
        Libido: userData.Libido ,
        Sangrado:  userData.Sangrado ,
        Orgasmo:  userData.Orgasmo ,
        lubricacion:  userData.lubricacion ,
        FechaPAP:  userData.FechaPAP ,
        fecha_ultima_mamografia: userData.fecha_ultima_mamografia ,
        fecha_ultima_densitometria: userData.fecha_ultima_densitometria ,
        fecha_ultimo_ultrasonido_pelvico:userData.fecha_ultimo_ultrasonido_pelvico ,
        metodos_anticonceptivos_tiempo:  userData.metodos_anticonceptivos_tiempo ,
        numero_gestaciones:  userData.numero_gestaciones,
        numero_abortos:  userData.numero_abortos ,
        numero_total_partos:  userData.numero_total_partos ,
        numero_total_embarazos:  userData.numero_total_embarazos,
        Partos:  userData.Partos ,
        Puerperios:  userData.Puerperios ,
        lactancia:  userData.lactancia ,
        //DispareuniaFinal: '',
        fecha_ultima_menstruacion: userData.fecha_ultima_menstruacion ,
        FechaUltimoParto:  userData.FechaUltimoParto ,
        MotivoConsulta:  userData.MotivoConsulta ,
        PA:  userData.PA ,
        Pulso:  userData.Pulso ,
        FC:  userData.FC ,
        FR:  userData.FR ,
        peso:  userData.peso,
        altura:  userData.altura ,
        IMC: userData.IMC ,
        CabezaCuello:  userData.CabezaCuello ,
        Torax: userData.Torax ,
        Mamas:  userData.Mamas ,
        abdomen_examen:  userData.abdomen_examen ,
        FosasIliacas:  userData.FosasIliacas ,
        Vulva:  userData.Vulva ,
        Cuello:  userData.Cuello ,
        bulbo_uretral_skene_examen: userData.bulbo_uretral_skene_examen ,
        Utero:  userData.Utero ,
        Perine:  userData.Perine ,
        Vagina:  userData.Vagina ,
        colposcopia_examen:  userData.colposcopia_examen ,
        anexos_uterinos_examen:  userData.anexos_uterinos_examen ,
        ResumenProblemas:  userData.ResumenProblemas ,
        PlanSeguimiento: userData.PlanSeguimiento,
      });
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) {
      // Si no se encuentran datos, puedes redireccionar o mostrar un mensaje
      console.log("No se encontraron datos del usuario");
      setSnackbarMessage("Error al cargar los datos del paciente.");
      navegar('/pacientes'); // Redirige a la lista de pacientes si `userData` es null
    } else {
      console.log('Datos del usuario recibidos:', userData);
    }
  }, [userData, navegar]);

  const [examenRealizado, setExamenRealizado] = useState(false);
  useEffect(() => {
        if (userData.primer_chequeo) {
          setExamenRealizado(true);
        } else {
          setExamenRealizado(false);
        }
  },);
  
  
  const handleFormSubmit = async (values, { setSubmitting }) => {
      console.log('Form submit started with values:', values);
      setSubmitting(true);
      try {
      // Preparar datos para la API 
      const dataActualizada = {
        id_paciente: values.id_paciente,
        nombre_paciente: values.nombre_paciente,
        primer_apellido_paciente: values.primer_apellido_paciente,
        segundo_apellido_paciente: values.segundo_apellido_paciente,
        fecha_nacimiento_paciente: values.fecha_nacimiento_paciente,
        fecha_registro_paciente: values.fecha_registro_paciente,
        identificacion_paciente: values.identificacion_paciente,
        id_estado_civil: values.id_estado_civil ,
        ocupacion_paciente: values.ocupacion_paciente,
        lugar_residencia_paciente: values.lugar_residencia_paciente ,
        numero_celular_paciente: values.numero_celular_paciente ,
        correo_electronico_paciente: values.correo_electronico_paciente ,
        primer_chequeo: values.primer_chequeo ,
        diabetes_heredofamiliar: values.diabetes_heredofamiliar ,
        cardiacos_heredofamiliar: values.cardiacos_heredofamiliar ,
        hta_heredofamiliar:  values.hta_heredofamiliar ,
        cancer_heredofamiliar:  values.cancer_heredofamiliar ,
        cancer_mama_heredofamiliar: values.cancer_mama_heredofamiliar,
        enfermedades_mentales_heredofamiliar:  values.enfermedades_mentales_heredofamiliar,
        epi: values.epi ,
        Hepatitis: values.Hepatitis,
        HTA:  values.HTA ,
        Diabetes: values.Diabetes ,
        cirugias_abdominales_antecedente:  values.cirugias_abdominales_antecedente ,
        EdadMenarca: values.EdadMenarca,
        RMP:values.RMP ,
        id_cantidad_sangrado: values.id_cantidad_sangrado ,
        Dismenorrea:  values.Dismenorrea ,
        EdadDePRS:  values.EdadDePRS ,
        id_orientacion_sexual: values.id_orientacion_sexual,
        ParejasSexuales: values.ParejasSexuales,
        FRS:  values.FRS ,
        Dispareunia:  values.Dispareunia ,
        Libido: values.Libido ,
        Sangrado:  values.Sangrado ,
        Orgasmo:  values.Orgasmo ,
        lubricacion:  values.lubricacion ,
        FechaPAP:  values.FechaPAP ,
        fecha_ultima_mamografia: values.fecha_ultima_mamografia ,
        fecha_ultima_densitometria: values.fecha_ultima_densitometria ,
        fecha_ultimo_ultrasonido_pelvico:values.fecha_ultimo_ultrasonido_pelvico ,
        metodos_anticonceptivos_tiempo:  values.metodos_anticonceptivos_tiempo ,
        numero_gestaciones:  values.numero_gestaciones,
        numero_abortos:  values.numero_abortos ,
        numero_total_partos:  values.numero_total_partos ,
        numero_total_embarazos:  values.numero_total_embarazos,
        Partos:  values.Partos ,
        Puerperios:  values.Puerperios ,
        lactancia:  values.lactancia ,
        //DispareuniaFinal: '',
        fecha_ultima_menstruacion: values.fecha_ultima_menstruacion ,
        FechaUltimoParto:  values.FechaUltimoParto ,
        MotivoConsulta:  values.MotivoConsulta ,
        PA:  values.PA ,
        Pulso:  values.Pulso ,
        FC:  values.FC ,
        FR:  values.FR ,
        peso:  values.peso,
        altura:  values.altura ,
        IMC: values.IMC ,
        CabezaCuello:  values.CabezaCuello ,
        Torax: values.Torax ,
        Mamas:  values.Mamas ,
        abdomen_examen:  values.abdomen_examen ,
        FosasIliacas:  values.FosasIliacas ,
        Vulva:  values.Vulva ,
        Cuello:  values.Cuello ,
        bulbo_uretral_skene_examen: values.bulbo_uretral_skene_examen ,
        Utero:  values.Utero ,
        Perine:  values.Perine ,
        Vagina:  values.Vagina ,
        colposcopia_examen:  values.colposcopia_examen ,
        anexos_uterinos_examen:  values.anexos_uterinos_examen ,
        ResumenProblemas:  values.ResumenProblemas ,
        PlanSeguimiento: values.PlanSeguimiento,
      };
      console.log('Datos actualizados para enviar al backend:', dataActualizada);

      const respuesta = await fetch(`https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/updatePacientes`, {
              method: 'POST',  // Cambia a PUT si tu API usa ese método para actualizaciones
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataActualizada), // Envía todos los datos, incluidos los editados y no editados
          });   
          if (respuesta.ok) {
            setSnackbarMessage("Paciente editado exitosamente.");
            setSnackbarSeverity("success");
            setOpenSuccessSnackbar(true);
            setTimeout(() => navegar('/pacientes'), 4000);
          } else {
            const errorText = await respuesta.text();
            console.log('Error del backend:', errorText);
            throw new Error(errorText || "Error al editar paciente en el backend.");
          }
        } catch (error) {
          console.error('Error al editar usuario:', error);
          setSnackbarMessage(error.message || "Error al editar paciente.");
          setSnackbarSeverity("error");
          setOpenErrorSnackbar(true);
        }
        setSubmitting(false);
      };
  
  return (

    <Box m="20px">
      <Header title="Editar Paciente" subtitle="Actualiza la información del usuario" />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        //validationSchema={CheckoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isValid,
          isSubmitting,
          dirty, // Añadido para controlar el estado de modificación
        }) => (
          <form onSubmit={handleSubmit}>
         {/* Cuadro 1: Datos generales del paciente */}
         <Box sx={{ marginBottom: '20px' }}>
        <Box ><h2>Datos generales</h2></Box>
        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }} >
        <TextField
          id="nombre_paciente-input"
          fullWidth
          variant="filled"
          label="Nombre del paciente"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.nombre_paciente || ''}
          name="nombre_paciente"
          error={!!touched.nombre_paciente && !!errors.nombre_paciente}
          helperText={touched.nombre_paciente && errors.nombre_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="primerApellido-input"
          fullWidth
          variant="filled"
          label="Primer Apellido"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.primer_apellido_paciente || ''}
          name="primerApellido"
          error={!!touched.primer_apellido_paciente && !!errors.primer_apellido_paciente}
          helperText={touched.primer_apellido_paciente && errors.primer_apellido_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="segundoApellido-input"
          fullWidth
          variant="filled"
          label="Segundo Apellido"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.segundo_apellido_paciente || ''}
          name="segundoApellido"
          error={!!touched.segundo_apellido_paciente && !!errors.segundo_apellido_paciente}
          helperText={touched.segundo_apellido_paciente && errors.segundo_apellido_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="identificacion_paciente-input"
          fullWidth
          variant="filled"
          label="Identificacion paciente"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.identificacion_paciente || ''}
          name="identificacion_paciente"
          error={!!touched.identificacion_paciente && !!errors.identificacion_paciente}
          helperText={touched.identificacion_paciente && errors.identificacion_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="dateOfBirth-input"
          fullWidth
          variant="filled"
          label="Fecha de nacimiento"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.fecha_nacimiento_paciente || ''}
          name="fecha_nacimiento_paciente"
          error={!!touched.fecha_nacimiento_paciente && !!errors.fecha_nacimiento_paciente}
          helperText={touched.fecha_nacimiento_paciente && errors.fecha_nacimiento_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="fecha_registro_paciente-input"
          fullWidth
          variant="filled"
          label="Fecha de registro"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.fecha_registro_paciente || ''}
          name="fecha_registro_paciente"
          error={!!touched.fecha_registro_paciente && !!errors.fecha_registro_paciente}
          helperText={touched.fecha_registro_paciente && errors.fecha_registro_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="ocupacion_paciente-input"
          fullWidth
          variant="filled"
          label="Ocupación"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.ocupacion_paciente || ''}
          name="ocupacion_paciente"
          error={!!touched.ocupacion_paciente && !!errors.ocupacion_paciente}
          helperText={touched.ocupacion_paciente && errors.ocupacion_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="lugar_residencia_paciente-input"
          fullWidth
          variant="filled"
          label="Lugar de residencia"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.lugar_residencia_paciente || ''}
          name="lugar_residencia_paciente"
          error={!!touched.lugar_residencia_paciente && !!errors.lugar_residencia_paciente}
          helperText={touched.lugar_residencia_paciente && errors.lugar_residencia_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="numero_celular_paciente-input"
          fullWidth
          variant="filled"
          label="Número de celular"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.numero_celular_paciente || ''}
          name="numero_celular_paciente"
          error={!!touched.numero_celular_paciente && !!errors.numero_celular_paciente}
          helperText={touched.numero_celular_paciente && errors.numero_celular_paciente}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="correo_electronico_paciente-input"
          fullWidth
          variant="filled"
          label="Correo electrónico"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.correo_electronico_paciente || ''}
          name="correo_electronico_paciente"
          error={!!touched.correo_electronico_paciente && !!errors.correo_electronico_paciente}
          helperText={touched.correo_electronico_paciente && errors.correo_electronico_paciente}
          sx={{ gridColumn: "span 1" }}
        />
        <TextField
          id="Estado civil-input"
          fullWidth
          variant="filled"
          label="Estado civil"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.id_estado_civil || ''}
          name="id_estado_civil"
          error={!!touched.id_estado_civil && !!errors.id_estado_civil}
          helperText={touched.id_estado_civil && errors.id_estado_civil}
          sx={{ gridColumn: "span 1" }}
        />

      </Box>
    </Box>
    
    <Box sx={{ marginBottom: '20px' }}>
      <Box><h2>Datos del examen médico</h2></Box>
      {/* Verifica si el paciente tiene un primer_chequeo */}
      {values ? (
      values.primer_chequeo === false ? (
      // Si primer_chequeo es false, mostramos los datos del examen médico
      <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Heredofamiliares</Typography>
      </AccordionSummary>
      <AccordionDetails>  
      <TextField
        id="diabetes_heredofamiliar-input"
        fullWidth
        variant="filled"
        label="Diabetes Heredofamiliar"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.diabetes_heredofamiliar || ''}
        name="diabetes_heredofamiliar"
        error={!!touched.diabetes_heredofamiliar && !!errors.diabetes_heredofamiliar}
        helperText={touched.diabetes_heredofamiliar && errors.diabetes_heredofamiliar}
        sx={{ gridColumn: "span 1" }}
      />
      <TextField
        id="cardiacos_heredofamiliar-input"
        fullWidth
        variant="filled"
        label="Cardiacos Heredofamiliar"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.cardiacos_heredofamiliar || ''}
        name="cardiacos_heredofamiliar"
        error={!!touched.cardiacos_heredofamiliar && !!errors.cardiacos_heredofamiliar}
        helperText={touched.cardiacos_heredofamiliar && errors.cardiacos_heredofamiliar}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="hta_heredofamiliar-input"
        fullWidth
        variant="filled"
        label="HTA Heredofamiliar"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.hta_heredofamiliar || ''}
        name="hta_heredofamiliar"
        error={!!touched.hta_heredofamiliar && !!errors.hta_heredofamiliar}
        helperText={touched.hta_heredofamiliar && errors.hta_heredofamiliar}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="cancer_heredofamiliar-input"
        fullWidth
        variant="filled"
        label="Cáncer Heredofamiliar"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.cancer_heredofamiliar || ''}
        name="cancer_heredofamiliar"
        error={!!touched.cancer_heredofamiliar && !!errors.cancer_heredofamiliar}
        helperText={touched.cancer_heredofamiliar && errors.cancer_heredofamiliar}
        sx={{ gridColumn: "span 1" }}
      />


      <TextField
        id="cancer_mama_heredofamiliar-input"
        fullWidth
        variant="filled"
        label="Cáncer de mama Heredofamiliar"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.cancer_mama_heredofamiliar || ''}
        name="cancer_mama_heredofamiliar"
        error={!!touched.cancer_mama_heredofamiliar && !!errors.cancer_mama_heredofamiliar}
        helperText={touched.cancer_mama_heredofamiliar && errors.cancer_mama_heredofamiliar}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="enfermedades_mentales_heredofamiliar-input"
        fullWidth
        variant="filled"
        label="Enfermedades Mentales Heredofamiliar"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.enfermedades_mentales_heredofamiliar || ''}
        name="enfermedades_mentales_heredofamiliar"
        error={!!touched.enfermedades_mentales_heredofamiliar && !!errors.enfermedades_mentales_heredofamiliar}
        helperText={touched.enfermedades_mentales_heredofamiliar && errors.enfermedades_mentales_heredofamiliar}
        sx={{ gridColumn: "span 1" }}
      />
        </AccordionDetails>
        </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Personales Patologicos</Typography>
      </AccordionSummary>
      <AccordionDetails>  
      <TextField
        id="epi-input"
        fullWidth
        variant="filled"
        label="EPI"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.epi || ''}
        name="epi"
        error={!!touched.epi && !!errors.epi}
        helperText={touched.epi && errors.epi}
        sx={{ gridColumn: "span 1" }}
      />
      <TextField
        id="hepatitis-input"
        fullWidth
        variant="filled"
        label="Hepatitis Patologica"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.hepatitis || ''}
        name="hepatitis"
        error={!!touched.hepatitis && !!errors.hepatitis}
        helperText={touched.hepatitis && errors.hepatitis}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="hta-input"
        fullWidth
        variant="filled"
        label="HTA patologica"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.hta || ''}
        name="hta"
        error={!!touched.hta && !!errors.hta}
        helperText={touched.hta && errors.hta}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="diabetes-input"
        fullWidth
        variant="filled"
        label="Diabetes"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.diabetes || ''}
        name="diabetes"
        error={!!touched.diabetes && !!errors.diabetes}
        helperText={touched.diabetes && errors.diabetes}
        sx={{ gridColumn: "span 1" }}
      />
      </AccordionDetails>  
      </Accordion> 

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Personales Quirurgicos</Typography>
      </AccordionSummary>
      <AccordionDetails>  
      <TextField
        id="cirugias-abdominales-antecedente-input"
        fullWidth
        variant="filled"
        label="Cirugías Abdominales"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.cirugias_abdominales_antecedente || ''}
        name="cirugias_abdominales_antecedente"
        error={!!touched.cirugias_abdominales_antecedente && !!errors.cirugias_abdominales_antecedente}
        helperText={touched.cirugias_abdominales_antecedente && errors.cirugias_abdominales_antecedente}
        sx={{ gridColumn: "span 1" }}
      />
        </AccordionDetails>
        </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Ginecológicos</Typography>
      </AccordionSummary>
      <AccordionDetails>  

      <TextField
          id="edad-menarca-ciclo-input"
          fullWidth
          variant="filled"
          label="Edad Menarca"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.edad_menarca_ciclo || ''}
          name="edad_menarca_ciclo"
          error={!!touched.edad_menarca_ciclo && !!errors.edad_menarca_ciclo}
          helperText={touched.edad_menarca_ciclo && errors.edad_menarca_ciclo}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="ritmo-menstrual-periodico-input"
          fullWidth
          variant="filled"
          label="Ritmo Menstrual"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.ritmo_menstrual_periodico || ''}
          name="ritmo_menstrual_periodico"
          error={!!touched.ritmo_menstrual_periodico && !!errors.ritmo_menstrual_periodico}
          helperText={touched.ritmo_menstrual_periodico && errors.ritmo_menstrual_periodico}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="id-cantidad-sangrado-input"
          fullWidth
          variant="filled"
          label="Cantidad Sangrado"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.id_cantidad_sangrado || ''}
          name="id_cantidad_sangrado"
          error={!!touched.id_cantidad_sangrado && !!errors.id_cantidad_sangrado}
          helperText={touched.id_cantidad_sangrado && errors.id_cantidad_sangrado}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="dismenorrea-input"
          fullWidth
          variant="filled"
          label="Dismenorrea"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.dismenorrea || ''}
          name="dismenorrea"
          error={!!touched.dismenorrea && !!errors.dismenorrea}
          helperText={touched.dismenorrea && errors.dismenorrea}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="fecha-ultima-menstruacion-input"
          fullWidth
          variant="filled"
          label="Fecha Última Menstruación"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.fecha_ultima_menstruacion || ''}
          name="fecha_ultima_menstruacion"
          error={!!touched.fecha_ultima_menstruacion && !!errors.fecha_ultima_menstruacion}
          helperText={touched.fecha_ultima_menstruacion && errors.fecha_ultima_menstruacion}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="edad-primera-relacion-sexual-input"
          fullWidth
          variant="filled"
          label="Edad Primera Relación Sexual"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.edad_primera_relacion_sexual || ''}
          name="edad_primera_relacion_sexual"
          error={!!touched.edad_primera_relacion_sexual && !!errors.edad_primera_relacion_sexual}
          helperText={touched.edad_primera_relacion_sexual && errors.edad_primera_relacion_sexual}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="id-orientacion-sexual-input"
          fullWidth
          variant="filled"
          label="Orientación Sexual"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.id_orientacion_sexual || ''}
          name="id_orientacion_sexual"
          error={!!touched.id_orientacion_sexual && !!errors.id_orientacion_sexual}
          helperText={touched.id_orientacion_sexual && errors.id_orientacion_sexual}
          sx={{ gridColumn: "span 1" }}
        />
      
        <TextField
          id="id-numero-parejas-input"
          fullWidth
          variant="filled"
          label="Número de Parejas"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.id_numero_parejas || ''}
          name="id_numero_parejas"
          error={!!touched.id_numero_parejas && !!errors.id_numero_parejas}
          helperText={touched.id_numero_parejas && errors.id_numero_parejas}
          sx={{ gridColumn: "span 1" }}
        />
      
      <TextField
        id="factores-riesgo-sexual-input"
        fullWidth
        variant="filled"
        label="Factores Riesgo Sexual"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.factores_riesgo_sexual || ''}
        name="factores_riesgo_sexual"
        error={!!touched.factores_riesgo_sexual && !!errors.factores_riesgo_sexual}
        helperText={touched.factores_riesgo_sexual && errors.factores_riesgo_sexual}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="dispareunia-input"
        fullWidth
        variant="filled"
        label="Dispareunia"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.dispareunia || ''}
        name="dispareunia"
        error={!!touched.dispareunia && !!errors.dispareunia}
        helperText={touched.dispareunia && errors.dispareunia}
        sx={{ gridColumn: "span 1" }}
      />
      <TextField
        id="sangrado-sexual-input"
        fullWidth
        variant="filled"
        label="Sangrado Sexual"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.sangrado_sexual || ''}
        name="sangrado_sexual"
        error={!!touched.sangrado_sexual && !!errors.sangrado_sexual}
        helperText={touched.sangrado_sexual && errors.sangrado_sexual}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="libido-input"
        fullWidth
        variant="filled"
        label="Libido"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.libido || ''}
        name="libido"
        error={!!touched.libido && !!errors.libido}
        helperText={touched.libido && errors.libido}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="orgasmo-input"
        fullWidth
        variant="filled"
        label="Orgasmo"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.orgasmo || ''}
        name="orgasmo"
        error={!!touched.orgasmo && !!errors.orgasmo}
        helperText={touched.orgasmo && errors.orgasmo}
        sx={{ gridColumn: "span 1" }}
      />
      <TextField
        id="lubricacion-input"
        fullWidth
        variant="filled"
        label="Lubricación"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.lubricacion || ''}
        name="lubricacion"
        error={!!touched.lubricacion && !!errors.lubricacion}
        helperText={touched.lubricacion && errors.lubricacion}
        sx={{ gridColumn: "span 1" }}
      />
      
      <TextField
        id="metodos_anticonceptivos_tiempo-input"
        fullWidth
        variant="filled"
        label="Métodos anticonceptivos (Tiempo)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.metodos_anticonceptivos_tiempo || ''}
        name="metodos_anticonceptivos_tiempo"
        error={!!touched.metodos_anticonceptivos_tiempo && !!errors.metodos_anticonceptivos_tiempo}
        helperText={touched.metodos_anticonceptivos_tiempo && errors.metodos_anticonceptivos_tiempo}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="numero_gestaciones-input"
        fullWidth
        variant="filled"
        label="Número de gestaciones"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.numero_gestaciones || ''}
        name="numero_gestaciones"
        error={!!touched.numero_gestaciones && !!errors.numero_gestaciones}
        helperText={touched.numero_gestaciones && errors.numero_gestaciones}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="numero_partos-input"
        fullWidth
        variant="filled"
        label="Número de partos"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.numero_partos || ''}
        name="numero_partos"
        error={!!touched.numero_partos && !!errors.numero_partos}
        helperText={touched.numero_partos && errors.numero_partos}
        sx={{ gridColumn: "span 1" }}
      />


      <TextField
        id="numero_abortos-input"
        fullWidth
        variant="filled"
        label="Número de abortos"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.numero_abortos || ''}
        name="numero_abortos"
        error={!!touched.numero_abortos && !!errors.numero_abortos}
        helperText={touched.numero_abortos && errors.numero_abortos}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="numero_total_embarazos-input"
        fullWidth
        variant="filled"
        label="Número total de embarazos"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.numero_total_embarazos || ''}
        name="numero_total_embarazos"
        error={!!touched.numero_total_embarazos && !!errors.numero_total_embarazos}
        helperText={touched.numero_total_embarazos && errors.numero_total_embarazos}
        sx={{ gridColumn: "span 1" }}
      />
      
      <TextField
        id="numero_total_partos-input"
        fullWidth
        variant="filled"
        label="Número total de partos"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.numero_total_partos || ''}
        name="numero_total_partos"
        error={!!touched.numero_total_partos && !!errors.numero_total_partos}
        helperText={touched.numero_total_partos && errors.numero_total_partos}
        sx={{ gridColumn: "span 1" }}
      />
      
      <TextField
        id="numero_puerperios-input"
        fullWidth
        variant="filled"
        label="Número de puerperios"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.numero_puerperios || ''}
        name="numero_puerperios"
        error={!!touched.numero_puerperios && !!errors.numero_puerperios}
        helperText={touched.numero_puerperios && errors.numero_puerperios}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="lactancia-input"
        fullWidth
        variant="filled"
        label="Lactancia"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.lactancia || ''}
        name="lactancia"
        error={!!touched.lactancia && !!errors.lactancia}
        helperText={touched.lactancia && errors.lactancia}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="fecha_ultimo_parto-input"
        fullWidth
        variant="filled"
        label="Fecha último parto"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.fecha_ultimo_parto || ''}
        name="fecha_ultimo_parto"
        error={!!touched.fecha_ultimo_parto && !!errors.fecha_ultimo_parto}
        helperText={touched.fecha_ultimo_parto && errors.fecha_ultimo_parto}
        sx={{ gridColumn: "span 1" }}
      />
      <TextField
        id="fecha_ultimo_papanicolaou-input"
        fullWidth
        variant="filled"
        label="Fecha último Papanicolaou"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.fecha_ultimo_papanicolaou || ''}
        name="fecha_ultimo_papanicolaou"
        error={!!touched.fecha_ultimo_papanicolaou && !!errors.fecha_ultimo_papanicolaou}
        helperText={touched.fecha_ultimo_papanicolaou && errors.fecha_ultimo_papanicolaou}
        sx={{ gridColumn: "span 1" }}
      />
      <TextField
        id="fecha_ultima_mamografia-input"
        fullWidth
        variant="filled"
        label="Fecha última mamografía"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.fecha_ultima_mamografia || ''}
        name="fecha_ultima_mamografia"
        error={!!touched.fecha_ultima_mamografia && !!errors.fecha_ultima_mamografia}
        helperText={touched.fecha_ultima_mamografia && errors.fecha_ultima_mamografia}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="fecha_ultima_densitometria-input"
        fullWidth
        variant="filled"
        label="Fecha última densitometría"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.fecha_ultima_densitometria || ''}
        name="fecha_ultima_densitometria"
        error={!!touched.fecha_ultima_densitometria && !!errors.fecha_ultima_densitometria}
        helperText={touched.fecha_ultima_densitometria && errors.fecha_ultima_densitometria}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
          id="fecha_ultimo_ultrasonido_pelvico-input"
          fullWidth
          variant="filled"
          label="Fecha último ultrasonido pélvico"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.fecha_ultimo_ultrasonido_pelvico || ''}
          name="fecha_ultimo_ultrasonido_pelvico"
          error={!!touched.fecha_ultimo_ultrasonido_pelvico && !!errors.fecha_ultimo_ultrasonido_pelvico}
          helperText={touched.fecha_ultimo_ultrasonido_pelvico && errors.fecha_ultimo_ultrasonido_pelvico}
          sx={{ gridColumn: "span 1" }}
      />
        </AccordionDetails>
        </Accordion>

        <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Motivo de consulta</Typography>
      </AccordionSummary>
      <AccordionDetails>  


      <TextField
      id="motivo_consulta-input"
      fullWidth
      variant="filled"
      label="Motivo consulta"
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.motivo_consulta || ''}
      name="motivo_consulta"
      />

        </AccordionDetails>
        </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Examen Físico</Typography>
      </AccordionSummary>
      <AccordionDetails>  


      <TextField
        id="presion_arterial-input"
        fullWidth
        variant="filled"
        label="Presión Arterial"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.presion_arterial || ''}
        name="presion_arterial"
        error={!!touched.presion_arterial && !!errors.presion_arterial}
        helperText={touched.presion_arterial && errors.presion_arterial}
        sx={{ gridColumn: "span 1" }}
    />
      <TextField
        id="frecuencia_pulso-input"
        fullWidth
        variant="filled"
        label="Frecuencia de Pulso"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.frecuencia_pulso || ''}
        name="frecuencia_pulso"
        error={!!touched.frecuencia_pulso && !!errors.frecuencia_pulso}
        helperText={touched.frecuencia_pulso && errors.frecuencia_pulso}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="frecuencia_cardiaca-input"
        fullWidth
        variant="filled"
        label="Frecuencia Cardiaca"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.frecuencia_cardiaca || ''}
        name="frecuencia_cardiaca"
        error={!!touched.frecuencia_cardiaca && !!errors.frecuencia_cardiaca}
        helperText={touched.frecuencia_cardiaca && errors.frecuencia_cardiaca}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="frecuencia_respiratoria-input"
        fullWidth
        variant="filled"
        label="Frecuencia Respiratoria"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.frecuencia_respiratoria || ''}
        name="frecuencia_respiratoria"
        error={!!touched.frecuencia_respiratoria && !!errors.frecuencia_respiratoria}
        helperText={touched.frecuencia_respiratoria && errors.frecuencia_respiratoria}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="peso-input"
        fullWidth
        variant="filled"
        label="Peso"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.peso || ''}
        name="peso"
        error={!!touched.peso && !!errors.peso}
        helperText={touched.peso && errors.peso}
        sx={{ gridColumn: "span 1" }}
      />

        <TextField
          id="altura-input"
          fullWidth
          variant="filled"
          label="Altura"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.altura || ''}
          name="altura"
          error={!!touched.altura && !!errors.altura}
          helperText={touched.altura && errors.altura}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="indice_masa_corporal-input"
          fullWidth
          variant="filled"
          label="Índice de Masa Corporal"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.indice_masa_corporal || ''}
          name="indice_masa_corporal"
          error={!!touched.indice_masa_corporal && !!errors.indice_masa_corporal}
          helperText={touched.indice_masa_corporal && errors.indice_masa_corporal}
          sx={{ gridColumn: "span 1" }}
        />


        <TextField
          id="cabeza_cuello_examen-input"
          fullWidth
          variant="filled"
          label="Cabeza y Cuello (Examen)"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.cabeza_cuello_examen || ''}
          name="cabeza_cuello_examen"
          error={!!touched.cabeza_cuello_examen && !!errors.cabeza_cuello_examen}
          helperText={touched.cabeza_cuello_examen && errors.cabeza_cuello_examen}
          sx={{ gridColumn: "span 1" }}
        />


        <TextField
          id="torax_examen-input"
          fullWidth
          variant="filled"
          label="Tórax (Examen)"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.torax_examen || ''}
          name="torax_examen"
          error={!!touched.torax_examen && !!errors.torax_examen}
          helperText={touched.torax_examen && errors.torax_examen}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="mamas_examen-input"
          fullWidth
          variant="filled"
          label="Mamas (Examen)"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.mamas_examen || ''}
          name="mamas_examen"
          error={!!touched.mamas_examen && !!errors.mamas_examen}
          helperText={touched.mamas_examen && errors.mamas_examen}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          id="abdomen_examen-input"
          fullWidth
          variant="filled"
          label="Abdomen (Examen)"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.abdomen_examen || ''}
          name="abdomen_examen"
          error={!!touched.abdomen_examen && !!errors.abdomen_examen}
          helperText={touched.abdomen_examen && errors.abdomen_examen}
          sx={{ gridColumn: "span 1" }}
        />


        <TextField
          id="fosas_iliacas_examen-input"
          fullWidth
          variant="filled"
          label="Fosas Ilíacas (Examen)"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.fosas_iliacas_examen || ''}
          name="fosas_iliacas_examen"
          error={!!touched.fosas_iliacas_examen && !!errors.fosas_iliacas_examen}
          helperText={touched.fosas_iliacas_examen && errors.fosas_iliacas_examen}
          sx={{ gridColumn: "span 1" }}
        />

        </AccordionDetails>
        </Accordion>

        <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Ginecológico</Typography>
      </AccordionSummary>
      <AccordionDetails>  

      <TextField
        id="vulva_examen-input"
        fullWidth
        variant="filled"
        label="Vulva (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.vulva_examen || ''}
        name="vulva_examen"
        error={!!touched.vulva_examen && !!errors.vulva_examen}
        helperText={touched.vulva_examen && errors.vulva_examen}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="cuello_uterino_examen-input"
        fullWidth
        variant="filled"
        label="Cuello Uterino (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.cuello_uterino_examen || ''}
        name="cuello_uterino_examen"
        error={!!touched.cuello_uterino_examen && !!errors.cuello_uterino_examen}
        helperText={touched.cuello_uterino_examen && errors.cuello_uterino_examen}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="bulbo_uretral_skene_examen-input"
        fullWidth
        variant="filled"
        label="Bulbo Uretral Skene (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.bulbo_uretral_skene_examen || ''}
        name="bulbo_uretral_skene_examen"
        error={!!touched.bulbo_uretral_skene_examen && !!errors.bulbo_uretral_skene_examen}
        helperText={touched.bulbo_uretral_skene_examen && errors.bulbo_uretral_skene_examen}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="utero_examen-input"
        fullWidth
        variant="filled"
        label="Útero (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.utero_examen || ''}
        name="utero_examen"
        error={!!touched.utero_examen && !!errors.utero_examen}
        helperText={touched.utero_examen && errors.utero_examen}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="perine_examen-input"
        fullWidth
        variant="filled"
        label="Perineo (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.perine_examen || ''}
        name="perine_examen"
        error={!!touched.perine_examen && !!errors.perine_examen}
        helperText={touched.perine_examen && errors.perine_examen}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="vagina_examen-input"
        fullWidth
        variant="filled"
        label="Vagina (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.vagina_examen || ''}
        name="vagina_examen"
        error={!!touched.vagina_examen && !!errors.vagina_examen}
        helperText={touched.vagina_examen && errors.vagina_examen}
        sx={{ gridColumn: "span 1" }}
      />
      <TextField
        id="colposcopia_examen-input"
        fullWidth
        variant="filled"
        label="Colposcopia (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.colposcopia_examen || ''}
        name="colposcopia_examen"
        error={!!touched.colposcopia_examen && !!errors.colposcopia_examen}
        helperText={touched.colposcopia_examen && errors.colposcopia_examen}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        id="anexos_uterinos_examen-input"
        fullWidth
        variant="filled"
        label="Anexos Uterinos (Examen)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.anexos_uterinos_examen || ''}
        name="anexos_uterinos_examen"
        error={!!touched.anexos_uterinos_examen && !!errors.anexos_uterinos_examen}
        helperText={touched.anexos_uterinos_examen && errors.anexos_uterinos_examen}
        sx={{ gridColumn: "span 1" }}
      />

      </AccordionDetails>  
      </Accordion>  

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Resumen y lista de problemas</Typography>
      </AccordionSummary>
      <AccordionDetails>  

      <TextField
        id="resumen_problemas-input"
        fullWidth
        variant="filled"
        label="Resumen de Problemas"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.resumen_problemas || ''}
        name="resumen_problemas"
        error={!!touched.resumen_problemas && !!errors.resumen_problemas}
        helperText={touched.resumen_problemas && errors.resumen_problemas}
        sx={{ gridColumn: "span 1" }}
      />

      </AccordionDetails>  
      </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Plan de seguimiento</Typography>
      </AccordionSummary>
      <AccordionDetails>  

            <TextField
        id="plan_seguimiento-input"
        fullWidth
        variant="filled"
        label="Plan de Seguimiento"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.plan_seguimiento || ''}
        name="plan_seguimiento"
        error={!!touched.plan_seguimiento && !!errors.plan_seguimiento}
        helperText={touched.plan_seguimiento && errors.plan_seguimiento}
        sx={{ gridColumn: "span 1" }}
      />
        </AccordionDetails>  
        </Accordion>
        </Box>
          ) : (
            // Si primer_chequeo es true, mostramos el mensaje de error
            <Box>
            {!examenRealizado && (
            <Box sx={{ marginTop: '10px', color: 'red', textAlign: 'center' }}>
            Este usuario no se le ha realizado el examen médico, es necesario realizar primero un examen médico antes de guardar cambios.
            </Box>
            )}
            </Box>
          )
        ) : (
          // Mientras se cargan los datos
          <Typography>Cargando datos...</Typography>
        )}
      </Box>
      <Box display="flex" justifyContent="space-between" mt="20px">
              {/* Botón de Regresar (Opcional) */}
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
              {/* Botón Crear Examen Médico */}
                <Link 
                  to={{
                    pathname: '/form/crearExamen', 
                  }}
                  state={{
                    userData: initialValues
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    sx={{
                      backgroundColor: colors.blueAccent[500],
                      color: colors.grey[100],
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      minWidth: "200px",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#6fb3f5",
                        "& .MuiSvgIcon-root": {
                          transform: "scale(1.2)",
                          color: colors.grey[100],
                        },
                      },
                    }}
                  >
                    <AddCircleOutlineOutlinedIcon
                      sx={{
                        mr: "10px",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    />
                    Crear Examen Médico
                  </Button>
                </Link>
              {/* Botón Guardar Cambios */}
              <Button
                type="submit"
                disabled={isSubmitting || !dirty || !isValid} // Actualizado aquí
                sx={{
                  backgroundColor: colors.greenAccent[500],
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
                  },
                  "&:disabled": {
                    backgroundColor: colors.grey[500],
                    color: colors.grey[100],
                  }
                }}
              >
                <SaveAsOutlinedIcon 
                  sx={{ 
                    mr: "10px",
                    transition: "transform 0.3s ease-in-out"
                  }} 
                />
                Guardar Cambios
              </Button>
            </Box>
            {/* Snackbars */}
            <Snackbar 
              open={openSuccessSnackbar} 
              autoHideDuration={6000} 
              onClose={() => setOpenSuccessSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                onClose={() => setOpenSuccessSnackbar(false)} 
                severity={snackbarSeverity} 
                sx={{ 
                  width: '100%', 
                  fontSize: '1.2em', 
                  backgroundColor: snackbarSeverity === "success" ? '#d4edda' : '#f8d7da', 
                  color: snackbarSeverity === "success" ? '#155724' : '#721c24' 
                }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <Snackbar 
              open={openErrorSnackbar} 
              autoHideDuration={6000} 
              onClose={() => setOpenErrorSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                onClose={() => setOpenErrorSnackbar(false)} 
                severity={snackbarSeverity} 
                sx={{ 
                  width: '100%', 
                  fontSize: '1.2em', 
                  backgroundColor: snackbarSeverity === "error" ? '#f8d7da' : '#d4edda', 
                  color: snackbarSeverity === "error" ? '#721c24' : '#155724' 
                }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
      </form>
  )}
</Formik>
</Box>
  
);
};

export default EditarPaciente;