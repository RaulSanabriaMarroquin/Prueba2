import { Box, Button, Snackbar, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { esES } from "@mui/x-data-grid/locales";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Pacientes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

      const result = await response.json();
      console.log('Paciente eliminado:', result);

      // Eliminar el paciente de la lista actual
      setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));

      // Mostrar el Snackbar de éxito
      setSnackbarMessage("Paciente eliminado con éxito.");
      setOpenSnackbar(true);
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
      console.log(data);

      const formattedData = data.map((item) => ({
        id: item.id_paciente,
        registrarId: item.identificacion_paciente,
        name: `${item.nombre_paciente} ${item.primer_apellido_paciente} ${item.segundo_apellido_paciente}`,
        dateOfBirth: item.fecha_nacimiento_paciente,
        phone: item.numero_celular_paciente,
        email: item.correo_electronico_paciente,
        address: item.lugar_residencia_paciente,
        city: item.lugar_residencia_paciente,
        zipCode: item.id_estado_civil,
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
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Cédula" },
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Edad",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Número de celular",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Correo electrónico",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Dirección",
      flex: 1,
    },
    {
      field: "city",
      headerName: "Ciudad",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Código Postal",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ height: '100%' }}>
          <Link to={`/edit/editarPaciente?id=${params.row.id}`} style={{ textDecoration: 'none' }}>
            <Button color="primary" sx={{ minWidth: "40px", marginRight: '5px' }}>
              <EditOutlinedIcon />
            </Button>
          </Link>
          <Button onClick={() => handleDelete(params.row.id)} color="secondary" sx={{ minWidth: "40px" }}>
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
                borderRadius: "12px",
                '&:hover': {
                  backgroundColor: "#ff3b6d",
                  color: "white",
                },
              }}
            >
              <AddOutlinedIcon sx={{ mr: "10px" }} />
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
            components={{ Toolbar: GridToolbar }}
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
