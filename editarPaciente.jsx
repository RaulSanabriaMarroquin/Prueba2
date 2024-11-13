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


dayjs.locale('es');

const EditarPaciente = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navegar = useNavigate();
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
  const location = useLocation();
  // Mantén estos valores para el modo de edición y paciente inicial
  const { editMode, pacienteData: initialPacienteData } = location.state || { editMode: false, pacienteData: null };

  // Aquí añadimos el estado para pacienteData
  const [pacienteData, setPacienteData] = useState(initialPacienteData || null);
  const [editingPacienteData, seteditingPacienteData] = useState({}); // Nuevo estado para cambios temporales
  const [isEditing, setIsEditing] = useState({
    nombre_paciente: false,
    primer_apellido_paciente: false,
    segundo_apellido_paciente: false,
    fechaNacimiento: false,
    celular: false,
    email: false,
    direccion: false,
    //////////////////////////////////////TERMINAR DE HACER
  });

    // Cuando el modo de edición se activa, copia los datos del paciente al estado temporal
    const handleEditClick = (field) => {
        setIsEditing((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));

        if (!isEditing[field]) {
            // Solo al iniciar la edición, clona los datos del paciente
            seteditingPacienteData({ ...pacienteData });
        }
    };
  
    const handleSaveClick = async () => {
      // Verifica que hay datos para guardar
      if (!editingPacienteData) return;
  
      // Combina todos los datos actuales con los editados
      const dataCompleta = {
          ...pacienteData, // Mantiene todos los datos existentes
          ...editingPacienteData, // Sobrescribe solo los datos editados
      };
  
      try {
          console.log('Datos del paciente (objeto):', dataCompleta);
          console.log('Datos del paciente (string JSON):', JSON.stringify(dataCompleta));
  
          // Realiza la solicitud POST o PUT para actualizar el paciente con todos los datos
          const response = await fetch(`https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/updatePacientes`, {
              method: 'POST',  // Cambia a PUT si tu API usa ese método para actualizaciones
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataCompleta), // Envía todos los datos, incluidos los editados y no editados
          });
  
          if (response.ok) {
              const updatedPaciente = await response.json();
              console.log('Paciente actualizado con éxito', updatedPaciente);
              // Actualiza el estado si es necesario
          } else {
              console.error('Error al actualizar los datos del paciente');
          }
      } catch (error) {
          console.error('Error al guardar los datos:', error);
      }
  
      // Desactiva el modo de edición para todos los campos
      setIsEditing((prev) => {
          const newEditingState = {};
          for (const field in prev) {
              newEditingState[field] = false; // Desactiva todos los campos
          }
          return newEditingState;
      });
  };

  const id = new URLSearchParams(location.search).get('id'); // Obtener el ID de la query string
  console.log(id);


  const [isFetching, setIsFetching] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const fetchPaciente = async () => {
    setIsFetching(true); // Empieza el proceso de carga
      try {
        const response = await fetch('https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/getPacientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"id_paciente": id}),

        });

      // Verifica si la respuesta es correcta
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(JSON.stringify({"id_paciente": id}))

      // Convierte la respuesta en formato JSON
      const data = await response.json();
      console.log(data); // Muestra los datos en la consola

      const paciente = data; // Suponiendo que el primer resultado es el paciente 
   // Establecer los datos básicos del paciente
   setPacienteData({
    id_paciente: String(paciente.id_paciente),
    nombre_paciente: paciente.nombre_paciente,
    primer_apellido_paciente: paciente.primer_apellido_paciente,
    segundo_apellido_paciente: paciente.segundo_apellido_paciente,
    fecha_nacimiento_paciente: paciente.fecha_nacimiento_paciente,
    fecha_registro_paciente: paciente.fecha_registro_paciente,
    identificacion_paciente: paciente.identificacion_paciente,
    id_estado_civil: String(paciente.id_estado_civil),
    ocupacion_paciente: paciente.ocupacion_paciente,
    lugar_residencia_paciente: paciente.lugar_residencia_paciente,
    numero_celular_paciente: paciente.numero_celular_paciente,
    correo_electronico_paciente: paciente.correo_electronico_paciente,
    primer_chequeo: paciente.primer_chequeo,  // Maneja el valor de examen  // Revisar si tiene un examen médico
  });
  console.log(pacienteData.primer_chequeo); // Verifica el valor



  // Solo hacer fetch de los datos adicionales si examen = false
  if (paciente.primer_chequeo === false) {
    setPacienteData(prevState => ({
      ...prevState,
      // Antecedentes Heredofamiliares
      diabetes_heredofamiliar: paciente.antecedentes_heredofamiliares.diabetes_heredofamiliar,
      cardiacos_heredofamiliar: paciente.antecedentes_heredofamiliares.cardiacos_heredofamiliar,
      hta_heredofamiliar: paciente.antecedentes_heredofamiliares.hta_heredofamiliar,
      cancer_heredofamiliar: paciente.antecedentes_heredofamiliares.cancer_heredofamiliar,
      cancer_mama_heredofamiliar: paciente.antecedentes_heredofamiliares.cancer_mama_heredofamiliar,
      enfermedades_mentales_heredofamiliar: paciente.antecedentes_heredofamiliares.enfermedades_mentales_heredofamiliar,
      // Antecedentes Personales Patológicos
      epi: paciente.antecedentes_patologicos.epi,
      hepatitis: paciente.antecedentes_patologicos.hepatitis,
      hta: paciente.antecedentes_patologicos.hta,
      diabetes: paciente.antecedentes_patologicos.diabetes,
      cirugias_abdominales_antecedente: paciente.antecedentes_quirurgicos.cirugias_abdominales_antecedente,
      // Antecedentes Ginecológicos
      edad_menarca_ciclo: paciente.ciclo_menstrual.edad_menarca_ciclo,
      ritmo_menstrual_periodico: paciente.ciclo_menstrual.ritmo_menstrual_periodico,
      id_cantidad_sangrado: String(paciente.ciclo_menstrual.id_cantidad_sangrado),
      dismenorrea: paciente.ciclo_menstrual.dismenorrea,
      fecha_ultima_menstruacion: paciente.ciclo_menstrual.fecha_ultima_menstruacion,
      edad_primera_relacion_sexual: paciente.actividad_sexual.edad_primera_relacion_sexual,
      id_orientacion_sexual: String(paciente.actividad_sexual.id_orientacion_sexual),
      id_numero_parejas: paciente.actividad_sexual.id_numero_parejas,
      factores_riesgo_sexual: paciente.actividad_sexual.factores_riesgo_sexual,
      dispareunia: paciente.actividad_sexual.dispareunia,
      sangrado_sexual: paciente.actividad_sexual.sangrado_sexual,
      libido: paciente.actividad_sexual.libido,
      orgasmo: paciente.actividad_sexual.orgasmo,
      lubricacion: paciente.actividad_sexual.lubricacion,
      metodos_anticonceptivos_tiempo: paciente.actividad_sexual.metodos_anticonceptivos_tiempo,
      numero_gestaciones: paciente.historial_obstetrico.numero_gestaciones,
      numero_partos: paciente.historial_obstetrico.numero_partos,
      numero_abortos: paciente.historial_obstetrico.numero_abortos,
      numero_total_embarazos: paciente.historial_obstetrico.numero_total_embarazos,
      numero_total_partos: paciente.historial_obstetrico.numero_total_partos,
      numero_puerperios: paciente.historial_obstetrico.numero_puerperios,
      lactancia: paciente.historial_obstetrico.lactancia,
      fecha_ultimo_parto: paciente.historial_obstetrico.fecha_ultimo_parto,
      fecha_ultimo_papanicolaou: paciente.examenes_preventivos.fecha_ultimo_papanicolaou,
      fecha_ultima_mamografia: paciente.examenes_preventivos.fecha_ultima_mamografia,
      fecha_ultima_densitometria: paciente.examenes_preventivos.fecha_ultima_densitometria,
      fecha_ultimo_ultrasonido_pelvico: paciente.examenes_preventivos.fecha_ultimo_ultrasonido_pelvico,
      motivo_consulta: paciente.motivo_consulta.motivo_consulta,
      presion_arterial: paciente.examen_fisico.presion_arterial,
      frecuencia_pulso: paciente.examen_fisico.frecuencia_pulso,
      frecuencia_cardiaca: paciente.examen_fisico.frecuencia_cardiaca,
      frecuencia_respiratoria: paciente.examen_fisico.frecuencia_respiratoria,
      peso: paciente.examen_fisico.peso,
      altura: paciente.examen_fisico.altura,
      indice_masa_corporal: paciente.examen_fisico.indice_masa_corporal,
      cabeza_cuello_examen: paciente.examen_fisico.cabeza_cuello_examen,
      torax_examen: paciente.examen_fisico.torax_examen,
      mamas_examen: paciente.examen_fisico.mamas_examen,
      abdomen_examen: paciente.examen_fisico.abdomen_examen,
      fosas_iliacas_examen: paciente.examen_fisico.fosas_iliacas_examen,
      vulva_examen: paciente.examen_ginecologico.vulva_examen,
      cuello_uterino_examen: paciente.examen_ginecologico.cuello_uterino_examen,
      bulbo_uretral_skene_examen: paciente.examen_ginecologico.bulbo_uretral_skene_examen,
      utero_examen: paciente.examen_ginecologico.utero_examen,
      perine_examen: paciente.examen_ginecologico.perine_examen,
      vagina_examen: paciente.examen_ginecologico.vagina_examen,
      colposcopia_examen: paciente.examen_ginecologico.colposcopia_examen,
      anexos_uterinos_examen: paciente.examen_ginecologico.anexos_uterinos_examen,
      resumen_problemas: paciente.resumen_lista_problemas.resumen_problemas,
      plan_seguimiento: paciente.plan_seguimiento.plan_seguimiento,
    }));
  }
} catch (error) {
  console.error('Error fetching patient data:', error);
} finally {
  setIsFetching(false); // Finaliza el proceso de carga
}
};

// Configura `isReady` solo cuando `id` está disponible y el componente se monta
useEffect(() => {
if (id) {
  setIsReady(true);
}
}, [id]);

// Llama a `fetchPaciente` solo cuando `isReady` es `true` y `isFetching` es `false`
useEffect(() => {
if (isReady && !isFetching) {
  fetchPaciente();
}
}, [isReady, isFetching]); // `id` ya está observado en el primer `useEffect`


  
  const initialValues = editMode ? {
    // Campos nuevos
    diabetes_heredofamiliar: pacienteData.AntecedentesHeredoFamiliares.diabetes_heredofamiliar,
    cardiacos_heredofamiliar: pacienteData.AntecedentesHeredoFamiliares.cardiacos_heredofamiliar,
    hta_heredofamiliar: pacienteData.AntecedentesHeredoFamiliares.hta_heredofamiliar,
    cancer_heredofamiliar: pacienteData.AntecedentesHeredoFamiliares.cancer_heredofamiliar,
    cancer_mama_heredofamiliar: pacienteData.AntecedentesHeredoFamiliares.cancer_mama_heredofamiliar,
    enfermedades_mentales_heredofamiliar: pacienteData.AntecedentesHeredoFamiliares.enfermedades_mentales_heredofamiliar,

    epiPatologicos: pacienteData.AntecedentesPersonalesPatologicos.epi,
    HepatitisPatologicos: pacienteData.AntecedentesPersonalesPatologicos.Hepatitis,
    HTAPatologicos: pacienteData.AntecedentesPersonalesPatologicos.HTA,
    DiabetesPatologicos: pacienteData.AntecedentesPersonalesPatologicos.Diabetes,
    //OtrosPatologicos: pacienteData.AntecedentesPersonalesPatologicos.Otros,

    cirugias_abdominales_antecedente: pacienteData.AntecedentesPersonalesPatologicos.cirugias_abdominales_antecedente,

    EdadMenarca: pacienteData.AntecedentesGinecologicos.EdadMenarca,
    //EdadDcss: pacienteData.AntecedentesGinecologicos.EdadDcss,
    RMP: pacienteData.AntecedentesGinecologicos.RMP,
    id_cantidad_sangrado: pacienteData.AntecedentesGinecologicos.id_cantidad_sangrado,
    Dismenorrea: pacienteData.AntecedentesGinecologicos.Dismenorrea,
    fecha_ultima_menstruacion: dayjs(pacienteData.AntecedentesGinecologicos.fecha_ultima_menstruacion),

    EdadDePRS: pacienteData.AntecedentesGinecologicos.EdadDePRS,
    id_orientacion_sexual: pacienteData.AntecedentesGinecologicos.id_orientacion_sexual,
    //Cambiar opcion sexual a orientiacion sexual y que sea un id
    ParejasSexuales: pacienteData.AntecedentesGinecologicos.ParejasSexuales,
    FRS: pacienteData.AntecedentesGinecologicos.FRS,
    Dispareunia: pacienteData.AntecedentesGinecologicos.Dispareunia,
    Sangrado: pacienteData.AntecedentesGinecologicos.Sangrado,
    Libido: pacienteData.AntecedentesGinecologicos.Libido,
    Orgasmo: pacienteData.AntecedentesGinecologicos.Orgasmo,
    lubricacion: pacienteData.AntecedentesGinecologicos.lubricacion,
    //FUR: pacienteData.AntecedentesGinecologicos.FUR,
    //Agregar metodos_anticonceptivos_tiempo y es un string
    metodos_anticonceptivos_tiempo: pacienteData.AntecedentesGinecologicos.metodos_anticonceptivos_tiempo,
    //Cambiar G a metodos_anticonceptivos_tiempo
    numero_gestaciones: pacienteData.AntecedentesGinecologicos.numero_gestaciones,
    numero_abortos: pacienteData.AntecedentesGinecologicos.numero_abortos,
    numero_total_partos: pacienteData.AntecedentesGinecologicos.numero_total_partos,
    numero_total_embarazos: pacienteData.AntecedentesGinecologicos.numero_total_embarazos,
    Partos: pacienteData.AntecedentesGinecologicos.Partos,
    Puerperios: pacienteData.AntecedentesGinecologicos.Puerperios,
    lactancia: pacienteData.AntecedentesGinecologicos.lactancia,
    FechaUltimoParto: dayjs(pacienteData.AntecedentesGinecologicos.FechaUltimoParto),
    FechaPAP: dayjs(pacienteData.AntecedentesGinecologicos.FechaPAP),
    fecha_ultima_mamografia: dayjs(pacienteData.AntecedentesGinecologicos.fecha_ultima_mamografia),
    fecha_ultima_densitometria: dayjs(pacienteData.AntecedentesGinecologicos.fecha_ultima_densitometria),
    fecha_ultimo_ultrasonido_pelvico: dayjs(pacienteData.AntecedentesGinecologicos.fecha_ultimo_ultrasonido_pelvico),

    //DispareuniaFinal: pacienteData.AntecedentesGinecologicos.Puerperios,

    MotivoConsulta: pacienteData.MotivoConsulta,

    PA: pacienteData.ExamenFisico.PA,
    //Cambiar a persion_arterial
    Pulso: pacienteData.ExamenFisico.Pulso,
    //Cambiar a frecuencia_pulso
    FC: pacienteData.ExamenFisico.FC,
    //Cambiar a frecuencia_cardiaca
    FR: pacienteData.ExamenFisico.FR,
        //Cambiar a frecuencia_respiratoria
    peso: pacienteData.ExamenFisico.peso,
    //Cambiar a peso
    altura: pacienteData.ExamenFisico.altura,
    //Cambiar a altura
    IMC: pacienteData.ExamenFisico.IMC,
    CabezaCuello: pacienteData.ExamenFisico.CabezaCuello,
    Torax: pacienteData.ExamenFisico.Torax,
    Mamas: pacienteData.ExamenFisico.Mamas,
    abdomen_examen: pacienteData.ExamenFisico.abdomen_examen,
    FosasIliacas: pacienteData.ExamenFisico.FosasIliacas,

    Vulva: pacienteData.ExamenGinecologico.Vulva,
    Cuello: pacienteData.ExamenGinecologico.Cuello,
    bulbo_uretral_skene_examen: pacienteData.ExamenGinecologico.bulbo_uretral_skene_examen,
    //Ca,boar a bulbo_uretral_skene_examen
    Utero: pacienteData.ExamenGinecologico.Utero,
    Perine: pacienteData.ExamenGinecologico.Perine,
    Vagina: pacienteData.ExamenGinecologico.Vagina,
    colposcopia_examen: pacienteData.ExamenGinecologico.colposcopia_examen,
    //Cambiar a colposcopia_examenscopia_examen
    anexos_uterinos_examen: pacienteData.ExamenGinecologico.anexos_uterinos_examen,
    //Cambiar a anexos_uterinos_examens_uterinos_examen

    ResumenProblemas: pacienteData.ResumenProblemas,

    PlanSeguimiento: pacienteData.PlanSeguimiento,
  } : {
    AntecedentesHeredoFamiliares: {
      diabetes_heredofamiliar: '',
      cardiacos_heredofamiliar: '',
      hta_heredofamiliar: '',
      cancer_heredofamiliar: '',
      cancer_mama_heredofamiliar: '',
      enfermedades_mentales_heredofamiliar: '',
    },
    AntecedentesPersonalesPatologicos: {
      epi: '',
      Hepatitis: '',
      HTA: '',
      Diabetes: '',
      cirugias_abdominales_antecedente: '',
    },
    AntecedentesGinecologicos: {
      EdadMenarca: '',
      RMP: '',
      id_cantidad_sangrado: '',
      Dismenorrea: '',
      EdadDePRS: '',
      id_orientacion_sexual: '',
      ParejasSexuales: '',
      FRS: '',
      Dispareunia: '',
      Libido: '',
      Sangrado: '',
      Orgasmo: '',
      lubricacion: '',
      FechaPAP: dayjs(),
      fecha_ultima_mamografia: dayjs(),
      fecha_ultima_densitometria: dayjs(),
      fecha_ultimo_ultrasonido_pelvico: dayjs(),
      metodos_anticonceptivos_tiempo: '',
      numero_gestaciones: '',
      numero_abortos: '',
      numero_total_partos: '',
      numero_total_embarazos: '',
      Partos: '',
      Puerperios: '',
      lactancia: '',
      //DispareuniaFinal: '',
      fecha_ultima_menstruacion: dayjs(),
      FechaUltimoParto: dayjs(),
    },
    MotivoConsulta: '',
    ExamenFisico: {
      PA: '',
      Pulso: '',
      FC: '',
      FR: '',
      peso: '',
      altura: '',
      IMC: '',
      CabezaCuello: '',
      Torax: '',
      Mamas: '',
      abdomen_examen: '',
      FosasIliacas: '',
    },
    ExamenGinecologico: {
      Vulva: '',
      Cuello: '',
      bulbo_uretral_skene_examen: '',
      Utero: '',
      Perine: '',
      Vagina: '',
      colposcopia_examen: '',
      anexos_uterinos_examen: '',
    },
    ResumenProblemas: '',
    PlanSeguimiento: '',
  };
  const cantidadOptions = [
    { id: 1, label: 'E' }, // ID 1
    { id: 2, label: 'M' }, // ID 2
    { id: 3, label: 'A' }, // ID 3\
  ];



  // Define the validation schema for the patient form
  const checkoutSchema = Yup.object().shape({

    // Antecedentes HeredoFamiliares
    AntecedentesHeredoFamiliares: Yup.object().shape({
      diabetes_heredofamiliar: Yup.string().required('Este campo es obligatorio'),
      cardiacos_heredofamiliar: Yup.string().required('Este campo es obligatorio'),
      hta_heredofamiliar: Yup.string().required('Este campo es obligatorio'),
      cancer_heredofamiliar: Yup.string().required('Este campo es obligatorio'),
      cancer_mama_heredofamiliar: Yup.string().required('Este campo es obligatorio'),
      enfermedades_mentales_heredofamiliar: Yup.string().required('Este campo es obligatorio'),
    }),
  
    // Antecedentes Personales Patológicos
    AntecedentesPersonalesPatologicos: Yup.object().shape({
      epi: Yup.string().required('Este campo es obligatorio'),
      Hepatitis: Yup.string().required('Este campo es obligatorio'),
      HTA: Yup.string().required('Este campo es obligatorio'),
      Diabetes: Yup.string().required('Este campo es obligatorio'),
      cirugias_abdominales_antecedente: Yup.string().required('Este campo es obligatorio'),
    }),
  
    // Antecedentes Ginecológicos
    AntecedentesGinecologicos: Yup.object().shape({
      EdadMenarca: Yup.number().min(8, 'Debe ser un número válido mayor o igual a 8').required('Este campo es obligatorio'),
      RMP: Yup.string().required('Este campo es obligatorio'),
      id_cantidad_sangrado: Yup.number().required('Este campo es obligatorio'),
      Dismenorrea: Yup.string().required('Este campo es obligatorio'),
      EdadDePRS: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      id_orientacion_sexual: Yup.string().required('Este campo es obligatorio'),
      ParejasSexuales: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      FRS: Yup.string().required('Este campo es obligatorio'),
      Dispareunia: Yup.string().required('Este campo es obligatorio'),
      Libido: Yup.string().required('Este campo es obligatorio'),
      Sangrado: Yup.string().required('Este campo es obligatorio'),
      Orgasmo: Yup.string().required('Este campo es obligatorio'),
      lubricacion: Yup.string().required('Este campo es obligatorio'),
      lactancia: Yup.string().required('Este campo es obligatorio'),
      FechaPAP: Yup.date().required('Este campo es obligatorio'),
      fecha_ultima_mamografia: Yup.date().required('Este campo es obligatorio'), 
      fecha_ultima_densitometria: Yup.date().required('Este campo es obligatorio'),
      fecha_ultimo_ultrasonido_pelvico: Yup.date().required('Este campo es obligatorio'),
      metodos_anticonceptivos_tiempo: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      numero_gestaciones:  Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      numero_abortos: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      numero_total_partos: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      numero_total_embarazos: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      Partos: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      Puerperios: Yup.number().min(0, 'Debe ser un número válido').required('Este campo es obligatorio'),
      //DispareuniaFinal: Yup.string().required('Este campo es obligatorio'),
      FechaUltimoParto: Yup.date().required('Este campo es obligatorio'),
      fecha_ultima_menstruacion: Yup.date().required('Este campo es obligatorio'),
    }),
  
    // Examen Físico
    ExamenFisico: Yup.object().shape({
      PA: Yup.number().required('Este campo es obligatorio'),
      Pulso: Yup.number().required('Este campo es obligatorio'),
      FC: Yup.number().required('Este campo es obligatorio'),
      FR: Yup.number().required('Este campo es obligatorio'),
      peso: Yup.number().required('Este campo es obligatorio'),
      altura: Yup.number().required('Este campo es obligatorio'),
      IMC: Yup.number().required('Este campo es obligatorio'),
      CabezaCuello: Yup.string().required('Este campo es obligatorio'),
      Torax: Yup.string().required('Este campo es obligatorio'),
      Mamas: Yup.string().required('Este campo es obligatorio'),
      abdomen_examen: Yup.string().required('Este campo es obligatorio'),
      FosasIliacas: Yup.string().required('Este campo es obligatorio'),
    }),
  
    // Examen Ginecológico
    ExamenGinecologico: Yup.object().shape({
      Vulva: Yup.string().required('Este campo es obligatorio'),
      Cuello: Yup.string().required('Este campo es obligatorio'),
      bulbo_uretral_skene_examen: Yup.string().required('Este campo es obligatorio'),
      Utero: Yup.string().required('Este campo es obligatorio'),
      Perine: Yup.string().required('Este campo es obligatorio'),
      Vagina: Yup.string().required('Este campo es obligatorio'),
      colposcopia_examen: Yup.string().required('Este campo es obligatorio'),
      anexos_uterinos_examen: Yup.string().required('Este campo es obligatorio'),
    }),

    ResumenProblemas: Yup.string().required('Este campo es obligatorio'),

    PlanSeguimiento: Yup.string().required('Este campo es obligatorio'),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    const formattedFechaPAP = values.FechaPAP ? values.AntecedentesGinecologicos.FechaPAP.format('YYYY-MM-DD ') : null;
    const formattedMamografia = values.AntecedentesGinecologicos.fecha_ultima_mamografia ? dayjs(values.fecha_ultima_mamografia).format('YYYY-MM-DD') : null;
    const formattedDensitometria =  values.AntecedentesGinecologicos.fecha_ultima_densitometria ? dayjs(values.fecha_ultima_densitometria).format('YYYY-MM-DD') : null;
    const formattedPelvico = values.AntecedentesGinecologicos.fecha_ultimo_ultrasonido_pelvico ? dayjs(values.fecha_ultimo_ultrasonido_pelvico).format('YYYY-MM-DD') : null;
    const formattedFechaUltimoParto = values.AntecedentesGinecologicos.FechaUltimoParto ? dayjs(values.FechaUltimoParto).format('YYYY-MM-DD') : null;
    const formattedcantidad = values.AntecedentesGinecologicos.id_cantidad_sangrado ? String(values.id_cantidad_sangrado) : null;
    const formattedUltimaMestruacion = values.AntecedentesGinecologicos.fecha_ultima_menstruacion  ? dayjs(values.fecha_ultima_menstruacion).format('YYYY-MM-DD') : null;
    // Define dataNueva dentro de la función para asegurarte de que esté en el contexto correcto.
    const dataNueva = {
          // Antecedentes HeredoFamiliares
            diabetes_heredofamiliar: values.AntecedentesHeredoFamiliares.diabetes_heredofamiliar,
            cardiacos_heredofamiliar: values.AntecedentesHeredoFamiliares.cardiacos_heredofamiliar,
            hta_heredofamiliar: values.AntecedentesHeredoFamiliares.hta_heredofamiliar,
            cancer_heredofamiliar: values.AntecedentesHeredoFamiliares.cancer_heredofamiliar,
            cancer_mama_heredofamiliar: values.AntecedentesHeredoFamiliares.cancer_mama_heredofamiliar,
            enfermedades_mentales_heredofamiliar: values.AntecedentesHeredoFamiliares.enfermedades_mentales_heredofamiliar,
          
      
          // Antecedentes Personales Patológicos
            epi: values.AntecedentesPersonalesPatologicos.epi,
            hepatitis: values.AntecedentesPersonalesPatologicos.Hepatitis,
            hta: values.AntecedentesPersonalesPatologicos.HTA,
            diabetes: values.AntecedentesPersonalesPatologicos.Diabetes,
            //Otros: values.AntecedentesPersonalesPatologicos.Otros,

            cirugias_abdominales_antecedente: values.AntecedentesPersonalesPatologicos.cirugias_abdominales_antecedente,
      
          // Antecedentes Ginecológicos

            edad_menarca_ciclo: values.AntecedentesGinecologicos.EdadMenarca,
            //EdadDcss: values.AntecedentesGinecologicos.EdadDcss,
            ritmo_menstrual_periodico: values.AntecedentesGinecologicos.RMP,
            id_cantidad_sangrado: String(values.AntecedentesGinecologicos.id_cantidad_sangrado), //formattedcantidad E (1), M (2), A (3)
            dismenorrea: values.AntecedentesGinecologicos.Dismenorrea,
            fecha_ultima_menstruacion: formattedUltimaMestruacion,

            edad_primera_relacion_sexual: values.AntecedentesGinecologicos.EdadDePRS,
            id_orientacion_sexual: values.AntecedentesGinecologicos.id_orientacion_sexual,
            id_numero_parejas: values.AntecedentesGinecologicos.ParejasSexuales,
            factores_riesgo_sexual: values.AntecedentesGinecologicos.FRS,
            dispareunia: values.AntecedentesGinecologicos.Dispareunia,
            sangrado_sexual: values.AntecedentesGinecologicos.Sangrado,
            libido: values.AntecedentesGinecologicos.Libido,
            orgasmo: values.AntecedentesGinecologicos.Orgasmo,
            lubricacion: values.AntecedentesGinecologicos.lubricacion,
            metodos_anticonceptivos_tiempo: values.AntecedentesGinecologicos.metodos_anticonceptivos_tiempo,

            numero_gestaciones: values.AntecedentesGinecologicos.numero_gestaciones,
            numero_partos: values.AntecedentesGinecologicos.Partos,
            numero_abortos: values.AntecedentesGinecologicos.numero_abortos,
            numero_total_embarazos: values.AntecedentesGinecologicos.numero_total_embarazos,
            numero_total_partos: values.AntecedentesGinecologicos.numero_total_partos,
            numero_puerperios: values.AntecedentesGinecologicos.Puerperios,
            lactancia: values.AntecedentesGinecologicos.lactancia,
            fecha_ultimo_parto: formattedFechaUltimoParto,

            fecha_ultimo_papanicolaou: formattedFechaPAP,
            fecha_ultima_mamografia: formattedMamografia,
            fecha_ultima_densitometria: formattedDensitometria,
            fecha_ultimo_ultrasonido_pelvico: formattedPelvico,
            //DispareuniaFinal: values.AntecedentesGinecologicos.DispareuniaFinal,

      
          // Motivo de Consulta
          motivo_consulta: values.MotivoConsulta,
      
          // Examen Físico
            presion_arterial: values.ExamenFisico.PA,
            frecuencia_pulso: values.ExamenFisico.Pulso,
            frecuencia_cardiaca: values.ExamenFisico.FC,
            frecuencia_respiratoria: values.ExamenFisico.FR,
            peso: values.ExamenFisico.peso,
            altura: values.ExamenFisico.altura,
            indice_masa_corporal: values.ExamenFisico.IMC,
            cabeza_cuello_examen: values.ExamenFisico.CabezaCuello,
            torax_examen: values.ExamenFisico.Torax,
            mamas_examen: values.ExamenFisico.Mamas,
            abdomen_examen: values.ExamenFisico.abdomen_examen,
            fosas_iliacas_examen: values.ExamenFisico.FosasIliacas,
      

            vulva_examen: values.ExamenGinecologico.Vulva,
            cuello_uterino_examen: values.ExamenGinecologico.Cuello,
            bulbo_uretral_skene_examen: values.ExamenGinecologico.bulbo_uretral_skene_examen,
            utero_examen: values.ExamenGinecologico.Utero,
            perine_examen: values.ExamenGinecologico.Perine,
            vagina_examen: values.ExamenGinecologico.Vagina,
            colposcopia_examen: values.ExamenGinecologico.colposcopia_examen,
            anexos_uterinos_examen: values.ExamenGinecologico.anexos_uterinos_examen,

          resumen_problemas: values.ResumenProblemas,

          plan_seguimiento: values.PlanSeguimiento,
        };
      
        try {

          // Filtra solo los campos que necesitas de pacienteData
          const pacienteFiltrado = {
              id_paciente: pacienteData.id_paciente,
              nombre_paciente: pacienteData.nombre_paciente,
              primer_apellido_paciente: pacienteData.primer_apellido_paciente,
              segundo_apellido_paciente: pacienteData.segundo_apellido_paciente,
              fecha_nacimiento_paciente: pacienteData.fecha_nacimiento_paciente,
              identificacion_paciente: pacienteData.identificacion_paciente,
              id_estado_civil: pacienteData.id_estado_civil,
              ocupacion_paciente: pacienteData.ocupacion_paciente,
              lugar_residencia_paciente: pacienteData.lugar_residencia_paciente,
              numero_celular_paciente: pacienteData.numero_celular_paciente,
              correo_electronico_paciente: pacienteData.correo_electronico_paciente,
          };
          // Combina los datos del paciente con los nuevos datos del examen médico
          const dataCompleta = {
            ...pacienteFiltrado,
            ...dataNueva,  // Aquí incluyes los datos del examen médico que mencionaste
          };
          console.log('Datos del paciente (objeto):', dataCompleta);
          console.log('Datos del paciente (string JSON):', JSON.stringify(dataCompleta));
      
          // Realiza la solicitud POST o PUT para actualizar el paciente con los datos completos
          const response = await fetch(`https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/updatePacientes`, {
            method: 'POST',  // Cambia a PUT si tu API usa ese método para actualizaciones
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataCompleta), // Envía los datos combinados
          });
      
          if (response.ok) {
            const updatedPaciente = await response.json();
            console.log('Paciente actualizado con éxito', updatedPaciente);
          } else {
            console.error('Error al actualizar los datos del paciente');
          }
          // Al finalizar, recargamos los datos del examen médico
          //fetchPaciente();
        } catch (error) {
          console.error('Error al guardar los datos:', error);
        }
  };

  /*
    const calculateAge = (birthdate) => {
    const today = dayjs();
    const birthdateDayjs = dayjs(birthdate);
  */

  return (
    <>
    {/* Botón Guardar Sticky */}
    <Box sx={{ position: 'sticky', top: 0, display: 'flex', justifyContent: 'flex-end', padding: '20px', backgroundColor: '#ffffff', zIndex: 1000 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveClick}
        startIcon={<SaveIcon />}
        sx={{
          backgroundColor: '#ff3b6d',
          '&:hover': {
            backgroundColor: '#ff2a5a',
          },
        }}
      >
        Guardar Cambios
      </Button>
    </Box>

    <Box m="20px">
      <Header title={pacienteData ? `Datos del paciente: ${pacienteData.nombre_paciente} ${pacienteData.primer_apellido_paciente} ${pacienteData.segundo_apellido_paciente}` : 'Cargando datos del paciente...'} />
         {/* Cuadro 1: Datos generales del paciente */}
         <Box sx={{ marginBottom: '20px' }}>
        <Box ><h2>Datos generales</h2></Box>
        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
        <Box item xs={6}>
        <TextField
            fullWidth
            label="Nombre"
            value={isEditing.nombre_paciente ? editingPacienteData.nombre_paciente || '' : (pacienteData ? pacienteData.nombre_paciente : '')}
            onChange={(e) => {
                if (isEditing.nombre_paciente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        nombre_paciente: e.target.value,
                    }));
                }
            }}
            disabled={!isEditing.nombre_paciente}
            variant="filled"
            sx={{
                gridColumn: "span 1",
                '& .MuiFilledInput-root': {
                    backgroundColor: isEditing.nombre_paciente ? '#ffffff' : '#F2EAE1',
                    color: '#000000',
                    '&:hover': {
                        backgroundColor: '#ffffff',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#F2EAE1',
                        opacity: 1,
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#000000',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: isEditing.nombre_paciente ? '#ffffff' : '#F2EAE1',
                    },
                    '&.Mui-focused': {
                        color: '#ff3b6d',
                    },
                },
                '& .MuiInputBase-input': {
                    fontWeight: 'bold',
                    color: '#000000',
                    fontSize: '16px',
                },
            }}
        />
        {/* Botón de guardar/editar */}
        <IconButton onClick={() => (isEditing.nombre_paciente ? handleSaveClick('nombre_paciente') : handleEditClick('nombre_paciente'))} sx={{ ml: 1 }}>
            {isEditing.nombre_paciente ? <SaveIcon /> : <EditIcon />}
        </IconButton>
    </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="Apellido"
            value={pacienteData ? pacienteData.primer_apellido_paciente : ''} 
            onChange={(e) => {
                if (isEditing.primer_apellido_paciente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        primer_apellido_paciente: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.primer_apellido_paciente}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.primer_apellido_paciente ? handleSaveClick('primer_apellido_paciente') : handleEditClick('primer_apellido_paciente'))} sx={{ ml: 1 }}>
              {isEditing.primer_apellido_paciente ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="Segundo Apellido"
            value={isEditing.segundo_apellido_paciente ? editingPacienteData.segundo_apellido_paciente || '' : (pacienteData ? pacienteData.segundo_apellido_paciente : '')}
            onChange={(e) => {
                if (isEditing.segundo_apellido_paciente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        segundo_apellido_paciente: e.target.value,
                    }));
                }
            }}
            disabled={!isEditing.segundo_apellido_paciente}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
        <IconButton onClick={() => (isEditing.segundo_apellido_paciente ? handleSaveClick('segundo_apellido_paciente') : handleEditClick('segundo_apellido_paciente'))} sx={{ ml: 1 }}>
          {isEditing.segundo_apellido_paciente ? <SaveIcon /> : <EditIcon />}
        </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="Fecha de Nacimiento"
            value={isEditing.fecha_nacimiento_paciente ? editingPacienteData.fecha_nacimiento_paciente || '' : (pacienteData ? pacienteData.fecha_nacimiento_paciente : '')}
            onChange={(e) => {
                if (isEditing.fecha_nacimiento_paciente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        fecha_nacimiento_paciente: e.target.value,
                    }));
                }
            }}
            disabled={!isEditing.fecha_nacimiento_paciente}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
                <IconButton onClick={() => (isEditing.fecha_nacimiento_paciente ? handleSaveClick('fecha_nacimiento_paciente') : handleEditClick('fecha_nacimiento_paciente'))} sx={{ ml: 1 }}>
                    {isEditing.fecha_nacimiento_paciente ? <SaveIcon /> : <EditIcon />}
                </IconButton>
            </Box>


        <Box item xs={6}>
            <TextField
            fullWidth
            label="Número de Celular"
            value={isEditing.numero_celular_paciente ? editingPacienteData.numero_celular_paciente || '' : (pacienteData ? pacienteData.numero_celular_paciente : '')}
            onChange={(e) => {
                if (isEditing.numero_celular_paciente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        numero_celular_paciente: e.target.value,
                    }));
                }
            }}
            disabled={!isEditing.numero_celular_paciente}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
                <IconButton onClick={() => (isEditing.phone ? handleSaveClick('numero_celular_paciente') : handleEditClick('numero_celular_paciente'))} sx={{ ml: 1 }}>
                    {isEditing.numero_celular_paciente ? <SaveIcon /> : <EditIcon />}
                </IconButton>
            </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="Correo Electrónico"
            value={isEditing.correo_electronico_paciente ? editingPacienteData.correo_electronico_paciente || '' : (pacienteData ? pacienteData.correo_electronico_paciente : '')}
            onChange={(e) => {
                if (isEditing.correo_electronico_paciente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        correo_electronico_paciente: e.target.value,
                    }));
                }
            }}
            disabled={!isEditing.correo_electronico_paciente}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
              <IconButton onClick={() => (isEditing.correo_electronico_paciente ? handleSaveClick('correo_electronico_paciente') : handleEditClick('correo_electronico_paciente'))} sx={{ ml: 1 }}>
                  {isEditing.correo_electronico_paciente ? <SaveIcon /> : <EditIcon />}
              </IconButton>
          </Box>

          <Box item xs={6}>
            <TextField
            fullWidth
            label="Dirección"
            value={isEditing.lugar_residencia_paciente ? editingPacienteData.lugar_residencia_paciente || '' : (pacienteData ? pacienteData.lugar_residencia_paciente : '')}
            onChange={(e) => {
                if (isEditing.lugar_residencia_paciente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        lugar_residencia_paciente: e.target.value,
                    }));
                }
            }}
            disabled={!isEditing.lugar_residencia_paciente}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
              <IconButton onClick={() => (isEditing.lugar_residencia_paciente ? handleSaveClick('lugar_residencia_paciente') : handleEditClick('lugar_residencia_paciente'))} sx={{ ml: 1 }}>
                  {isEditing.lugar_residencia_paciente ? <SaveIcon /> : <EditIcon />}
              </IconButton>
          </Box>
      </Box>
    </Box>
    
    <Box sx={{ marginBottom: '20px' }}>
      <Box><h2>Datos del examen médico</h2></Box>
      {/* Verifica si el paciente tiene un primer_chequeo */}
      {pacienteData ? (
      pacienteData.primer_chequeo === false ? (
      // Si primer_chequeo es false, mostramos los datos del examen médico
      <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Heredofamiliares</Typography>
      </AccordionSummary>
      <AccordionDetails>  
      <Box item xs={6}>
        <TextField
          fullWidth
          label="Diabetes Heredofamiliar"
          value={isEditing.diabetes_heredofamiliar
            ? (editingPacienteData.diabetes_heredofamiliar === true ? 'Sí' : 'No') // Verifica true o false correctamente
            : (pacienteData && pacienteData.diabetes_heredofamiliar === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
          }
          onChange={(e) => {
            if (isEditing.diabetes_heredofamiliar) {
              seteditingPacienteData((prev) => ({
                ...prev,
                diabetes_heredofamiliar: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
              }));
            }
          }}
          disabled={!isEditing.diabetes_heredofamiliar}
          variant="filled"
          sx={{
            gridColumn: "span 1",
            '& .MuiFilledInput-root': {
              backgroundColor: '#F2EAE1',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#ffffff',
              },
              '&.Mui-disabled': {
                backgroundColor: '#F2EAE1',
                opacity: 1,
              },
            },
            '& .MuiInputLabel-root': {
              color: '#000000',
              fontWeight: 'bold',
              '&.Mui-focused': {
                color: '#ff3b6d',
              },
            },
            '& .MuiInputBase-input': {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: '16px',
            },
          }}
        />
        <IconButton onClick={() => (isEditing.diabetes_heredofamiliar ? handleSaveClick('diabetes_heredofamiliar') : handleEditClick('diabetes_heredofamiliar'))} sx={{ ml: 1 }}>
          {isEditing.diabetes_heredofamiliar ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>



        {/* Campo: Cardiacos */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="cardiacos_heredofamiliar"
            value={isEditing.cardiacos_heredofamiliar
              ? (editingPacienteData.cardiacos_heredofamiliar === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.cardiacos_heredofamiliar === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.cardiacos_heredofamiliar) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  cardiacos_heredofamiliar: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.cardiacos_heredofamiliar}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.cardiacos_heredofamiliar ? handleSaveClick('cardiacos_heredofamiliar') : handleEditClick('cardiacos_heredofamiliar'))} sx={{ ml: 1 }}>
            {isEditing.talla ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* Campo: Presión arterial */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="hta_heredofamiliar"
            value={isEditing.hta_heredofamiliar
              ? (editingPacienteData.hta_heredofamiliar === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.hta_heredofamiliar === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.hta_heredofamiliar) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  hta_heredofamiliar: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.hta_heredofamiliar}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.hta_heredofamiliar ? handleSaveClick('hta_heredofamiliar') : handleEditClick('hta_heredofamiliar'))} sx={{ ml: 1 }}>
            {isEditing.hta_heredofamiliar ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>


        {/* Campo: cancer_heredofamiliar */}
                <Box item xs={6}>
          <TextField
            fullWidth
            label="cancer_heredofamiliar"
            value={isEditing.cancer_heredofamiliar
              ? (editingPacienteData.cancer_heredofamiliar === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.cancer_heredofamiliar === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.cancer_heredofamiliar) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  cancer_heredofamiliar: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.cancer_heredofamiliar}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.cancer_heredofamiliar ? handleSaveClick('cancer_heredofamiliar') : handleEditClick('cancer_heredofamiliar'))} sx={{ ml: 1 }}>
            {isEditing.cancer_heredofamiliar ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>


        {/* Campo: cancer_heredofamiliar */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="cancer_mama_heredofamiliar"
            value={isEditing.cancer_mama_heredofamiliar
              ? (editingPacienteData.cancer_mama_heredofamiliar === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.cancer_mama_heredofamiliar === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.cancer_mama_heredofamiliar) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  cancer_mama_heredofamiliar: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.cancer_mama_heredofamiliar}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.cancer_mama_heredofamiliar ? handleSaveClick('cancer_mama_heredofamiliar') : handleEditClick('cancer_mama_heredofamiliar'))} sx={{ ml: 1 }}>
            {isEditing.cancer_mama_heredofamiliar ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* Campo: enfermedades_mentales_heredofamiliar */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="enfermedades_mentales_heredofamiliar"
            value={isEditing.enfermedades_mentales_heredofamiliar
              ? (editingPacienteData.enfermedades_mentales_heredofamiliar === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.enfermedades_mentales_heredofamiliar === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.enfermedades_mentales_heredofamiliar) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  enfermedades_mentales_heredofamiliar: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.enfermedades_mentales_heredofamiliar}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.enfermedades_mentales_heredofamiliar ? handleSaveClick('enfermedades_mentales_heredofamiliar') : handleEditClick('enfermedades_mentales_heredofamiliar'))} sx={{ ml: 1 }}>
            {isEditing.enfermedades_mentales_heredofamiliar ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>
        </AccordionDetails>
        </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Personales Patologicos</Typography>
      </AccordionSummary>
      <AccordionDetails>  
        {/* Campo: epi */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="epi Patologica"
            value={isEditing.epi
              ? (editingPacienteData.epi === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.epi === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.epi) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  epi: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.epi}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.epi ? handleSaveClick('epi') : handleEditClick('epi'))} sx={{ ml: 1 }}>
            {isEditing.epi ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* Campo: hepatitis */}
          <Box item xs={6}>
          <TextField
            fullWidth
            label="Hepatitis Patologica"
            value={isEditing.hepatitis
              ? (editingPacienteData.hepatitis === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.hepatitis === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.hepatitis) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  hepatitis: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.hepatitis}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.hepatitis ? handleSaveClick('hepatitis') : handleEditClick('hepatitis'))} sx={{ ml: 1 }}>
            {isEditing.hepatitis ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* Campo: hta */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="hta Patologica"
            value={isEditing.hta
              ? (editingPacienteData.hta === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.hta === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.hta) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  hta: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.hta}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.hta ? handleSaveClick('hta') : handleEditClick('hta'))} sx={{ ml: 1 }}>
            {isEditing.hta ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* Campo: diabetes */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="diabetes Patologica"
            value={isEditing.diabetes
              ? (editingPacienteData.diabetes === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.diabetes === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.diabetes) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  diabetes: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.diabetes}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.diabetes ? handleSaveClick('diabetes') : handleEditClick('diabetes'))} sx={{ ml: 1 }}>
            {isEditing.diabetes ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>
      </AccordionDetails>  
      </Accordion> 

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Personales Quirurgicos</Typography>
      </AccordionSummary>
      <AccordionDetails>  
        <Box item xs={6}>
            <TextField
            fullWidth
            label="cirugias_abdominales_antecedente"
            value={isEditing.cirugias_abdominales_antecedente ? editingPacienteData.cirugias_abdominales_antecedente || '' : (pacienteData ? pacienteData.cirugias_abdominales_antecedente : '')}
            onChange={(e) => {
                if (isEditing.cirugias_abdominales_antecedente) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        cirugias_abdominales_antecedente: e.target.value,
                    }));
                }
            }}
            disabled={!isEditing.cirugias_abdominales_antecedente}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
              <IconButton onClick={() => (isEditing.cirugias_abdominales_antecedente ? handleSaveClick('cirugias_abdominales_antecedente') : handleEditClick('cirugias_abdominales_antecedente'))} sx={{ ml: 1 }}>
                  {isEditing.cirugias_abdominales_antecedente ? <SaveIcon /> : <EditIcon />}
              </IconButton>
          </Box>
        </AccordionDetails>
        </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Ginecológicos</Typography>
      </AccordionSummary>
      <AccordionDetails>  

          <Box item xs={6}>
            <TextField
            fullWidth
            label="edad_menarca_ciclo"
            value={pacienteData ? pacienteData.edad_menarca_ciclo : ''} 
            onChange={(e) => {
                if (isEditing.edad_menarca_ciclo) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        edad_menarca_ciclo: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.edad_menarca_ciclo}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.edad_menarca_ciclo ? handleSaveClick('edad_menarca_ciclo') : handleEditClick('edad_menarca_ciclo'))} sx={{ ml: 1 }}>
              {isEditing.edad_menarca_ciclo ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="ritmo_menstrual_periodico"
            value={pacienteData ? pacienteData.ritmo_menstrual_periodico : ''} 
            onChange={(e) => {
                if (isEditing.ritmo_menstrual_periodico) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        ritmo_menstrual_periodico: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.ritmo_menstrual_periodico}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.ritmo_menstrual_periodico ? handleSaveClick('ritmo_menstrual_periodico') : handleEditClick('ritmo_menstrual_periodico'))} sx={{ ml: 1 }}>
              {isEditing.ritmo_menstrual_periodico ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="cantidad sangrado"
            value={pacienteData ? pacienteData.id_cantidad_sangrado : ''} 
            onChange={(e) => {
                if (isEditing.id_cantidad_sangrado) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        id_cantidad_sangrado: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.id_cantidad_sangrado}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.id_cantidad_sangrado ? handleSaveClick('id_cantidad_sangrado') : handleEditClick('id_cantidad_sangrado'))} sx={{ ml: 1 }}>
              {isEditing.id_cantidad_sangrado ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        {/* Campo: diabetes */}
        <Box item xs={6}>
          <TextField
            fullWidth
            label="dismenorrea"
            value={isEditing.dismenorrea
              ? (editingPacienteData.dismenorrea === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.dismenorrea === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.dismenorrea) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  dismenorrea: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.dismenorrea}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.dismenorrea ? handleSaveClick('dismenorrea') : handleEditClick('dismenorrea'))} sx={{ ml: 1 }}>
            {isEditing.diabetes ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="fecha ultima menstruacion"
            value={pacienteData ? pacienteData.fecha_ultima_menstruacion : ''} 
            onChange={(e) => {
                if (isEditing.fecha_ultima_menstruacion) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        fecha_ultima_menstruacion: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.fecha_ultima_menstruacion}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.fecha_ultima_menstruacion ? handleSaveClick('fecha_ultima_menstruacion') : handleEditClick('fecha_ultima_menstruacion'))} sx={{ ml: 1 }}>
              {isEditing.fecha_ultima_menstruacion ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="edad_primera_relacion_sexual"
            value={pacienteData ? pacienteData.edad_primera_relacion_sexual : ''} 
            onChange={(e) => {
                if (isEditing.edad_primera_relacion_sexual) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        edad_primera_relacion_sexual: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.edad_primera_relacion_sexual}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.edad_primera_relacion_sexual ? handleSaveClick('edad_primera_relacion_sexual') : handleEditClick('edad_primera_relacion_sexual'))} sx={{ ml: 1 }}>
              {isEditing.edad_primera_relacion_sexual ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="id_orientacion_sexual"
            value={pacienteData ? pacienteData.id_orientacion_sexual : ''} 
            onChange={(e) => {
                if (isEditing.id_orientacion_sexual) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        id_orientacion_sexual: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.id_orientacion_sexual}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.id_orientacion_sexual ? handleSaveClick('id_orientacion_sexual') : handleEditClick('id_orientacion_sexual'))} sx={{ ml: 1 }}>
              {isEditing.id_orientacion_sexual ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>
      
        <Box item xs={6}>
            <TextField
            fullWidth
            label="id_numero_parejas"
            value={pacienteData ? pacienteData.id_numero_parejas : ''} 
            onChange={(e) => {
                if (isEditing.id_numero_parejas) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        id_numero_parejas: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.id_numero_parejas}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.id_numero_parejas ? handleSaveClick('id_numero_parejas') : handleEditClick('id_numero_parejas'))} sx={{ ml: 1 }}>
              {isEditing.id_numero_parejas ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>
      
        <Box item xs={6}>
            <TextField
            fullWidth
            label="factores riesgo sexual"
            value={pacienteData ? pacienteData.factores_riesgo_sexual : ''} 
            onChange={(e) => {
                if (isEditing.factores_riesgo_sexual) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        factores_riesgo_sexual: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.factores_riesgo_sexual}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.factores_riesgo_sexual ? handleSaveClick('factores_riesgo_sexual') : handleEditClick('factores_riesgo_sexual'))} sx={{ ml: 1 }}>
              {isEditing.factores_riesgo_sexual ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
          <TextField
            fullWidth
            label="dispareunia"
            value={isEditing.dispareunia
              ? (editingPacienteData.dispareunia === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.dispareunia === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.dispareunia) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  dispareunia: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.dispareunia}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.dispareunia ? handleSaveClick('dispareunia') : handleEditClick('dispareunia'))} sx={{ ml: 1 }}>
            {isEditing.dispareunia ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Box item xs={6}>
          <TextField
            fullWidth
            label="Sangrado sexual"
            value={isEditing.sangrado_sexual
              ? (editingPacienteData.sangrado_sexual === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.sangrado_sexual === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.sangrado_sexual) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  sangrado_sexual: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.sangrado_sexual}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.sangrado_sexual ? handleSaveClick('sangrado_sexual') : handleEditClick('sangrado_sexual'))} sx={{ ml: 1 }}>
            {isEditing.sangrado_sexual ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Box item xs={6}>
          <TextField
            fullWidth
            label="Libido"
            value={isEditing.libido
              ? (editingPacienteData.libido === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.libido === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.libido) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  libido: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.libido}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.libido ? handleSaveClick('libido') : handleEditClick('libido'))} sx={{ ml: 1 }}>
            {isEditing.libido ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Box item xs={6}>
          <TextField
            fullWidth
            label="Orgasmo"
            value={isEditing.orgasmo
              ? (editingPacienteData.orgasmo === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.orgasmo === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.orgasmo) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  orgasmo: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.orgasmo}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.orgasmo ? handleSaveClick('orgasmo') : handleEditClick('orgasmo'))} sx={{ ml: 1 }}>
            {isEditing.orgasmo ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Box item xs={6}>
          <TextField
            fullWidth
            label="Lubricacion"
            value={isEditing.lubricacion
              ? (editingPacienteData.lubricacion === true ? 'Sí' : 'No') // Verifica true o false correctamente
              : (pacienteData && pacienteData.lubricacion === true ? 'Sí' : 'No') // Asegura que se maneje pacienteData
            }
            onChange={(e) => {
              if (isEditing.lubricacion) {
                seteditingPacienteData((prev) => ({
                  ...prev,
                  lubricacion: e.target.value === 'Sí', // Convierte el texto 'Sí' a true, de lo contrario será false
                }));
              }
            }}
            disabled={!isEditing.lubricacion}
            variant="filled"
            sx={{
              gridColumn: "span 1",
              '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#F2EAE1',
                  opacity: 1,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 'bold',
                '&.Mui-focused': {
                  color: '#ff3b6d',
                },
              },
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#000000',
                fontSize: '16px',
              },
            }}
          />
          <IconButton onClick={() => (isEditing.lubricacion ? handleSaveClick('lubricacion') : handleEditClick('lubricacion'))} sx={{ ml: 1 }}>
            {isEditing.lubricacion ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>
      
        <Box item xs={6}>
            <TextField
            fullWidth
            label="metodos anticonceptivos tiempo"
            value={pacienteData ? pacienteData.metodos_anticonceptivos_tiempo : ''} 
            onChange={(e) => {
                if (isEditing.metodos_anticonceptivos_tiempo) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        metodos_anticonceptivos_tiempo: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.metodos_anticonceptivos_tiempo}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.metodos_anticonceptivos_tiempo ? handleSaveClick('metodos_anticonceptivos_tiempo') : handleEditClick('metodos_anticonceptivos_tiempo'))} sx={{ ml: 1 }}>
              {isEditing.metodos_anticonceptivos_tiempo ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="numeros gestaciones"
            value={pacienteData ? pacienteData.numero_gestaciones : ''} 
            onChange={(e) => {
                if (isEditing.numero_gestaciones) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        numero_gestaciones: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.numero_gestaciones}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.numero_gestaciones ? handleSaveClick('numero_gestaciones') : handleEditClick('numero_gestaciones'))} sx={{ ml: 1 }}>
              {isEditing.numero_gestaciones ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="numeros partos"
            value={pacienteData ? pacienteData.numero_partos : ''} 
            onChange={(e) => {
                if (isEditing.numero_partos) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        numero_partos: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.numero_partos}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.numero_partos ? handleSaveClick('numero_partos') : handleEditClick('numero_partos'))} sx={{ ml: 1 }}>
              {isEditing.numero_partos ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="numeros abortos"
            value={pacienteData ? pacienteData.numero_abortos : ''} 
            onChange={(e) => {
                if (isEditing.numero_abortos) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        numero_abortos: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.numero_abortos}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.numero_abortos ? handleSaveClick('numero_abortos') : handleEditClick('numero_abortos'))} sx={{ ml: 1 }}>
              {isEditing.numero_abortos ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="numeros total embarazos"
            value={pacienteData ? pacienteData.numero_total_embarazos : ''} 
            onChange={(e) => {
                if (isEditing.numero_total_embarazos) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        numero_total_embarazos: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.numero_total_embarazos}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.numero_total_embarazos ? handleSaveClick('numero_total_embarazos') : handleEditClick('numero_total_embarazos'))} sx={{ ml: 1 }}>
              {isEditing.numero_total_embarazos ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>
      
        <Box item xs={6}>
            <TextField
            fullWidth
            label="numeros total partos"
            value={pacienteData ? pacienteData.numero_total_partos : ''} 
            onChange={(e) => {
                if (isEditing.numero_total_partos) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        numero_total_partos: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.numero_total_partos}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.numero_total_partos ? handleSaveClick('numero_total_partos') : handleEditClick('numero_total_partos'))} sx={{ ml: 1 }}>
              {isEditing.numero_total_partos ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>
      
        <Box item xs={6}>
            <TextField
            fullWidth
            label="numeros puerperios"
            value={pacienteData ? pacienteData.numero_puerperios : ''} 
            onChange={(e) => {
                if (isEditing.numero_puerperios) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        numero_puerperios: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.numero_puerperios}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.numero_puerperios ? handleSaveClick('numero_puerperios') : handleEditClick('numero_puerperios'))} sx={{ ml: 1 }}>
              {isEditing.numero_puerperios ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="Lactancia"
            value={pacienteData ? pacienteData.lactancia : ''} 
            onChange={(e) => {
                if (isEditing.lactancia) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        lactancia: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.lactancia}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.lactancia ? handleSaveClick('lactancia') : handleEditClick('lactancia'))} sx={{ ml: 1 }}>
              {isEditing.lactancia ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="fecha_ultimo_parto"
            value={pacienteData ? pacienteData.fecha_ultimo_parto : ''} 
            onChange={(e) => {
                if (isEditing.fecha_ultimo_parto) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        lactancia: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.fecha_ultimo_parto}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.fecha_ultimo_parto ? handleSaveClick('fecha_ultimo_parto') : handleEditClick('fecha_ultimo_parto'))} sx={{ ml: 1 }}>
              {isEditing.fecha_ultimo_parto ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="fecha_ultimo_papanicolaou"
            value={pacienteData ? pacienteData.fecha_ultimo_papanicolaou : ''} 
            onChange={(e) => {
                if (isEditing.fecha_ultimo_papanicolaou) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        fecha_ultimo_papanicolaou: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.fecha_ultimo_papanicolaou}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.fecha_ultimo_papanicolaou ? handleSaveClick('fecha_ultimo_papanicolaou') : handleEditClick('fecha_ultimo_papanicolaou'))} sx={{ ml: 1 }}>
              {isEditing.fecha_ultimo_papanicolaou ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="fecha_ultima_mamografia"
            value={pacienteData ? pacienteData.fecha_ultima_mamografia : ''} 
            onChange={(e) => {
                if (isEditing.fecha_ultima_mamografia) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        fecha_ultima_mamografia: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.fecha_ultima_mamografia}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.fecha_ultima_mamografia ? handleSaveClick('fecha_ultima_mamografia') : handleEditClick('fecha_ultima_mamografia'))} sx={{ ml: 1 }}>
              {isEditing.fecha_ultima_mamografia ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="fecha_ultima_densitometria"
            value={pacienteData ? pacienteData.fecha_ultima_densitometria : ''} 
            onChange={(e) => {
                if (isEditing.fecha_ultima_densitometria) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        fecha_ultima_densitometria: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.fecha_ultima_densitometria}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.fecha_ultima_densitometria ? handleSaveClick('fecha_ultima_densitometria') : handleEditClick('fecha_ultima_densitometria'))} sx={{ ml: 1 }}>
              {isEditing.fecha_ultima_densitometria ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="fecha_ultimo_ultrasonido_pelvico"
            value={pacienteData ? pacienteData.fecha_ultimo_ultrasonido_pelvico : ''} 
            onChange={(e) => {
                if (isEditing.fecha_ultimo_ultrasonido_pelvico) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        fecha_ultimo_ultrasonido_pelvico: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.fecha_ultimo_ultrasonido_pelvico}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.fecha_ultimo_ultrasonido_pelvico ? handleSaveClick('fecha_ultimo_ultrasonido_pelvico') : handleEditClick('fecha_ultimo_ultrasonido_pelvico'))} sx={{ ml: 1 }}>
              {isEditing.fecha_ultimo_ultrasonido_pelvico ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>
        </AccordionDetails>
        </Accordion>

        <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Motivo de consulta</Typography>
      </AccordionSummary>
      <AccordionDetails>  


        <Box item xs={6}>
            <TextField
            fullWidth
            label="motivo_consulta"
            value={pacienteData ? pacienteData.motivo_consulta : ''} 
            onChange={(e) => {
                if (isEditing.motivo_consulta) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        motivo_consulta: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.motivo_consulta}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.motivo_consulta ? handleSaveClick('motivo_consulta') : handleEditClick('motivo_consulta'))} sx={{ ml: 1 }}>
              {isEditing.motivo_consulta ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        </AccordionDetails>
        </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Examen Físico</Typography>
      </AccordionSummary>
      <AccordionDetails>  


        <Box item xs={6}>
            <TextField
            fullWidth
            label="presion_arterial"
            value={pacienteData ? pacienteData.presion_arterial : ''} 
            onChange={(e) => {
                if (isEditing.presion_arterial) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        presion_arterial: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.presion_arterial}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.presion_arterial ? handleSaveClick('presion_arterial') : handleEditClick('presion_arterial'))} sx={{ ml: 1 }}>
              {isEditing.presion_arterial ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="frecuencia_pulso"
            value={pacienteData ? pacienteData.frecuencia_pulso : ''} 
            onChange={(e) => {
                if (isEditing.frecuencia_pulso) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        frecuencia_pulso: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.frecuencia_pulso}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.frecuencia_pulso ? handleSaveClick('frecuencia_pulso') : handleEditClick('frecuencia_pulso'))} sx={{ ml: 1 }}>
              {isEditing.frecuencia_pulso ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="frecuencia_cardiaca"
            value={pacienteData ? pacienteData.frecuencia_cardiaca : ''} 
            onChange={(e) => {
                if (isEditing.frecuencia_cardiaca) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        frecuencia_cardiaca: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.frecuencia_cardiaca}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.frecuencia_cardiaca ? handleSaveClick('frecuencia_cardiaca') : handleEditClick('frecuencia_cardiaca'))} sx={{ ml: 1 }}>
              {isEditing.frecuencia_cardiaca ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="frecuencia_respiratoria"
            value={pacienteData ? pacienteData.frecuencia_respiratoria : ''} 
            onChange={(e) => {
                if (isEditing.frecuencia_respiratoria) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        frecuencia_respiratoria: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.frecuencia_respiratoria}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.frecuencia_respiratoria ? handleSaveClick('frecuencia_respiratoria') : handleEditClick('frecuencia_respiratoria'))} sx={{ ml: 1 }}>
              {isEditing.frecuencia_respiratoria ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="Peso"
            value={pacienteData ? pacienteData.peso : ''} 
            onChange={(e) => {
                if (isEditing.peso) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        peso: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.peso}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.peso ? handleSaveClick('peso') : handleEditClick('peso'))} sx={{ ml: 1 }}>
              {isEditing.peso ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="Altura"
            value={pacienteData ? pacienteData.altura : ''} 
            onChange={(e) => {
                if (isEditing.altura) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        altura: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.altura}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.altura ? handleSaveClick('altura') : handleEditClick('altura'))} sx={{ ml: 1 }}>
              {isEditing.altura ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="indice_masa_corporal"
            value={pacienteData ? pacienteData.indice_masa_corporal : ''} 
            onChange={(e) => {
                if (isEditing.indice_masa_corporal) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        indice_masa_corporal: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.indice_masa_corporal}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.indice_masa_corporal ? handleSaveClick('indice_masa_corporal') : handleEditClick('indice_masa_corporal'))} sx={{ ml: 1 }}>
              {isEditing.indice_masa_corporal ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="cabeza_cuello_examen"
            value={pacienteData ? pacienteData.cabeza_cuello_examen : ''} 
            onChange={(e) => {
                if (isEditing.cabeza_cuello_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        cabeza_cuello_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.cabeza_cuello_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.cabeza_cuello_examen ? handleSaveClick('cabeza_cuello_examen') : handleEditClick('cabeza_cuello_examen'))} sx={{ ml: 1 }}>
              {isEditing.cabeza_cuello_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="torax_examen"
            value={pacienteData ? pacienteData.torax_examen : ''} 
            onChange={(e) => {
                if (isEditing.torax_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        torax_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.torax_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.torax_examen ? handleSaveClick('torax_examen') : handleEditClick('torax_examen'))} sx={{ ml: 1 }}>
              {isEditing.torax_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="mamas_examen"
            value={pacienteData ? pacienteData.mamas_examen : ''} 
            onChange={(e) => {
                if (isEditing.mamas_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        mamas_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.mamas_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.mamas_examen ? handleSaveClick('mamas_examen') : handleEditClick('mamas_examen'))} sx={{ ml: 1 }}>
              {isEditing.mamas_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="abdomen_examen"
            value={pacienteData ? pacienteData.abdomen_examen : ''} 
            onChange={(e) => {
                if (isEditing.abdomen_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        abdomen_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.abdomen_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.abdomen_examen ? handleSaveClick('abdomen_examen') : handleEditClick('abdomen_examen'))} sx={{ ml: 1 }}>
              {isEditing.abdomen_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="fosas_iliacas_examen"
            value={pacienteData ? pacienteData.fosas_iliacas_examen : ''} 
            onChange={(e) => {
                if (isEditing.fosas_iliacas_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        fosas_iliacas_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.fosas_iliacas_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.fosas_iliacas_examen ? handleSaveClick('fosas_iliacas_examen') : handleEditClick('fosas_iliacas_examen'))} sx={{ ml: 1 }}>
              {isEditing.fosas_iliacas_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        </AccordionDetails>
        </Accordion>

        <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Antecedentes Ginecológico</Typography>
      </AccordionSummary>
      <AccordionDetails>  

        <Box item xs={6}>
            <TextField
            fullWidth
            label="vulva_examen"
            value={pacienteData ? pacienteData.vulva_examen : ''} 
            onChange={(e) => {
                if (isEditing.vulva_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        vulva_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.vulva_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.vulva_examen ? handleSaveClick('vulva_examen') : handleEditClick('vulva_examen'))} sx={{ ml: 1 }}>
              {isEditing.vulva_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="cuello_uterino_examen"
            value={pacienteData ? pacienteData.cuello_uterino_examen : ''} 
            onChange={(e) => {
                if (isEditing.cuello_uterino_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        cuello_uterino_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.cuello_uterino_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.cuello_uterino_examen ? handleSaveClick('cuello_uterino_examen') : handleEditClick('cuello_uterino_examen'))} sx={{ ml: 1 }}>
              {isEditing.cuello_uterino_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="bulbo_uretral_skene_examen"
            value={pacienteData ? pacienteData.bulbo_uretral_skene_examen : ''} 
            onChange={(e) => {
                if (isEditing.bulbo_uretral_skene_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        bulbo_uretral_skene_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.bulbo_uretral_skene_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.bulbo_uretral_skene_examen ? handleSaveClick('bulbo_uretral_skene_examen') : handleEditClick('bulbo_uretral_skene_examen'))} sx={{ ml: 1 }}>
              {isEditing.bulbo_uretral_skene_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="utero_examen"
            value={pacienteData ? pacienteData.utero_examen : ''} 
            onChange={(e) => {
                if (isEditing.utero_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        utero_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.utero_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.utero_examen ? handleSaveClick('utero_examen') : handleEditClick('utero_examen'))} sx={{ ml: 1 }}>
              {isEditing.utero_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="perine_examen"
            value={pacienteData ? pacienteData.perine_examen : ''} 
            onChange={(e) => {
                if (isEditing.perine_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        perine_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.perine_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.perine_examen ? handleSaveClick('perine_examen') : handleEditClick('perine_examen'))} sx={{ ml: 1 }}>
              {isEditing.perine_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="vagina_examen"
            value={pacienteData ? pacienteData.vagina_examen : ''} 
            onChange={(e) => {
                if (isEditing.vagina_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        vagina_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.vagina_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.vagina_examen ? handleSaveClick('vagina_examen') : handleEditClick('vagina_examen'))} sx={{ ml: 1 }}>
              {isEditing.vagina_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="colposcopia_examen"
            value={pacienteData ? pacienteData.colposcopia_examen : ''} 
            onChange={(e) => {
                if (isEditing.colposcopia_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        colposcopia_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.colposcopia_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.colposcopia_examen ? handleSaveClick('colposcopia_examen') : handleEditClick('colposcopia_examen'))} sx={{ ml: 1 }}>
              {isEditing.colposcopia_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

        <Box item xs={6}>
            <TextField
            fullWidth
            label="anexos_uterinos_examen"
            value={pacienteData ? pacienteData.anexos_uterinos_examen : ''} 
            onChange={(e) => {
                if (isEditing.anexos_uterinos_examen) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        anexos_uterinos_examen: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.anexos_uterinos_examen}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.anexos_uterinos_examen ? handleSaveClick('anexos_uterinos_examen') : handleEditClick('anexos_uterinos_examen'))} sx={{ ml: 1 }}>
              {isEditing.anexos_uterinos_examen ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>
      </AccordionDetails>  
      </Accordion>  

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Resumen y lista de problemas</Typography>
      </AccordionSummary>
      <AccordionDetails>  

        <Box item xs={6}>
            <TextField
            fullWidth
            label="resumen_problemas"
            value={pacienteData ? pacienteData.resumen_problemas : ''} 
            onChange={(e) => {
                if (isEditing.resumen_problemas) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        resumen_problemas: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.resumen_problemas}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.resumen_problemas ? handleSaveClick('resumen_problemas') : handleEditClick('resumen_problemas'))} sx={{ ml: 1 }}>
              {isEditing.resumen_problemas ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>

      </AccordionDetails>  
      </Accordion>

      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Plan de seguimiento</Typography>
      </AccordionSummary>
      <AccordionDetails>  

        <Box item xs={6}>
            <TextField
            fullWidth
            label="plan_seguimiento"
            value={pacienteData ? pacienteData.plan_seguimiento : ''} 
            onChange={(e) => {
                if (isEditing.plan_seguimiento) {
                    seteditingPacienteData((prev) => ({
                        ...prev,
                        plan_seguimiento: e.target.value,
                    }));
                }
            }}
            disabled = {!isEditing.plan_seguimiento}
            variant="filled"
            sx={{ 
                gridColumn: "span 1", 
                '& .MuiFilledInput-root': {
                backgroundColor: '#F2EAE1', 
                color: '#000000',            
                '&:hover': {
                    backgroundColor: '#ffffff', 
                },
                '&.Mui-disabled': {
                    backgroundColor: '#F2EAE1', 
                    opacity: 1,                  
                },
                },
                '& .MuiInputLabel-root': {
                color: '#000000',            
                fontWeight: 'bold',          
                '&.Mui-focused': {
                    color: '#ff3b6d',          
                },
                },
                '& .MuiInputBase-input': {
                fontWeight: 'bold',          
                color: '#000000',            
                fontSize: '16px',            
                },
            }}
            />
            {/* Botón de guardar/editar */}
            <IconButton onClick={() => (isEditing.plan_seguimiento ? handleSaveClick('plan_seguimiento') : handleEditClick('plan_seguimiento'))} sx={{ ml: 1 }}>
              {isEditing.plan_seguimiento ? <SaveIcon /> : <EditIcon />}
            </IconButton>
        </Box>
        </AccordionDetails>  
        </Accordion>
        </Box>
          ) : (
            // Si primer_chequeo es true, mostramos el mensaje de error
            <Box>
              <Typography>Este usuario no ha realizado el examen médico</Typography>
            </Box>
          )
        ) : (
          // Mientras se cargan los datos
          <Typography>Cargando datos...</Typography>
        )}
      </Box>
    
       {/* Cuadro 3: Formulario de examen médico */}
      <Box sx={{ marginBottom: '20px' }}>
      <Box><h1 >Agregar o editar examen médico</h1></Box>
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
          setFieldValue
        }) => (
            console.log(errors),
          <form onSubmit={handleSubmit}>
            <Box>
            <Box mt={3}>
              <h2>Antecedentes Personales y Familiares Importantes</h2>
              <h3>Antecedentes Heredo-Familiares</h3>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(3, minmax(0, 1fr))">
                    {/* Aquí integramos el componente RadioButtons */}
                  <RadioButtons
                    label="Diabetes"
                    name="AntecedentesHeredoFamiliares.diabetes_heredofamiliar"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesHeredoFamiliares.diabetes_heredofamiliar || ''}
                    onChange={handleChange}
                  />
                  <RadioButtons
                    label="Cardiacos"
                    name="AntecedentesHeredoFamiliares.cardiacos_heredofamiliar"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesHeredoFamiliares.cardiacos_heredofamiliar || ''}
                    onChange={handleChange}
                  />
                  <RadioButtons
                    label="HTA"
                    name="AntecedentesHeredoFamiliares.hta_heredofamiliar"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesHeredoFamiliares.hta_heredofamiliar || ''}
                    onChange={handleChange}
                  />
                  <RadioButtons
                    label="Cancer"
                    name="AntecedentesHeredoFamiliares.cancer_heredofamiliar"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesHeredoFamiliares.cancer_heredofamiliar || ''}
                    onChange={handleChange}
                  />
                  <RadioButtons
                    label="Cancer de mama"
                    name="AntecedentesHeredoFamiliares.cancer_mama_heredofamiliar"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesHeredoFamiliares.cancer_mama_heredofamiliar || ''}
                    onChange={handleChange}
                  />
                  <RadioButtons
                    label="Enfermedades mentales"
                    name="AntecedentesHeredoFamiliares.enfermedades_mentales_heredofamiliar"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesHeredoFamiliares.enfermedades_mentales_heredofamiliar || ''}
                    onChange={handleChange}
                  />
              </Box>
            </Box>


            <Box mt={3}>
              <h3>Antecedentes Personales Patológicos</h3>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(3, minmax(0, 1fr))">
              <RadioButtons
                    label="epi"
                    name="AntecedentesPersonalesPatologicos.epi"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesPersonalesPatologicos.epi || ''}
                    onChange={handleChange}
              />
              <RadioButtons
                    label="Hepatitis"
                    name="AntecedentesPersonalesPatologicos.Hepatitis"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesPersonalesPatologicos.Hepatitis || ''}
                    onChange={handleChange}
              />
              <RadioButtons
                    label="HTA"
                    name="AntecedentesPersonalesPatologicos.HTA"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesPersonalesPatologicos.HTA || ''}
                    onChange={handleChange}
              />
              <RadioButtons
                    label="Diabetes"
                    name="AntecedentesPersonalesPatologicos.Diabetes"
                    options={[
                      { label: "Sí", value: "1" },
                      { label: "No", value: "2" },
                    ]}
                    value={values.AntecedentesPersonalesPatologicos.Diabetes || ''}
                    onChange={handleChange}
              />            
              </Box>
            </Box>


            <Box mt={3}>
              <h3>Antecedentes Quirurgicos/Traumaticos</h3>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(3, minmax(0, 1fr))">        
              </Box>
                  {/* TextField para Antecedentes Quirúrgicos Traumáticos */}
                <TextField
                  fullWidth
                  variant="filled"
                  label=""
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.AntecedentesPersonalesPatologicos.cirugias_abdominales_antecedente || ''}
                  name="AntecedentesPersonalesPatologicos.cirugias_abdominales_antecedente"
                />
            </Box>

            <Box mt={3}>
              <h2>Antecedentes Ginecológicos</h2>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(3, minmax(0, 1fr))">
              <TextField
                fullWidth
                variant="filled"
                label="Edad Menarca"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.AntecedentesGinecologicos.EdadMenarca}
                name="AntecedentesGinecologicos.EdadMenarca"
              />
              <TextField
                fullWidth
                variant="filled"
                label="RMP"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.AntecedentesGinecologicos.RMP}
                name="AntecedentesGinecologicos.RMP"
              />
              {/* Dropdown para Cantidad */}
              <FormControl fullWidth>
                <InputLabel id="cantidad-label">Cantidad Sangrado</InputLabel>
                <Select
                  labelId="id_cantidad_sangrado-label"
                  id="id_cantidad_sangrado-select"
                  value={values.AntecedentesGinecologicos.id_cantidad_sangrado || ""}
                  onChange={(event) => {
                    setFieldValue('AntecedentesGinecologicos.id_cantidad_sangrado', event.target.value); // Usar setFieldValue para actualizar el campo anidado
                    console.log('Valor seleccionado:', event.target.value); // Verifica el valor seleccionado
                  }}
                  name="id_cantidad_sangrado"
                >
                  {cantidadOptions.map((id_cantidad_sangrado) => (
                    <MenuItem key={id_cantidad_sangrado.id} value={id_cantidad_sangrado.id}>
                      {id_cantidad_sangrado.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <RadioButtons
                label="Dismenorrea"
                name="AntecedentesGinecologicos.Dismenorrea"
                options={[
                    { label: "Sí", value: "1" },
                    { label: "No", value: "2" },
                ]}
                value={values.AntecedentesGinecologicos.Dismenorrea || ''}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Edad de PRS"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.AntecedentesGinecologicos.EdadDePRS}
                name="AntecedentesGinecologicos.EdadDePRS"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Opcion sexual"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.AntecedentesGinecologicos.id_orientacion_sexual}
                name="AntecedentesGinecologicos.id_orientacion_sexual"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Parejas sexuales"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.AntecedentesGinecologicos.ParejasSexuales}
                name="AntecedentesGinecologicos.ParejasSexuales"
              />              
              <TextField
              fullWidth
              variant="filled"
              label="FRS"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.FRS}
              name="AntecedentesGinecologicos.FRS"
              /> 
              <RadioButtons
                label="Dispareunia"
                name="AntecedentesGinecologicos.Dispareunia"
                options={[
                    { label: "Sí", value: "1" },
                    { label: "No", value: "2" },
                ]}
                value={values.AntecedentesGinecologicos.Dispareunia || ''}
                onChange={handleChange}
              />
              <RadioButtons
                label="Libido"
                name="AntecedentesGinecologicos.Libido"
                options={[
                    { label: "Sí", value: "1" },
                    { label: "No", value: "2" },
                ]}
                value={values.AntecedentesGinecologicos.Libido || ''}
                onChange={handleChange}
              />
              <RadioButtons
                label="Sangrado"
                name="AntecedentesGinecologicos.Sangrado"
                options={[
                    { label: "Sí", value: "1" },
                    { label: "No", value: "2" },
                ]}
                value={values.AntecedentesGinecologicos.Sangrado || ''}
                onChange={handleChange}
              />
              <RadioButtons
                label="Orgasmo"
                name="AntecedentesGinecologicos.Orgasmo"
                options={[
                    { label: "Sí", value: "1" },
                    { label: "No", value: "2" },
                ]}
                value={values.AntecedentesGinecologicos.Orgasmo || ''}
                onChange={handleChange}
              />
              <RadioButtons
                label="Lubricación"
                name="AntecedentesGinecologicos.lubricacion"
                options={[
                    { label: "Sí", value: "1" },
                    { label: "No", value: "2" },
                ]}
                value={values.AntecedentesGinecologicos.lubricacion || ''}
                onChange={handleChange}
              />              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="FechaUltimoParto-input"
                  label="Fecha ultimo parto"
                  value={values.FechaUltimoParto}
                  onChange={(newValue) => {
                    setFieldValue("FechaUltimoParto", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 2" }} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="FechaUltimaMamografia-input"
                  label="Fecha ultima mamografia"
                  value={values.fecha_ultima_mamografia}
                  onChange={(newValue) => {
                    setFieldValue("fecha_ultima_mamografia", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 2" }} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="FechaUltimaMamografia-input"
                  label="Fecha papanicolaou"
                  value={values.FechaPAP}
                  onChange={(newValue) => {
                    setFieldValue("FechaPAP", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 2" }} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="FechaUltimaDensitometria-input"
                  label="Fecha ultima densitometria"
                  value={values.fecha_ultima_densitometria}
                  onChange={(newValue) => {
                    setFieldValue("fecha_ultima_densitometria", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 2" }} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="FechaUltimoUltrasonido-input"
                  label="Fecha ultimo ultrasonido pelvico"
                  value={values.fecha_ultimo_ultrasonido_pelvico}
                  onChange={(newValue) => {
                    setFieldValue("fecha_ultimo_ultrasonido_pelvico", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 2" }} />}
                />
              </LocalizationProvider>
              <TextField
              fullWidth
              variant="filled"
              label="Metodos anticonceptivos tiempo"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.metodos_anticonceptivos_tiempo}
              name="AntecedentesGinecologicos.metodos_anticonceptivos_tiempo"
              /> 
              <TextField
              fullWidth
              variant="filled"
              label="Numero gestaciones"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.numero_gestaciones}
              name="AntecedentesGinecologicos.numero_gestaciones"
              /> 
              <TextField
              fullWidth
              variant="filled"
              label="Numero abortos"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.numero_abortos}
              name="AntecedentesGinecologicos.numero_abortos"
              /> 
              <TextField
              fullWidth
              variant="filled"
              label="Numero total partos"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.numero_total_partos}
              name="AntecedentesGinecologicos.numero_total_partos"
              /> 
              <TextField
              fullWidth
              variant="filled"
              label="Embarazos"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.numero_total_embarazos}
              name="AntecedentesGinecologicos.numero_total_embarazos"
              />  
              <TextField
              fullWidth
              variant="filled"
              label="Partos"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.Partos}
              name="AntecedentesGinecologicos.Partos"
              />  
              <TextField
              fullWidth
              variant="filled"
              label="Puerperios"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.Puerperios}
              name="AntecedentesGinecologicos.Puerperios"
              /> 
              <TextField
              fullWidth
              variant="filled"
              label="Lactancia"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.lactancia}
              name="AntecedentesGinecologicos.lactancia"
              />  
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="Fecha_ultimo_parto-input"
                  label="Fecha ultimo parto"
                  value={values.FechaUltimoParto}
                  onChange={(newValue) => {
                    setFieldValue("FechaUltimoParto", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} variant="filled" sx={{ gridColumn: "span 2" }} />}
                />
              </LocalizationProvider>
              </Box>
            </Box>

            <Box mt={3}>
              <h2>Motivo de consulta</h2>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(3, minmax(0, 1fr))">
              <TextField
              fullWidth
              variant="filled"
              label=""
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.AntecedentesGinecologicos.MotivoConsulta}
              name="AntecedentesGinecologicos.MotivoConsulta"
              />  
              </Box>
            </Box>

            <Box mt={3}>
              <h2>Examen Físico</h2>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(3, minmax(0, 1fr))">
                {Object.entries(values.ExamenFisico).map(([key, value]) => {
                  const labels = {
                  CabezaCuello: 'Cabeza y cuello',
                  FosasIliacas: 'Fosas Iliacas'  
                  };
                return (
                  <TextField
                    key={key}
                    id={`${key}-input`}
                    fullWidth
                    variant="filled"
                    label={labels[key] || key}  // Asigna la etiqueta personalizada si existe, si no usa la clave
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={value}
                    name={`ExamenFisico.${key}`}
                  />
                );
              })}
              </Box>
            </Box>

            <Box mt={3}>
              <h2>Examen Ginecológico</h2>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(3, minmax(0, 1fr))">
                {Object.entries(values.ExamenGinecologico).map(([key, value]) => (
                  <TextField
                    key={key}
                    id={`${key}-input`}
                    fullWidth
                    variant="filled"
                    label={key}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={value}
                    name={`ExamenGinecologico.${key}`}
                  />
                ))}
              </Box>
            </Box>

            <Box mt={3}>
            <h2>Resumen y lista de problemas</h2>
              <TextField
                id="ResumenProblemas-input"
                fullWidth
                variant="filled"
                label=""
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ResumenProblemas}
                name="ResumenProblemas"
                multiline
                rows={4}
              />
            </Box>

            <Box mt={3}>
            <h2>Plan de seguimiento</h2>
              <TextField
                id="PlanSeguimiento-input"
                fullWidth
                variant="filled"
                label=""
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.PlanSeguimiento}
                name="PlanSeguimiento"
                multiline
                rows={4}
              />
            </Box>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button variant="submit" color="primary"  type="submit" >
                Guardar Examen medico
              </Button>
              </Box>
              <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={() => setOpenErrorSnackbar(false)}>
              <Alert severity="error" sx={{ width: '100%' }}>
                Por favor, revise todos los campos.
              </Alert>
            </Snackbar>
            <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={() => setOpenSuccessSnackbar(false)}>
              <Alert severity="success" sx={{ width: '100%' }}>
                Paciente editado exitosamente.
              </Alert>
            </Snackbar>
          </form>
        )}
      </Formik>
      </Box>
    </Box>
    </>
  );
};

export default EditarPaciente;