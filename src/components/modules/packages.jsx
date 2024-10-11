import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, Form } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

import Pagination from '@mui/material/Pagination';

import Stack from '@mui/material/Stack';

import { useNavigate } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado

import { Label } from 'reactstrap';

import Select from 'react-select';

 

const initialServices = [

    {

        id: 1,

        nombre: "Especial",

        descripcion: "Alojamiento del ejemplar",

        valor: "50 USD",

        estado: false,

        serviciosAsociados: [

            { id: 1, nombre: "Servicio 1" },

            { id: 2, nombre: "Servicio 2" }

        ]

    },

    {

        id: 2,

        nombre: "Normal",

        descripcion: "Alimentación al ejemplar las veces son correspondidas",

        valor: "30 USD",

        estado: true,

        serviciosAsociados: [

            { id: 3, nombre: "Servicio 3" },

            { id: 4, nombre: "Servicio 4" }

        ]

    },

    {

        id: 3,

        nombre: "Premium",

        descripcion: "Cuidado médico al ejemplar las veces que así lo requiera",

        valor: "80 USD",

        estado: true,

        serviciosAsociados: [

            { id: 5, nombre: "Servicio 5" },

            { id: 6, nombre: "Servicio 6" }

        ]

    }

];

const opcionesServicios = [

    { id: 1, name: "Servicio de limpieza" },

    { id: 2, name: "Servicio de alimentación" },

    { id: 3, name: "Servicio de cuidado médico" },

    { id: 4, name: "Servicio de entretenimiento" },

    { id: 5, name: "Servicio de educación" }

];

 

class Packages extends React.Component {

    state = {

        services: initialServices,

        allServices: initialServices,

        searchTerm: '',

        form: {

            id: '',

            nombre: '',

            descripcion: '',

            valor: '',

            estado: true,

            selectedServices: [],

            selectedOption: '', // Para manejar la opción seleccionada

            customService: '',  // Para manejar el texto de entrada personalizado

        },

        modalAñadir: false,

        modalEditar: false,

        currentPage: 1,

        servicesPerPage: 3,

    };

 

    mostrarModalAñadir = () => {

        this.setState({

            modalAñadir: true,

            form: { id: '', nombre: '', descripcion: '', valor: '', estado: true, selectedServices: [] }

        });

    };

 

    ocultarModalAñadir = () => {

        this.setState({ modalAñadir: false });

    };

 

    mostrarModalEditar = (service) => {

        this.setState({ modalEditar: true, form: { ...service, selectedServices: [] } });

    };

 

    ocultarModalEditar = () => {

        this.setState({ modalEditar: false });

    };

 

    handleChange = (e) => {

        const { name, value, type } = e.target;

        this.setState({

            form: {

                ...this.state.form,

                [name]: value

            }

        });

    };

 

    handleSelectService = (selectedOptions) => {

        const selectedServices = selectedOptions.map(option => option.value);

        this.setState({ form: { ...this.state.form, selectedServices } });

    };

 

    handleSelectOption = (e) => {

        const value = e.target.value;

        this.setState(prevState => ({

            form: {

                ...prevState.form,

                selectedOption: value,

                customService: value === 'custom' ? '' : prevState.form.customService // Limpiar si no es "custom"

            }

        }));

    };

 

    handleCustomServiceChange = (e) => {

        this.setState(prevState => ({

            form: {

                ...prevState.form,

                customService: e.target.value

            }

        }));

    };

 

    eliminarServicioSeleccionado = (serviceId) => {

        const selectedServices = this.state.form.selectedServices.filter(id => id !== serviceId);

        this.setState({ form: { ...this.state.form, selectedServices } });

    };

 

    añadirServicio = () => {

        try {

            const { nombre, descripcion, valor, selectedServices, selectedOption, customService } = this.state.form;

            if (selectedOption === 'custom' && customService.trim() === '') {

                Swal.fire({

                    icon: "error",

                    title: "Oops...",

                    text: "Por favor, ingrese un nombre de servicio personalizado.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            if (nombre.trim() === '' || descripcion.trim() === '' || valor.trim() === '') {

                Swal.fire({

                    icon: "error",

                    title: "Oops...",

                    text: "Por favor, ingrese todos los campos.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            const regex = /^[A-Za-z][A-Za-z 0-9\s]*$/;

            if (!regex.test(nombre)) {

                Swal.fire({

                    icon: "error",

                    title: "Oops...",

                    text: "El nombre del paquete no puede comenzar con un número ni contener caracteres especiales.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            if (selectedServices.length === 0) {

                Swal.fire({

                    icon: "error",

                    title: "Oops...",

                    text: "Por favor, seleccione al menos un servicio.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            const servicioExistente = this.state.services.find(servicio => servicio.nombre.toLowerCase() === nombre.toLowerCase());

            if (servicioExistente) {

                Swal.fire({

                    icon: "error",

                    title: "Error",

                    text: "El paquete ya existe. Por favor, ingrese un nombre de paquete diferente.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            const nuevoServicio = {

                ...this.state.form,

                id: this.state.services.length + 1,

                descripcion: descripcion.split('\n'),

                selectedServices: selectedServices.map(id => this.state.allServices.find(service => service.id === id)),

                nombre: selectedOption === 'custom' ? customService : selectedOption // Usar el nombre personalizado si se selecciona "custom"

            };

            const lista = [...this.state.services, nuevoServicio];

            this.setState({ services: lista, modalAñadir: false });

            Swal.fire({

                position: "center",

                icon: "success",

                title: "Paquete agregado exitosamente",

                showConfirmButton: false,

                timer: 1500,

                customClass: {

                    confirmButton: 'custom-swal'

                }

            });

        } catch (error) {

            Swal.fire({

                icon: "error",

                title: "Oops...",

                text: `Error al añadir el paquete: ${error.message}`,

                customClass: {

                    confirmButton: 'custom-swal'

                }

            });

        }

    };

 

    editarServicio = () => {

        try {

            const { nombre, descripcion, valor } = this.state.form;

 

            const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;

            if (!regex.test(nombre)) {

                Swal.fire({

                    icon: "error",

                    title: "Oops...",

                    text: "El nombre del servicio no puede comenzar con un número ni contener caracteres especiales.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            if (nombre.trim() === '' || descripcion.trim() === '' || valor.trim() === '') {

                Swal.fire({

                    icon: "error",

                    title: "Oops...",

                    text: "Por favor, ingrese todos los campos.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            const servicioExistente = this.state.services.find(servicio =>

                servicio.nombre.toLowerCase() === nombre.toLowerCase() && servicio.id !== this.state.form.id

            );

            if (servicioExistente) {

                Swal.fire({

                    icon: "error",

                    title: "Error",

                    text: "El servicio ya existe. Por favor, ingrese un nombre de servicio diferente.",

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

                return;

            }

 

            const lista = this.state.services.map((s) =>

                s.id === this.state.form.id ? this.state.form : s

            );

            this.setState({ services: lista, modalEditar: false });

            Swal.fire({

                position: "center",

                icon: "success",

                title: "Servicio actualizado exitosamente",

                showConfirmButton: false,

                timer: 1500,

                customClass: {

                    confirmButton: 'custom-swal'

                }

            });

        } catch (error) {

            Swal.fire({

                icon: "error",

                title: "Oops...",

                text: `Error al actualizar el servicio: ${error.message}`,

                customClass: {

                    confirmButton: 'custom-swal'

                }

            });

        }

    };

 

    eliminarServicio = (service) => {

        Swal.fire({

            title: '¿Estás seguro?',

            text: '¡No podrás revertir esto!',

            icon: 'warning',

            showCancelButton: true,

            confirmButtonColor: '#3085d6',

            cancelButtonColor: '#d33',

            cancelButtonText: 'No, cancelar',

            confirmButtonText: 'Sí, eliminar',

            reverseButtons: true,

            customClass: {

                cancelButton: 'custom-swal',

                confirmButton: 'custom -swal'

            },

            didOpen: (modal) => {

                const icon = modal.querySelector('.swal2-icon.swal2-warning');

                if (icon) {

                    icon.style.color = '#f1c40f';

                    icon.style.borderColor = '#f1c40f';

                }

            }

        }).then((result) => {

            if (result.isConfirmed) {

                const lista = this.state.services.filter((s) => s.id !== service.id);

                this.setState({ services: lista });

                Swal.fire({

                    position: "center",

                    icon: "success",

                    title: "Servicio eliminado exitosamente",

                    showConfirmButton: false,

                    timer: 1500,

                    customClass: {

                        confirmButton: 'custom-swal'

                    }

                });

            }

        });

    };

 

    cambiarEstado = (id) => {

        const lista = this.state.services.map((s) =>

            s.id === id ? { ...s, estado: !s.estado } : s

        );

        this.setState({ services: lista });

    };

 

    handleSearch = (e) => {

        const searchTerm = e.target.value.toLowerCase();

        this.setState({ searchTerm }, () => {

            this.setState({

                services: this.state.allServices.filter((service) =>

                    service.nombre.toLowerCase().includes(this.state.searchTerm) ||

                    service.descripcion.toLowerCase().includes(this.state.searchTerm)

                )

            });

        });

    };

 

    handlePageChange = (event, page) => {

        this.setState({ currentPage: page });

    };

 

    renderServices = () => {

        const { currentPage, servicesPerPage } = this.state;

        const indexOfLastService = currentPage * servicesPerPage;

        const indexOfFirstService = indexOfLastService - servicesPerPage;

        const currentServices = this.state.services.slice(indexOfFirstService, indexOfLastService);

 

        return currentServices.map((service) => (

            <div className="card m-3" style={{ width: '20rem', height: '25rem', display: 'flex', flexDirection: 'column' }} key={service.id}>

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: '1', padding: '1rem' }}>

                    <h5 className="card-title">{service.nombre}</h5>

                    <p className="card-subtitle mb-2 text-muted">Servicios Asociados</p>

                    <p className="card-text" style={{

                        height: '7rem',

                        border: '1px solid #ccc',

                        padding: '0.5rem',

                        overflowY: 'auto',

                        marginBottom: '1rem'

                    }}>

                        {service.descripcion}

                    </p>

                    <p className="card-subtitle mb-2 text-muted">Valor del Paquete:</p>

                    <FormGroup style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '0.2rem', borderRadius: '0.2rem', marginBottom: '0.5rem', flex: '1' }}>

                        <Input

                            type="text"

                            value={service.valor}

                            disabled

                            style={{ textAlign: 'start', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: '0.8rem' }}

                        />

                    </FormGroup>

                    <div className="d-flex justify-content-between align-items-center" style={{ marginTop: 'auto' }}>

                        <FormGroup style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '0.2rem', borderRadius: '0.2rem', marginBottom: '0.5rem', flex: '1' }}>

                            <Input

                                type="text"

                                value={service.estado ? "Activo" : "Inactivo"}

                                disabled

                                style={{ textAlign: 'start', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: '0.8rem' }}

                            />

                        </FormGroup>

                        <div className="d-flex align-items-center" style={{ marginLeft: '1rem' }}>

                            <Button

                                color={service.estado ? "secondary" : "success"}

                                onClick={() => this.cambiarEstado(service.id)}

                                style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}

                            >

                                {service.estado ? "Off" : "On"}

                            </Button>

                            <Button

                                color="dark"

                                onClick={() => this.mostrarModalEditar(service)}

                                style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}

                            >

                                <FontAwesomeIcon icon={faEdit} />

                            </Button>

                            <Button

                                color="danger"

                                onClick={() => this.eliminarServicio(service)}

                                style={{ fontSize: '0.75rem' }}

                            >

                                <FontAwesomeIcon icon={faTrash} />

                            </Button>

                        </ div>

                    </div>

                    <Button

                        style={{

                            padding: '10px',

                            backgroundColor: 'black',

                            color: '#fff',

                            border: 'none',

                            borderRadius: '4px',

                            fontSize: '1rem',

                            cursor: 'pointer',

                            flex: '1',

                        }}

                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e2b82c'}

                        onMouseLeave={(e) => e.target.style.backgroundColor = 'black'}

                        onClick={() => this.handleView(service.id)}

                    >

                        Ver

                    </Button>

                </div>

            </div>

        ));

    };

 

    handleView = (id) => {

        const { navigate } = this.props; // Utilizamos navigate del props

        navigate(`/DetailsP/${id}`);

    };

 

    render() {

        const { modalAñadir, modalEditar, searchTerm, currentPage, servicesPerPage } = this.state;

        const totalPages = Math.ceil(this.state.services.length / servicesPerPage);

        return (

            <Container>

                <div className="d-flex justify-content-between align-items-center mt-3">

                    <Input

                        type="search"

                        placeholder="Buscar"

                        value={searchTerm}

                        onChange={this.handleSearch}

                        style={{ width: '300px' }}

                    />

                    <Button style={{ backgroundColor: '#198754' }} onClick={this.mostrarModalAñadir}>Añadir Servicio</Button>

                </div>

                <div className="d-flex flex-wrap justify-content-center">

                    {this.renderServices()}

                </div>

                <div className="d-flex justify-content-center mt-3">

                    <Stack spacing={2}>

                        <Pagination

                            count={totalPages}

                            page={currentPage}

                            onChange={this.handlePageChange}

                            color="primary"

                        />

                    </Stack>

                </div>

 

                {/* Modal Añadir */}

                <Modal isOpen={modalAñadir} toggle={this.ocultarModalAñadir}>

                    <ModalHeader toggle={this.ocultarModalAñadir}>Añadir Servicio</ModalHeader>

                    <ModalBody>

                        <Form>

                            <FormGroup>

                                <Input

                                    type="text"

                                    name="nombre"

                                    placeholder="Nombre"

                                    value={this.state.form.nombre}

                                    onChange={this.handleChange}

                                />

                            </FormGroup>

                            <FormGroup>

                                <Input

                                    type="textarea"

                                    name="descripcion"

                                    placeholder="Descripción"

                                    value={this.state.form.descripcion}

                                    onChange={this.handleChange}

                                />

                            </FormGroup>

                            <FormGroup>

                                <Input

                                    type="number"

                                    name="valor"

                                    placeholder="Valor"

                                    value={this.state.form.valor}

                                    onChange={this.handleChange}

                                />

                            </FormGroup>

                            <FormGroup>

                            <Label>Seleccione servicios:</Label>

    <Select

        options={opcionesServicios.map(option => ({ value: option.id, label: option.name }))}

        value={this.state.form.selectedServices.map(serviceId => ({ value: serviceId, label: opcionesServicios.find(option => option.id === serviceId).name }))}

        onChange={this.handleSelectService}

        isMulti

    />

                            </FormGroup>

                            <FormGroup>

                                <Label>Servicios seleccionados:</Label>

                                <ul>

                                    {this.state.form.selectedServices.map(serviceId => {

                                        const service = this.state.allServices.find(s => s.id === serviceId);

                                        return service ? (

                                            <li key={service.id}>

                                                {service.nombre}

                                                <Button

                                                    color="danger"

                                                    onClick={() => this.eliminarServicioSeleccionado(serviceId)}

                                                    style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}

                                                >

                                                    <FontAwesomeIcon icon={faTrash} />

                                                </Button>

                                            </li>

                                        ) : null;

                                    })}

                                </ul>

                            </FormGroup>

                        </Form>

                    </ModalBody>

                    <ModalFooter>

                        <Button color="primary" onClick={this.añadirServicio}>Añadir</Button>

                        <Button color="secondary" onClick={this.ocultarModalAñadir}>Cancelar</Button>

                    </ModalFooter>

                </Modal>

 

                {/* Modal Editar */}

                <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>

                    <ModalHeader toggle={this.ocultarModalEditar}>Editar Servicio</ModalHeader>

                    <ModalBody>

                        <Form>

                            <FormGroup>

                                <Input

                                    type="text"

                                    name="nombre"

                                    placeholder="Nombre"

                                    value={this.state.form.nombre}

                                    onChange={this.handleChange}

                                />

                            </FormGroup>

                            <FormGroup>

                                <Input

                                    type="textarea"

                                    name="descripcion"

                                    placeholder="Descripción"

                                    value={this.state.form.descripcion}

                                    onChange={this.handleChange}

                                />

                            </FormGroup>

                            <FormGroup>

                                <Input

                                    type="number"

                                    name="valor"

                                    placeholder="Valor"

                                    value={this.state.form.valor}

                                    onChange={this.handleChange}

                                />

                            </FormGroup>

                        </Form>

                    </ModalBody>

                    <ModalFooter>

                        <Button color="primary" onClick={this.editarServicio}>Guardar cambios</Button>{' '}

                        <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>

                    </ModalFooter>

                </Modal>

            </Container>

        );

    }

}

 

const PackagesWithNavigate = (props) => {

    const navigate = useNavigate();

    return <Packages {...props} navigate={navigate} />;

};

 

export default PackagesWithNavigate;