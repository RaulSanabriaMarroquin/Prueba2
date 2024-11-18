import { Box, Button, Snackbar, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { esES } from "@mui/x-data-grid/locales";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Pacientes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Función para calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthdate) => {
    if (!birthdate) return ''; // Si no hay fecha de nacimiento, retornar cadena vacía
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Función para formatear la fecha de nacimiento
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  // Función para formatear números de teléfono en formato 8580-0604
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.toString().replace(/\D/g, ''); // Remueve caracteres no numéricos
    return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2'); // Aplica formato 8580-0604
  };

  const formatCedula = (cedula) => {
    if (!cedula) return '';
    const cleaned = cedula.toString().replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (cleaned.length === 9) {
      // Cédula costarricense: X-XXX-XXXX
      return cleaned.replace(/(\d)(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 11) {
      // Cédula DIMEX: XX-XXXX-XXXX
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return cedula; // Si no coincide con ningún formato, se devuelve como está
  };

  const deletePacientes = async (id) => {
    try {
      const response = await fetch('https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/deletePacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id_paciente": id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType && contentType.includes('application/json')) {
        result = await response.json(); // Si es JSON, analizar como JSON
      } else {
        result = await response.text(); // Si no es JSON, leerlo como texto
      }      

      // Verificar si el mensaje de la respuesta indica éxito
      if (typeof result === 'string' && result.includes('se eliminó')) {
        console.log('Paciente eliminado:', result);
  
        // Eliminar el paciente de la lista actual
        setPacientes((prev) => prev.filter((paciente) => paciente.id_paciente !== id));
  
        // Mostrar el Snackbar de éxito
        setSnackbarMessage("Paciente eliminado con éxito.");
        setOpenSnackbar(true);
      } else {
        throw new Error("El mensaje de eliminación no fue exitoso.");
      }
    } catch (error) {
      console.error('Error eliminando el paciente:', error);
  
      // Mostrar el Snackbar de error
      setSnackbarMessage("Error al eliminar el paciente.");
      setOpenSnackbar(true);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await fetch('https://dev-sistema-de-gestiones-de-expedientes-api.azurewebsites.net/api/getPacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos obtenidos:", data);

      const formattedData = data.map((item) => ({
        id_paciente: item.id_paciente,
        identificacion_paciente: formatCedula(item.identificacion_paciente),
        nombre_paciente: item.nombre_paciente,
        primer_apellido_paciente: item.primer_apellido_paciente,
        segundo_apellido_paciente: item.segundo_apellido_paciente || '', // Manejo si es undefined
        fecha_nacimiento_paciente: formatDate(item.fecha_nacimiento_paciente), // Formatear fecha de nacimiento
        numero_celular_paciente: formatPhoneNumber(item.numero_celular_paciente),
        correo_electronico_paciente: item.correo_electronico_paciente,
        lugar_residencia_paciente: item.lugar_residencia_paciente,
        id_estado_civil: item.id_estado_civil,
        fecha_registro_paciente: item.fecha_registro_paciente,
        ocupacion_paciente: item.ocupacion_paciente ,
        primer_chequeo: item.primer_chequeo,
        diabetes_heredofamiliar: item.diabetes_heredofamiliar,
        cardiacos_heredofamiliar: item.cardiacos_heredofamiliar,
        hta_heredofamiliar: item.hta_heredofamiliar,
        cancer_heredofamiliar: item.cancer_heredofamiliar,
        cancer_mama_heredofamiliar: item.cancer_mama_heredofamiliar ,
        enfermedades_mentales_heredofamiliar: item.enfermedades_mentales_heredofamiliar,
        epi: item.epi,
        Hepatitis: item.Hepatitis,
        HTA: item.HTA ,
        Diabetes: item.Diabetes,
        cirugias_abdominales_antecedente: item.cirugias_abdominales_antecedente,
        EdadMenarca: item.EdadMenarca,
        RMP: item.RMP,
        id_cantidad_sangrado: item.id_cantidad_sangrado,
        Dismenorrea: item.Dismenorrea,
        EdadDePRS: item.EdadDePRS,
        id_orientacion_sexual: item.id_orientacion_sexual ,
        ParejasSexuales: item.ParejasSexuales ,
        FRS: item.FRS ,
        Dispareunia: item.Dispareunia ,
        Libido: item.Libido ,
        Sangrado: item.Sangrado ,
        Orgasmo: item.Orgasmo ,
        lubricacion: item.lubricacion ,
        FechaPAP: item.FechaPAP ,
        fecha_ultima_mamografia: item.fecha_ultima_mamografia ,
        fecha_ultima_densitometria: item.fecha_ultima_densitometria ,
        fecha_ultimo_ultrasonido_pelvico: item.fecha_ultimo_ultrasonido_pelvico ,
        metodos_anticonceptivos_tiempo: item.metodos_anticonceptivos_tiempo,
        numero_gestaciones: item.numero_gestaciones ,
        numero_abortos: item.numero_abortos ,
        numero_total_partos: item.numero_total_partos ,
        numero_total_embarazos: item.numero_total_embarazos ,
        Partos: item.Partos ,
        Puerperios: item.Puerperios ,
        lactancia: item.lactancia ,
        fecha_ultima_menstruacion: item.fecha_ultima_menstruacion,
        FechaUltimoParto: item.FechaUltimoParto ,
        MotivoConsulta: item.MotivoConsulta,
        PA: item.PA,
        Pulso: item.Pulso,
        FC: item.FC,
        FR: item.FR ,
        peso: item.peso ,
        altura: item.altura ,
        IMC: item.IMC ,
        CabezaCuello: item.CabezaCuello ,
        Torax: item.Torax ,
        Mamas: item.Mamas ,
        abdomen_examen: item.abdomen_examen ,
        FosasIliacas: item.FosasIliacas ,
        Vulva: item.Vulva ,
        Cuello: item.Cuello ,
        bulbo_uretral_skene_examen: item.bulbo_uretral_skene_examen ,
        Utero: item.Utero ,
        Perine: item.Perine ,
        Vagina: item.Vagina ,
        colposcopia_examen: item.colposcopia_examen ,
        anexos_uterinos_examen: item.anexos_uterinos_examen ,
        ResumenProblemas: item.ResumenProblemas ,
        PlanSeguimiento: item.PlanSeguimiento,
      }));

      setPacientes(formattedData);
    } catch (error) {
      console.error("Error fetching pacientes: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleDelete = (id) => {
    console.log(`Delete patient with ID: ${id}`);
    deletePacientes(id);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


  const columns = [
    { field: "identificacion_paciente", headerName: "Cédula", flex: 1 },
    {
      field: "nombre_paciente",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "primer_apellido_paciente",
      headerName: "Primer Apellido",
      flex: 1,
    },
    {
      field: "segundo_apellido_paciente",
      headerName: "Segundo Apellido",
      flex: 1,
    },
    {
      field: "fecha_nacimiento_paciente",
      headerName: "Fecha de Nacimiento",
      flex: 1,
    },
    {
      field: "numero_celular_paciente",
      headerName: "Número de celular",
      flex: 1,
    },
    {
      field: "correo_electronico_paciente",
      headerName: "Correo electrónico",
      flex: 1,
    },   
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ height: '100%' }}>
          <Link
            to={`/view/verControl?id=${params.row.id_paciente}`}
            state={{ servicioData: params.row }}
            style={{ textDecoration: 'none' }}
          >
            <Button
              sx={{ 
                minWidth: "40px", 
                marginRight: '5px',
                '& .MuiSvgIcon-root': {
                  color: colors.greenAccent[500],
                  transition: 'all 0.3s ease-in-out',
                },
                '&:hover .MuiSvgIcon-root': {
                  color: '#868dfb',
                  transform: 'scale(1.2)',
                }
              }}
            >
              <VisibilityOutlinedIcon />
            </Button>
          </Link>
          <Link
            to={`/edit/editarPaciente?id=${params.row.id_paciente}`}
            state={{ userData: params.row }}
            style={{ textDecoration: 'none' }}
          >
          <Button 
              sx={{ 
                minWidth: "40px", 
                marginRight: '5px',
                '& .MuiSvgIcon-root': {
                  color: colors.greenAccent[500],
                  transition: 'all 0.3s ease-in-out',
                },
                '&:hover .MuiSvgIcon-root': {
                  color: '#868dfb',
                  transform: 'scale(1.2)',
                }
              }}
            >
              <EditOutlinedIcon />
            </Button>
          </Link>
          <Button 
            onClick={() => handleDelete(params.row.id_paciente)} 
            sx={{ 
              minWidth: "40px",
              '& .MuiSvgIcon-root': {
                color: colors.greenAccent[500],
                transition: 'all 0.3s ease-in-out',
              },
              '&:hover .MuiSvgIcon-root': {
                color: '#868dfb',
                transform: 'scale(1.2)',
              }
            }}
          >
            <DeleteOutlineIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Pacientes"
          subtitle="Lista de pacientes registrados en la base de datos"
        />
        <Box>
          <Link to="/form/crearPaciente" style={{ textDecoration: 'none' }}>
          <Button
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
                }
              }}
            >
              <AddOutlinedIcon 
                sx={{ 
                  mr: "10px",
                  transition: "transform 0.3s ease-in-out"
                }} 
              />
              Agregar Paciente
            </Button>
          </Link>
        </Box>
      </Box>

      <Box
        m="0 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {!loading ? (
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={pacientes}
            columns={columns}
            getRowId={(row) => row.id_paciente}
            components={{ Toolbar: GridToolbar }}
            initialState={{
              sorting: {
                sortModel: [
                  { field: 'nombre_paciente', sort: 'asc' },
                  { field: 'primer_apellido_paciente', sort: 'asc' },
                  { field: 'segundo_apellido_paciente', sort: 'asc' },
                  { field: 'fecha_nacimiento_paciente', sort: 'asc' }        
                ],
              },
            }}
          />
        ) : (
          <p>Cargando pacientes...</p>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Error") ? "error" : "success"} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Pacientes;
