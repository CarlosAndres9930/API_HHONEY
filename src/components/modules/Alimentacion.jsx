import React from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css'; 

import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 

import Swal from 'sweetalert2'; 

import Pagination from '@mui/lab/Pagination'; 

import PaginationItem from '@mui/lab/PaginationItem'; 

 

// Datos iniciales de alimentación 

const data = [ 

  { id: 1, Nombre: "Carne de res", Cantidad: 5, Frecuencia: "Diaria", Estado: 'Administrado' }, 

  { id: 2, Nombre: "Leche", Cantidad: 10, Frecuencia: "Semanal", Estado: 'No administrado' }, 

  { id: 3, Nombre: "Manzanas", Cantidad: 20, Frecuencia: "Diaria", Estado: 'Administrado' }, 

  { id: 4, Nombre: "Zanahorias", Cantidad: 15, Frecuencia: "Diaria", Estado: 'No administrado' }, 

  { id: 5, Nombre: "Arroz", Cantidad: 30, Frecuencia: "Semanal", Estado: 'Administrado' }, 

  { id: 6, Nombre: "Avena", Cantidad: 25, Frecuencia: "Diaria", Estado: 'Administrado' }, 

  // Agrega más datos si es necesario 

]; 

 

class Alimentacion extends React.Component { 

  state = { 

    data: data, 

    filteredData: data, 

    form: { 

      id: '', 

      Nombre: '', 

      Cantidad: '', 

      Frecuencia: '', 

      Estado: 'No administrado' 

    }, 

    modalAñadir: false, 

    modalEditar: false, 

    searchText: '', 

    nombreError: '', 

    cantidadError: '', 

    frecuenciaError: '', 

    currentPage: 1, 

    itemsPerPage: 3, 

    nombreError: '', 

  }; 

 

  handleChange = e => { 

    const { name, value } = e.target; 

 

    // Validar el nombre en tiempo real 

    if (name === 'Nombre') { 

      const error = this.validateNombre(value); 

      this.setState({ nombreError: error }); 

    } 

 

    this.setState({ 

      form: { 

        ...this.state.form, 

        [name]: value, 

      } 

    }); 

  } 

 

  handleSearch = e => { 

    const searchText = e.target.value.toLowerCase(); 

    this.setState({ 

      searchText, 

      filteredData: this.state.data.filter(item => 

        item.Nombre.toLowerCase().includes(searchText) || 

        item.Frecuencia.toLowerCase().includes(searchText) 

      ), 

      currentPage: 1 // Reset page on search 

    }); 

  } 

 

  mostrarmodalAñadir = () => { 

    this.setState({ 

      modalAñadir: true, 

      nombreError: '', 

      cantidadError: '', 

      frecuenciaError: '', 

      form: { 

        id: '', 

        Nombre: '', 

        Cantidad: '', 

        Frecuencia: '', 

        Estado: 'No administrado' 

      } 

    }); 

  } 

 

  ocultarmodalAñadir = () => { 

    this.setState({ modalAñadir: false }); 

  } 

 

  mostrarModalEditar = (registro) => { 

    this.setState({ modalEditar: true, form: { ...registro }, nombreError: '', cantidadError: '', frecuenciaError: '' }); 

  } 

 

  ocultarModalEditar = () => { 

    this.setState({ modalEditar: false }); 

  } 

 

  validateNombre = nombre => { 

    if (!nombre) return 'El nombre no puede estar vacío.'; 

    if (!/^[a-zA-Z]/.test(nombre)) return 'El primer carácter debe ser una letra.'; 

    return ''; // No hay error 

  } 

 

  validateCantidad = cantidad => { 

    return !isNaN(cantidad) && cantidad > 0; 

  } 

 

  validateFrecuencia = frecuencia => { 

    return frecuencia.trim().length > 0; 

  } 

 

  itemExists = nombre => { 

    return this.state.data.some(item => item.Nombre === nombre); 

  } 

 

  Añadir = () => { 

    const { Nombre, Cantidad, Frecuencia, Estado } = this.state.form; 

 

    // Validar campos obligatorios 

    if (!Nombre || !Cantidad || !Frecuencia) { 

      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error'); 

      return; 

    } 

 

    const nombreError = this.validateNombre(Nombre); 

    if (nombreError) { 

    Swal.fire('Error', nombreError, 'error'); 

    return; 

    } 

 

    // Validar nombre 

    if (!this.validateNombre(Nombre)) { 

      this.setState({ nombreError: 'El nombre no puede estar vacío.' }); 

      return; 

    } 

 

    // Validar cantidad 

    if (!this.validateCantidad(Cantidad)) { 

      this.setState({ cantidadError: 'La cantidad debe ser un número positivo.' }); 

      return; 

    } 

 

    // Validar frecuencia 

    if (!this.validateFrecuencia(Frecuencia)) { 

      this.setState({ frecuenciaError: 'La frecuencia no puede estar vacía.' }); 

      return; 

    } 

 

    // Verificar si el ítem ya existe 

    if (this.itemExists(Nombre)) { 

      Swal.fire('Error', 'El ítem ya existe.', 'error'); 

      return; 

    } 

 

    const valorNuevo = { ...this.state.form, id: this.state.data.length + 1 }; 

    const lista = [...this.state.data, valorNuevo]; 

    this.setState({ data: lista, filteredData: lista, modalAñadir: false }); 

    Swal.fire('Éxito', 'Ítem registrado exitosamente.', 'success'); 

  } 

 

  editar = (dato) => { 

    // Validar campos obligatorios 

    if (!dato.Nombre || !dato.Cantidad || !dato.Frecuencia) { 

      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error'); 

      return; 

    } 

 

    // Validar nombre 

    if (!this.validateNombre(dato.Nombre)) { 

      this.setState({ nombreError: 'El nombre no puede estar vacío.' }); 

      return; 

    } 

 

    // Validar cantidad 

    if (!this.validateCantidad(dato.Cantidad)) { 

      this.setState({ cantidadError: 'La cantidad debe ser un número positivo.' }); 

      return; 

    } 

 

    // Validar frecuencia 

    if (!this.validateFrecuencia(dato.Frecuencia)) { 

      this.setState({ frecuenciaError: 'La frecuencia no puede estar vacía.' }); 

      return; 

    } 

 

    // Verificar si el ítem ya existe 

    const existingItem = this.state.data.find(item => item.Nombre === dato.Nombre && item.id !== dato.id); 

    if (existingItem) { 

      Swal.fire('Error', 'El ítem ya existe.', 'error'); 

      return; 

    } 

 

    const lista = this.state.data.map(registro => 

      registro.id === dato.id ? { ...dato } : registro 

    ); 

    this.setState({ data: lista, filteredData: lista, modalEditar: false }); 

    Swal.fire('Éxito', 'Ítem actualizado exitosamente.', 'success'); 

  } 

 

  eliminar = (dato) => { 

    Swal.fire({ 

      title: '¿Estás seguro?', 

      text: `Realmente deseas eliminar el ítem ${dato.id}?`, 

      icon: 'warning', 

      showCancelButton: true, 

      confirmButtonColor: '#3085d6', 

      cancelButtonColor: '#d33', 

      confirmButtonText: 'Sí, eliminar', 

      cancelButtonText: 'Cancelar' 

    }).then(result => { 

      if (result.isConfirmed) { 

        const lista = this.state.data.filter(registro => registro.id !== dato.id); 

        this.setState({ data: lista, filteredData: lista }); 

        Swal.fire('Eliminado', 'Ítem eliminado exitosamente.', 'success'); 

      } 

    }); 

  } 

 

  toggleEstado = (id) => { 

    const lista = this.state.data.map(registro => 

      registro.id === id ? { ...registro, Estado: registro.Estado === 'Administrado' ? 'No Administrado' : 'Administrado' } : registro 

    ); 

    this.setState({ data: lista, filteredData: lista }); 

  } 

 

  handlePageChange = (event, value) => { 

    this.setState({ currentPage: value }); 

  } 

 

  render() { 

    const { form, modalAñadir, modalEditar, nombreError, cantidadError, frecuenciaError, currentPage, itemsPerPage, filteredData } = this.state; 

 

    // Paginación 

    const totalPages = Math.ceil(filteredData.length / itemsPerPage); 

    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); 

 

    return ( 

      <Container> 

        <div className="d-flex justify-content-between mb-3"> 

          <Input 

            type="text" 

            placeholder="Buscar" 

            value={this.state.searchText} 

            onChange={this.handleSearch} 

            style={{ width: '300px' }} 

          /> 

          <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir alimento</Button> 

        </div> 

 

        <Table className="table table-bordered"> 

          <thead> 

            <tr> 

              <th>Nombre</th> 

              <th>Cantidad</th> 

              <th>Frecuencia</th> 

              <th>Estado</th> 

              <th>Acciones</th> 

            </tr> 

          </thead> 

          <tbody> 

            {currentData.map((elemento) => ( 

              <tr key={elemento.id}> 

                <td>{elemento.Nombre}</td> 

                <td>{elemento.Cantidad}</td> 

                <td>{elemento.Frecuencia}</td> 

                <td>{elemento.Estado}</td> 

                <td> 

                  <ButtonGroup> 

                    <Button 

                      color={elemento.Estado === 'Administrado' ? 'secondary' : 'success'} 

                      onClick={() => this.toggleEstado(elemento.id)} 

                      size="sm" 

                      className="mr-1" 

                    > 

                      {elemento.Estado === 'Administrado' ? 'Off' : 'On'} 

                    </Button> 

                    <Button 

                      color="dark" 

                      onClick={() => this.mostrarModalEditar(elemento)} 

                      size="sm" 

                      className="mr-1" 

                    > 

                      <FontAwesomeIcon icon={faEdit} /> 

                    </Button> 

                    <Button 

                      color="danger" 

                      onClick={() => this.eliminar(elemento)} 

                      size="sm" 

                    > 

                      <FontAwesomeIcon icon={faTrash} /> 

                    </Button> 

                  </ButtonGroup> 

                </td> 

              </tr> 

            ))} 

          </tbody> 

        </Table> 

 

        <div className="d-flex justify-content-center mb-3"> 

          <Pagination 

            count={totalPages} 

            page={currentPage} 

            onChange={this.handlePageChange} 

            renderItem={(item) => <PaginationItem component="a" {...item} />} 

          /> 

        </div> 

 

        {/* Modal para añadir un nuevo ítem */} 

        <Modal isOpen={modalAñadir}> 

          <ModalHeader> 

            <div> 

              <h3>Añadir ítem</h3> 

            </div> 

          </ModalHeader> 

 

          <ModalBody> 

            <FormGroup> 

              <label>Nombre:</label> 

              <Input className="form-control" name="Nombre" type="text" onChange={this.handleChange} /> 

              <small className="text-danger">{nombreError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Cantidad:</label> 

              <Input className="form-control" name="Cantidad" type="number" onChange={this.handleChange} /> 

              <small className="text-danger">{cantidadError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Frecuencia:</label> 

              <Input className="form-control" name="Frecuencia" type="text" onChange={this.handleChange} /> 

              <small className="text-danger">{frecuenciaError}</small> 

            </FormGroup> 

          </ModalBody> 

 

          <ModalFooter> 

            <Button color="primary" onClick={this.Añadir}>Añadir</Button> 

            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button> 

          </ModalFooter> 

        </Modal> 

 

        {/* Modal para editar un ítem */} 

        <Modal isOpen={modalEditar}> 

          <ModalHeader> 

            <div> 

              <h3>Editar ítem</h3> 

            </div> 

          </ModalHeader> 

 

          <ModalBody> 

            <FormGroup> 

              <label>Nombre:</label> 

              <Input 

                className="form-control" 

                name="Nombre" 

                type="text" 

                value={form.Nombre} 

                onChange={this.handleChange} 

              /> 

              <small className="text-danger">{nombreError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Cantidad:</label> 

              <Input 

                className="form-control" 

                name="Cantidad" 

                type="number" 

                value={form.Cantidad} 

                onChange={this.handleChange} 

              /> 

              <small className="text-danger">{cantidadError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Frecuencia:</label> 

              <Input 

                className="form-control" 

                name="Frecuencia" 

                type="text" 

                value={form.Frecuencia} 

                onChange={this.handleChange} 

              /> 

              <small className="text-danger">{frecuenciaError}</small> 

            </FormGroup> 

          </ModalBody> 

 

          <ModalFooter> 

            <Button color="primary" onClick={() => this.editar(form)}>Actualizar</Button> 

            <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button> 

          </ModalFooter> 

        </Modal> 

      </Container> 

    ); 

  } 

} 

 

export default Alimentacion; 