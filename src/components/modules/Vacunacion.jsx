import React from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css'; 

import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 

import Swal from 'sweetalert2'; 

import Pagination from '@mui/lab/Pagination'; 

import PaginationItem from '@mui/lab/PaginationItem'; 

 

// Datos iniciales de vacunación 

const data = [ 

  { id: 1, NombreVacuna: "Vacuna A", FechaTomaMuestra: "2024-01-15", MedicoVeterinario: "Dr. Pérez" }, 

  { id: 2, NombreVacuna: "Vacuna B", FechaTomaMuestra: "2024-02-20", MedicoVeterinario: "Dr. Gómez" }, 

  { id: 3, NombreVacuna: "Vacuna C", FechaTomaMuestra: "2024-03-10", MedicoVeterinario: "Dra. López" }, 

  { id: 4, NombreVacuna: "Vacuna D", FechaTomaMuestra: "2024-04-15", MedicoVeterinario: "Dr. Martínez" }, 

  { id: 5, NombreVacuna: "Vacuna E", FechaTomaMuestra: "2024-05-20", MedicoVeterinario: "Dra. Ramírez" }, 

  { id: 6, NombreVacuna: "Vacuna F", FechaTomaMuestra: "2024-06-10", MedicoVeterinario: "Dr. Torres" }, 

  // Agrega más datos si es necesario 

]; 

 

class Vacunacion extends React.Component { 

  state = { 

    data: data, 

    filteredData: data, 

    form: { 

      id: '', 

      NombreVacuna: '', 

      FechaTomaMuestra: '', 

      MedicoVeterinario: '', 

    }, 

    modalAñadir: false, 

    modalEditar: false, 

    searchText: '', 

    nombreVacunaError: '', 

    fechaTomaError: '', 

    medicoError: '', 

    currentPage: 1, 

    itemsPerPage: 3, // Cambiar a 3 para iniciar paginación después de 3 items 

  }; 

 

  validateNombreVacunaInicio = nombreVacuna => { 

    const regex = /^[A-Za-z]/; // Verifica que el primer carácter sea una letra 

    return regex.test(nombreVacuna.trim()); 

  } 

   

 

  handleChange = e => { 

    const { name, value } = e.target; 

   

  // Validar el primer carácter de NombreVacuna 

  if (name === "NombreVacuna" && !this.validateNombreVacunaInicio(value)) { 

    this.setState({ nombreVacunaError: 'El primer carácter debe ser una letra.' }); 

  } else { 

    this.setState({ nombreVacunaError: '' }); // Limpiar error si es válido 

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

        item.NombreVacuna.toLowerCase().includes(searchText) || 

        item.FechaTomaMuestra.toLowerCase().includes(searchText) || 

        item.MedicoVeterinario.toLowerCase().includes(searchText) 

      ), 

      currentPage: 1 // Reset page on search 

    }); 

  } 

 

  mostrarmodalAñadir = () => { 

    this.setState({ 

      modalAñadir: true, 

      nombreVacunaError: '', 

      fechaTomaError: '', 

      medicoError: '', 

      form: { 

        id: '', 

        NombreVacuna: '', 

        FechaTomaMuestra: '', 

        MedicoVeterinario: '' 

      } 

    }); 

  } 

 

  ocultarmodalAñadir = () => { 

    this.setState({ modalAñadir: false }); 

  } 

 

  mostrarModalEditar = (registro) => { 

    this.setState({ modalEditar: true, form: registro, nombreVacunaError: '', fechaTomaError: '', medicoError: '' }); 

  } 

 

  ocultarModalEditar = () => { 

    this.setState({ modalEditar: false }); 

  } 

 

  validateNombreVacuna = nombreVacuna => { 

    return nombreVacuna.trim().length > 0; 

  } 

 

  validateFechaTomaMuestra = fecha => { 

    return fecha.trim().length > 0; 

  } 

 

  validateMedicoVeterinario = medico => { 

    return medico.trim().length > 0; 

  } 

 

  itemExists = nombreVacuna => { 

    return this.state.data.some(item => item.NombreVacuna === nombreVacuna); 

  } 

 

  Añadir = () => { 

    const { NombreVacuna, FechaTomaMuestra, MedicoVeterinario } = this.state.form; 

 

    // Validar campos obligatorios 

    if (!NombreVacuna || !FechaTomaMuestra || !MedicoVeterinario) { 

      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error'); 

      return; 

    } 

 

    // Validar nombre de la vacuna 

    if (!this.validateNombreVacuna(NombreVacuna)) { 

      this.setState({ nombreVacunaError: 'El nombre de la vacuna no puede estar vacío.' }); 

      return; 

    } 

 

    // Validar fecha de toma de muestra 

    if (!this.validateFechaTomaMuestra(FechaTomaMuestra)) { 

      this.setState({ fechaTomaError: 'La fecha de toma de muestra no puede estar vacía.' }); 

      return; 

    } 

 

    // Validar médico veterinario 

    if (!this.validateMedicoVeterinario(MedicoVeterinario)) { 

      this.setState({ medicoError: 'El médico veterinario no puede estar vacío.' }); 

      return; 

    } 

 

    // Verificar si el ítem ya existe 

    if (this.itemExists(NombreVacuna)) { 

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

    if (!dato.NombreVacuna || !dato.FechaTomaMuestra || !dato.MedicoVeterinario) { 

      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error'); 

      return; 

    } 

 

    // Validar nombre de la vacuna 

    if (!this.validateNombreVacuna(dato.NombreVacuna)) { 

      this.setState({ nombreVacunaError: 'El nombre de la vacuna no puede estar vacío.' }); 

      return; 

    } 

 

    // Validar fecha de toma de muestra 

    if (!this.validateFechaTomaMuestra(dato.FechaTomaMuestra)) { 

      this.setState({ fechaTomaError: 'La fecha de toma de muestra no puede estar vacía.' }); 

      return; 

    } 

 

    // Validar médico veterinario 

    if (!this.validateMedicoVeterinario(dato.MedicoVeterinario)) { 

      this.setState({ medicoError: 'El médico veterinario no puede estar vacío.' }); 

      return; 

    } 

 

    // Verificar si el ítem ya existe 

    const existingItem = this.state.data.find(item => item.NombreVacuna === dato.NombreVacuna && item.id !== dato.id); 

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

 

  handlePageChange = (event, value) => { 

    this.setState({ currentPage: value }); 

  } 

 

  render() { 

    const { form, modalAñadir, modalEditar, nombreVacunaError, fechaTomaError, medicoError, currentPage, itemsPerPage, filteredData } = this.state; 

 

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

          <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir vacuna</Button> 

        </div> 

 

        <Table className="table table-bordered"> 

          <thead> 

            <tr> 

              <th>Nombre Vacuna</th> 

              <th>Fecha Toma Muestra</th> 

              <th>Médico Veterinario</th> 

              <th>Acciones</th> 

            </tr> 

          </thead> 

          <tbody> 

            {currentData.map((elemento) => ( 

              <tr key={elemento.id}> 

                <td>{elemento.NombreVacuna}</td> 

                <td>{elemento.FechaTomaMuestra}</td> 

                <td>{elemento.MedicoVeterinario}</td> 

                <td> 

                  <ButtonGroup> 

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

              <label>Nombre Vacuna:</label> 

              <input className="form-control" name="NombreVacuna" type="text" onChange={this.handleChange} /> 

              <small className="text-danger">{nombreVacunaError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Fecha Toma Muestra:</label> 

              <input className="form-control" name="FechaTomaMuestra" type="date" onChange={this.handleChange} /> 

              <small className="text-danger">{fechaTomaError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Médico Veterinario:</label> 

              <input className="form-control" name="MedicoVeterinario" type="text" onChange={this.handleChange} /> 

              <small className="text-danger">{medicoError}</small> 

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

              <label>Nombre Vacuna:</label> 

              <input 

                className="form-control" 

                name="NombreVacuna" 

                type="text" 

                value={form.NombreVacuna} 

                onChange={this.handleChange} 

              /> 

              <small className="text-danger">{nombreVacunaError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Fecha Toma Muestra:</label> 

              <input 

                className="form-control" 

                name="FechaTomaMuestra" 

                type="date" 

                value={form.FechaTomaMuestra} 

                onChange={this.handleChange} 

              /> 

              <small className="text-danger">{fechaTomaError}</small> 

            </FormGroup> 

 

            <FormGroup> 

              <label>Médico Veterinario:</label> 

              <input 

                className="form-control" 

                name="MedicoVeterinario" 

                type="text" 

                value={form.MedicoVeterinario} 

                onChange={this.handleChange} 

              /> 

              <small className="text-danger">{medicoError}</small> 

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

 

export default Vacunacion; 