import React from 'react';
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const VerPacientes = () => {
    const location = useLocation();
    const pacienteData = location.state?.pacienteData;
    console.log(pacienteData)

    const navigate = useNavigate();

    if (!pacienteData) {
        navigate('/pacientes'); // Redirige si no hay datos
        return null;
    }

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        });
    };

    const handleBack = () => {
        navigate('/pacientes');
    };

    const handleEdit = () => {
        navigate(`/form/editarPaciente`, { state: { editMode: true, pacienteData: pacienteData } });
    };

    return (
        <Box padding={3}>
            <Header
                title="Detalles del Paciente"
                subtitle="Revise la información detallada del paciente seleccionado"
            />
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Datos Personales</Typography>
                        <Typography variant="body1">Nombre: {pacienteData[0].Nombre}</Typography>
                        <Typography variant="body1">Apellidos: {pacienteData[0].Apellidos}</Typography>
                        <Typography variant="body1">Cédula: {pacienteData[0].Cedula}</Typography>
                        <Typography variant="body1">Fecha de Nacimiento: {formatFecha(pacienteData[0].Fecha_Nacimiento)}</Typography>
                        <Typography variant="body1">Altura: {pacienteData[0].Altura} cm</Typography>
                        <Typography variant="body1">Peso: {pacienteData[0].Peso} kg</Typography>
                        <Typography variant="body1">Lugar de Residencia: {pacienteData[0].Residencia}</Typography>
                        <Typography variant="body1">Correo Electrónico: {pacienteData[0].Correo_Electronico}</Typography>
                        <Typography variant="body1">Ocupación: {pacienteData[0].Ocupacion}</Typography>
                        <Typography variant="body1">Fecha de Registro: {formatFecha(pacienteData[0].Fecha_Registro)}</Typography>
                        <Typography variant="body1">Estado Civil: {pacienteData[0].Estado_Civil}</Typography>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Contacto de Emergencia</Typography>
                        <Typography variant="body1">Nombre: {pacienteData[0].NombreC}</Typography>
                        <Typography variant="body1">Apellidos: {pacienteData[0].ApellidosC}</Typography>
                        <Typography variant="body1">Relación: {pacienteData[0].Relacion}</Typography>
                        <Typography variant="body1">Residencia: {pacienteData[0].ResidenciaC}</Typography>
                        <Typography variant="body1">Número de Celular: {pacienteData[0].Numero_celularC}</Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Antecedentes Obstétricos</Typography>
                        <Typography variant="body1">{pacienteData[0].Obstetricos}</Typography>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Antecedentes Personales</Typography>
                        <Typography variant="body1">{pacienteData[0].Personales}</Typography>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Antecedentes Preconcepcionales</Typography>
                        <Typography variant="body1">{pacienteData[0].Preconceptivos}</Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="contained" onClick={handleBack}>Regresar</Button>
                <Button variant="contained" color="secondary" onClick={handleEdit}>
                    Editar
                </Button>
            </Box>
        </Box>
    );
};

export default VerPacientes;