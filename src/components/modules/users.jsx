import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Datos iniciales de usuarios
const data = [
  { id: 1, NombreCompleto: "Lionel Messi", Correo: "messi@gmail.com", Celular: 3005242585, Rol: "palafrenero", estado: true, Clave: "1234", Usuario: "lmessi" },
  { id: 2, NombreCompleto: "Keimer Lezcano", Correo: "keimer@gmail.com", Celular: 3000000000, Rol: "veterinario", estado: true, Clave: "5678", Usuario: "klezcano" },
];

// Lista de roles disponibles para seleccionar
const roles = ["palafrenero", "veterinario", "cuidador", "administrador"];

class Usuarios extends React.Component {
  state = { 
    data: data,
    filteredData: data,
    form: {
      id: '',
      NombreCompleto: '',
      Correo: '',
      Celular: '',
      Rol: '',
      estado: true,
      Clave: '',
      Usuario: ''
    },
    modalAñadir: false,
    modalEditar: false,
    searchText: '',
    emailError: '',
    claveError: '',
    usuarioError: '',
    validationErrors: {},
  };

  validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  checkClaveExists = (clave, excludeId = null) => {
    return this.state.data.some(item => item.Clave === clave && item.id !== excludeId);
  }

  checkUsuarioExists = (usuario, excludeId = null) => {
    return this.state.data.some(item => item.Usuario === usuario && item.id !== excludeId);
  }

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: type === 'checkbox' ? checked : value,
      }
    }, () => {
      if (name === 'Correo') {
        const isValidEmail = this.validateEmail(this.state.form.Correo);
        this.setState({
          emailError: isValidEmail ? '' : 'Correo electrónico inválido.'
        });
      }
      if (name === 'Clave') {
        const claveExists = this.checkClaveExists(this.state.form.Clave, this.state.form.id);
        this.setState({
          claveError: claveExists ? 'Clave ya existe.' : ''
        });
      }
      if (name === 'Usuario') {
        const usuarioExists = this.checkUsuarioExists(this.state.form.Usuario, this.state.form.id);
        this.setState({
          usuarioError: usuarioExists ? 'Usuario ya existe.' : ''
        });
      }
    });
  }

  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.state.data.filter(item =>
        item.NombreCompleto.toLowerCase().includes(searchText) ||
        item.Correo.toLowerCase().includes(searchText) ||
        item.Rol.toLowerCase().includes(searchText) ||
        item.Clave.toString().includes(searchText) ||
        item.Usuario.toLowerCase().includes(searchText)
      )
    });
  }

  mostrarmodalAñadir = () => {
    this.setState({ 
      modalAñadir: true,
      form: {
        id: '',
        NombreCompleto: '',
        Correo: '',
        Celular: '',
        Rol: '',
        estado: true,
        Clave: '',
        Usuario: ''
      },
      emailError: '',
      claveError: '',
      usuarioError: '',
      validationErrors: {}
    });
  }

  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ 
      modalEditar: true, 
      form: registro,
      emailError: '',
      claveError: '',
      usuarioError: '',
      validationErrors: {}
    });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  validateForm = () => {
    const { NombreCompleto, Correo, Celular, Clave, Usuario } = this.state.form;
    let errors = {};
    
    if (!NombreCompleto) errors.NombreCompleto = 'Nombre completo es obligatorio.';
    if (!Correo) errors.Correo = 'Correo es obligatorio.';
    if (!Celular) errors.Celular = 'Celular es obligatorio.';
    if (!Clave) errors.Clave = 'Clave es obligatoria.';
    if (!Usuario) errors.Usuario = 'Usuario es obligatorio.';

    if (!this.validateEmail(Correo)) errors.Correo = 'Correo electrónico inválido.';
    if (this.checkClaveExists(Clave, this.state.form.id)) errors.Clave = 'Clave ya existe.';
    if (this.checkUsuarioExists(Usuario, this.state.form.id)) errors.Usuario = 'Usuario ya existe.';

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0;
  }

  Añadir = () => {
    if (!this.validateForm()) return;

    const valorNuevo = { ...this.state.form };
    valorNuevo.id = this.state.data.length + 1; 
    const lista = [...this.state.data, valorNuevo];
    this.setState({ data: lista, filteredData: lista, modalAñadir: false });
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Usuario añadido con éxito.',
    });
  }

  editar = (dato) => {
    if (!this.validateForm()) return;

    const lista = this.state.data.map(registro =>
      registro.id === dato.id ? { ...dato } : registro
    );
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Usuario actualizado con éxito.',
    });
  }

  eliminar = (dato) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar el usuario ${dato.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const lista = this.state.data.filter(registro => registro.id !== dato.id);
        this.setState({ data: lista, filteredData: lista });
        Swal.fire(
          'Eliminado',
          'Usuario eliminado con éxito.',
          'success'
        );
      }
    });
  }

  cambiarEstado = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas ${this.state.data.find(user => user.id === id).estado ? 'desactivar' : 'activar'} este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const lista = this.state.data.map(registro =>
          registro.id === id ? { ...registro, estado: !registro.estado } : registro
        );
        this.setState({ data: lista, filteredData: lista });
        Swal.fire(
          'Actualizado',
          `Usuario ${this.state.data.find(user => user.id === id).estado ? 'desactivado' : 'activado'} con éxito.`,
          'success'
        );
      }
    });
  }

  render() {
    const { form, modalAñadir, modalEditar, emailError, claveError, usuarioError, validationErrors } = this.state;

    return (
      <>
        <Container>
          <br />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Input
              type="text"
              placeholder="Buscar usuario"
              value={this.state.searchText}
              onChange={this.handleSearch}
              style={{ width: '300px' }}
            />
            <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir usuario</Button>
          </div>
          
          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Clave</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.NombreCompleto}</td>
                  <td>{elemento.Correo}</td>
                  <td>{elemento.Celular}</td>
                  <td>{elemento.Rol}</td>
                  <td>{elemento.estado ? "Activo" : "Inactivo"}</td>
                  <td>{elemento.Clave}</td> {/* Muestra la clave sin encriptar */}
                  <td>{elemento.Usuario}</td>
                  <td>
                    <ButtonGroup>
                      <Button 
                        color={elemento.estado ? "secondary" : "success"} 
                        onClick={(e) => { e.stopPropagation(); this.cambiarEstado(elemento.id); }}
                        size="sm"
                        className="mr-1"
                      >
                        {elemento.estado ? "Off" : "On"}
                      </Button>
                      <Button 
                        color="dark" 
                        onClick={(e) => { e.stopPropagation(); this.mostrarModalEditar(elemento); }}
                        size="sm"
                        className="mr-1"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button 
                        color="danger" 
                        onClick={(e) => { e.stopPropagation(); this.eliminar(elemento); }}
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
        </Container>

        {/* Modal para añadir usuario */}
        <Modal isOpen={modalAñadir} toggle={this.ocultarmodalAñadir}>
          <ModalHeader toggle={this.ocultarmodalAñadir}>Añadir Usuario</ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Nombre Completo</label>
              <Input type="text" name="NombreCompleto" value={form.NombreCompleto} onChange={this.handleChange} />
              {validationErrors.NombreCompleto && <small className="text-danger">{validationErrors.NombreCompleto}</small>}
            </FormGroup>
            <FormGroup>
              <label>Correo</label>
              <Input type="text" name="Correo" value={form.Correo} onChange={this.handleChange} />
              {emailError && <small className="text-danger">{emailError}</small>}
            </FormGroup>
            <FormGroup>
              <label>Celular</label>
              <Input type="number" name="Celular" value={form.Celular} onChange={this.handleChange} />
              {validationErrors.Celular && <small className="text-danger">{validationErrors.Celular}</small>}
            </FormGroup>
            <FormGroup>
              <label>Rol</label>
              <Input type="select" name="Rol" value={form.Rol} onChange={this.handleChange}>
                <option value="">Seleccione un rol</option>
                {roles.map((rol, index) => <option key={index} value={rol}>{rol}</option>)}
              </Input>
              {validationErrors.Rol && <small className="text-danger">{validationErrors.Rol}</small>}
            </FormGroup>
            <FormGroup>
              <label>Estado</label>
              <Input type="checkbox" name="estado" checked={form.estado} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Clave</label>
              <Input type="text" name="Clave" value={form.Clave} onChange={this.handleChange} />
              {claveError && <small className="text-danger">{claveError}</small>}
            </FormGroup>
            <FormGroup>
              <label>Usuario</label>
              <Input type="text" name="Usuario" value={form.Usuario} onChange={this.handleChange} />
              {usuarioError && <small className="text-danger">{usuarioError}</small>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.Añadir}>Añadir</Button>{' '}
            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal para editar usuario */}
        <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>
          <ModalHeader toggle={this.ocultarModalEditar}>Editar Usuario</ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Nombre Completo</label>
              <Input type="text" name="NombreCompleto" value={form.NombreCompleto} onChange={this.handleChange} />
              {validationErrors.NombreCompleto && <small className="text-danger">{validationErrors.NombreCompleto}</small>}
            </FormGroup>
            <FormGroup>
              <label>Correo</label>
              <Input type="text" name="Correo" value={form.Correo} onChange={this.handleChange} />
              {emailError && <small className="text-danger">{emailError}</small>}
            </FormGroup>
            <FormGroup>
              <label>Celular</label>
              <Input type="number" name="Celular" value={form.Celular} onChange={this.handleChange} />
              {validationErrors.Celular && <small className="text-danger">{validationErrors.Celular}</small>}
            </FormGroup>
            <FormGroup>
              <label>Rol</label>
              <Input type="select" name="Rol" value={form.Rol} onChange={this.handleChange}>
                <option value="">Seleccione un rol</option>
                {roles.map((rol, index) => <option key={index} value={rol}>{rol}</option>)}
              </Input>
              {validationErrors.Rol && <small className="text-danger">{validationErrors.Rol}</small>}
            </FormGroup>
            <FormGroup>
              <label>Estado</label>
              <Input type="checkbox" name="estado" checked={form.estado} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Clave</label>
              <Input type="text" name="Clave" value={form.Clave} onChange={this.handleChange} />
              {claveError && <small className="text-danger">{claveError}</small>}
            </FormGroup>
            <FormGroup>
              <label>Usuario</label>
              <Input type="text" name="Usuario" value={form.Usuario} onChange={this.handleChange} />
              {usuarioError && <small className="text-danger">{usuarioError}</small>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.editar(form)}>Actualizar</Button>{' '}
            <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default Usuarios;
