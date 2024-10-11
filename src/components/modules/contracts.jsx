import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup, Label } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

 

// Datos iniciales de contratos

const data = [

  {

    id: 1,

    nombreCompleto: "Carolina Guzman",

    fechaInicio: "2023-01-01",

    fechaFin: "2023-12-31",

    precioMensual: 150,

    ejemplarContrato: "Ejemplar 1",

    archivoContrato: null // Se añadirá el archivo aquí

  },

  {

    id: 2,

    nombreCompleto: "Andra Torres",

    fechaInicio: "2023-02-01",

    fechaFin: "2023-08-01",

    precioMensual: 200,

    ejemplarContrato: "Ejemplar 2",

    archivoContrato: null // Se añadirá el archivo aquí

  }

];

 

class Contracts extends React.Component {

  state = {

   data: data,

    filteredData: data,

    form: {

      id: '',

      nombreCompleto: '',

      fechaInicio: '',

      fechaFin: '',

      precioMensual: '',

      ejemplarContrato: '',

      archivoContrato: null

    },

    modalAñadir: false,

    modalEditar: false,

    searchText: '',

    fileError: ''

  };

 

  handleChange = e => {

    this.setState({

      form: {

        ...this.state.form,

        [e.target.name]: e.target.value,

      }

    });

  }

 

  handleFileChange = e => {

    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {

      this.setState({ fileError: 'Solo se permiten archivos PDF.' });

      return;

    }

    this.setState({

      form: {

        ...this.state.form,

        archivoContrato: file,

      },

      fileError: ''

    });

  }

 

  handleSearch = e => {

    const searchText = e.target.value.toLowerCase();

    this.setState({

      searchText,

      filteredData: this.filterData(searchText)

    });

  }

 

  filterData = (searchText) => {

    return this.state.data.filter(item =>

      (item.nombreCompleto.toLowerCase().includes(searchText) ||

      item.fechaInicio.includes(searchText) ||

      item.fechaFin.includes(searchText) ||

      item.precioMensual.toString().includes(searchText))

    );

  }

 

  mostrarmodalAñadir = () => {

    this.setState({

      modalAñadir: true,

      form: {

        id: '',

        nombreCompleto: '',

        fechaInicio: '',

        fechaFin: '',

        precioMensual: '',

        ejemplarContrato: '',

        archivoContrato: null

      },

      fileError: ''

    });

  }

 

  ocultarmodalAñadir = () => {

    this.setState({ modalAñadir: false });

  }

 

  mostrarModalEditar = (registro) => {

    this.setState({ modalEditar: true, form: registro, fileError: '' });

  }

 

  ocultarModalEditar = () => {

    this.setState({ modalEditar: false });

  }

 

  Añadir = () => {

    const { nombreCompleto, fechaInicio, fechaFin, precioMensual, ejemplarContrato, archivoContrato } = this.state.form;

 

    // Validar campos obligatorios

    if (!nombreCompleto || !fechaInicio || !fechaFin || !precioMensual || !ejemplarContrato || !archivoContrato) {

      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');

      return;

    }

 

    const valorNuevo = { ...this.state.form, id: this.state.data.length + 1 };

    const lista = [...this.state.data, valorNuevo];

    this.setState({ data: lista, filteredData: this.filterData(this.state.searchText), modalAñadir: false });

    Swal.fire('Éxito', 'Contrato registrado exitosamente.', 'success');

  }

 

  editar = (dato) => {

    // Validar campos obligatorios

    if (!dato.nombreCompleto || !dato.fechaInicio || !dato.fechaFin || !dato.precioMensual || !dato.ejemplarContrato) {

      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');

      return;

    }

 

    const lista = this.state.data.map(registro =>

      registro.id === dato.id ? { ...dato } : registro

    );

    this.setState({ data: lista, filteredData: this.filterData(this.state.searchText), modalEditar: false });

    Swal.fire('Éxito', 'Contrato actualizado exitosamente.', 'success');

  }

 

  eliminar = (dato) => {

   Swal.fire({

      title: '¿Estás seguro?',

      text: `Realmente deseas eliminar el contrato ${dato.id}?`,

      icon: 'warning',

      showCancelButton: true,

    }).then(result => {

      if (result.isConfirmed) {

        const lista = this.state.data.filter(registro => registro.id !== dato.id);

        this.setState({ data: lista, filteredData: this.filterData(this.state.searchText) });

        Swal.fire('Eliminado', 'Contrato eliminado exitosamente.', 'success');

      }

    });

  }

 

  previsualizarContrato = (archivo) => {

    if (archivo) {

      const url = URL.createObjectURL(archivo);

      window.open(url, '_blank');

    } else {

      Swal.fire('Error', 'No hay archivo para mostrar.', 'error');

    }

  }

 

  render() {

    const { form, modalAñadir, modalEditar, fileError } = this.state;

 

    return (

      <>

        <Container style={{ marginTop: '20px' }}>

          <div className="d-flex justify-content-between mb-3">

            <Input

              type="text"

              placeholder="Buscar"

              value={this.state.searchText}

              onChange={this.handleSearch}

              style={{ width: '300px' }}

            />

            <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir contrato</Button>

          </div>

 

          <Table className="table table-bordered">

            <thead>

              <tr>

                <th>Id</th>

                <th>Nombre Completo</th>

                <th>Fecha Inicio</th>

                <th>Fecha Fin</th>

                <th>Precio Mensual</th>

                <th>Ejemplar Contrato</th>

                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {this.state.filteredData.map((elemento) => (

                <tr key={elemento.id}>

                  <td>{elemento.id}</td>

                  <td>{elemento.nombreCompleto}</td>

                  <td>{elemento.fechaInicio}</td>

                  <td>{elemento.fechaFin}</td>

                  <td>{elemento.precioMensual}</td>

                  <td>{elemento.ejemplarContrato}</td>

                  <td>

                    <ButtonGroup>

                      <Button color="dark" onClick={() => this.mostrarModalEditar(elemento)} size="sm" className="mr-1">

                        <FontAwesomeIcon icon={faEdit} />

                      </Button>

                      <Button color="danger" onClick={() => this.eliminar(elemento)} size="sm" className="mr-1">

                        <FontAwesomeIcon icon={faTrash} />

                      </Button>

                      <Button color="info" onClick={() => this.previsualizarContrato(elemento.archivoContrato)} size="sm">

                        <FontAwesomeIcon icon={faEye} />

                      </Button>

                    </ButtonGroup>

                  </td>

                </tr>

              ))}

            </tbody>

          </Table>

        </Container>

 

        {/* Modal para añadir un nuevo contrato */}

        <Modal isOpen={modalAñadir} toggle={this.ocultarmodalAñadir}>

          <ModalHeader toggle={this.ocultarmodalAñadir}>

            <h3>Añadir contrato</h3>

          </ModalHeader>

 

          <ModalBody>

            <FormGroup>

              <label>Nombre Completo:</label>

              <Input name="nombreCompleto" type="text" onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <label>Fecha de Inicio:</label>

              <Input name="fechaInicio" type="date" onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <label>Fecha de Fin:</label>

              <Input name="fechaFin" type="date" onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <label>Precio Mensual:</label>

              <Input name="precioMensual" type="number" onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <Label for="ejemplarContrato">Ejemplar Contrato:</Label>

              <Input type="select" name="ejemplarContrato" onChange={this.handleChange}>

                <option value="">Seleccionar</option>

                <option value="Ejemplar 1">Ejemplar 1</option>

                <option value="Ejemplar 2">Ejemplar 2</option>

                <option value="Ejemplar 3">Ejemplar 3</option>

              </Input>

            </FormGroup>

 

            <FormGroup>

              <label>Archivo del contrato:</label>

              <Input type="file" accept="application/pdf" onChange={this.handleFileChange} />

              {fileError && <div className="text-danger">{fileError}</div>}

            </FormGroup>

          </ModalBody>

 

          <ModalFooter>

            <Button color="primary" onClick={this.Añadir}>Añadir</Button>

            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>

          </ModalFooter>

        </Modal>

 

        {/* Modal para editar un contrato */}

        <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>

          <ModalHeader toggle={this.ocultarModalEditar}>

            <h3>Editar contrato</h3>

          </ModalHeader>

 

          <ModalBody>

            <FormGroup>

              <label>Nombre Completo:</label>

              <Input name="nombreCompleto" type="text" value={form.nombreCompleto} onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <label>Fecha de Inicio:</label>

              <Input name="fechaInicio" type="date" value={form.fechaInicio} onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <label>Fecha de Fin:</label>

              <Input name="fechaFin" type="date" value={form.fechaFin} onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <label>Precio Mensual:</label>

              <Input name="precioMensual" type="number" value={form.precioMensual} onChange={this.handleChange} />

            </FormGroup>

 

            <FormGroup>

              <Label for="ejemplarContrato">Ejemplar Contrato:</Label>

              <Input type="select" name="ejemplarContrato" value={form.ejemplarContrato} onChange={this.handleChange}>

                <option value="Ejemplar 1">Ejemplar 1</option>

                <option value="Ejemplar 2">Ejemplar 2</option>

                <option value="Ejemplar 3">Ejemplar 3</option>

              </Input>

            </FormGroup>

          </ModalBody>

 

          <ModalFooter>

            <Button color="primary" onClick={() => this.editar(form)}>Actualizar</Button>

            <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>

          </ModalFooter>

        </Modal>

      </>

    );

  }

}

 

export default Contracts;