import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import alimentacion from '../../assets/alimentacion.jpeg';
import pesebrera from '../../assets/pesebrera.jpg';
import veterinaria from '../../assets/veterinaria.avif';


const initialServices = [
  { id: 1, nombre: "Servicio Pesebrera", descripcion: "Alojamiento del ejemplar", imagen: pesebrera, estado: false },
  { id: 2, nombre: "Servicio Alimentación", descripcion: "Alimentación al ejemplar las veces son correspondidas", imagen: alimentacion, estado: true },
  { id: 3, nombre: "Servicio Veterinaria", descripcion: "Cuidado médico al ejemplar las veces que asi o requiera", imagen: veterinaria, estado: true }
];

class Services extends React.Component {
  state = {
    services: initialServices,
    searchTerm: '',
    form: {
      id: '',
      nombre: '',
      descripcion: '',
      imagen: '',
      estado: true,
      imagenFile: null, 
    },
    modalAñadir: false,
    modalEditar: false,
    currentPage: 1,
    servicesPerPage: 3, // Se ajusta para mostrar 2-3 servicios por página
  };

  mostrarModalAñadir = () => {
    this.setState({
      modalAñadir: true,
      form: { id: '', nombre: '', descripcion: '', imagen: '', estado: true, imagenFile: null }
    });
  };

  ocultarModalAñadir = () => {
    this.setState({ modalAñadir: false });
  };

  mostrarModalEditar = (service) => {
    this.setState({ modalEditar: true, form: { ...service, imagenFile: null } });
  };

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  handleChange = (e) => {
    const { name, value, type, files } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: type === 'file' ? files[0] : value
      }
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleImageUpload = (callback) => {
    const { imagenFile } = this.state.form;
    if (imagenFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState(
          {
            form: {
              ...this.state.form,
              imagen: reader.result
            }
          },
          () => {
            if (callback) callback();
          }
        );
      };
      reader.readAsDataURL(imagenFile);
    } else {
      if (callback) callback();
    }
  };

  añadirServicio = () => {
    try {
      const { nombre, descripcion } = this.state.form;

       // Validar que todos los campos estén llenos
       if (nombre.trim() === '' || descripcion.trim() === '') {
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
    
      // Validar que Nombre cumple con la expresión regular
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
    
      // Verificar si el servicio ya existe
      const servicioExistente = this.state.services.find(servicio => servicio.nombre.toLowerCase() === nombre.toLowerCase());
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
  
      // Si todas las validaciones pasan, añadir el nuevo servicio
      this.handleImageUpload(() => {
        const nuevoServicio = { ...this.state.form };
        nuevoServicio.id = this.state.services.length + 1;
        const lista = [...this.state.services, nuevoServicio];
        this.setState({ services: lista, modalAñadir: false });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Servicio agregado exitosamente",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al añadir el servicio: ${error.message}`,
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
    }
  };  

  editarServicio = () => {
    try {
      const { nombre, descripcion } = this.state.form;
    
      // Validar que nombre cumple con la expresión regular
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
    
      // Validar que todos los campos estén llenos
      if (nombre.trim() === '' || descripcion.trim() === '') {
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
    
      // Verificar si el nombre del servicio ya existe en la lista, excluyendo el servicio que se está editando
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
  
      // Si todas las validaciones pasan, actualizar el servicio
      this.handleImageUpload(() => {
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
        confirmButton: 'custom-swal'
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esto cambiará el estado del servicio!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar',
      confirmButtonText: 'Sí, cambiar',
      reverseButtons: true,
      customClass: {
        cancelButton: 'custom-swal',
        confirmButton: 'custom-swal'
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
        try {
          // Aquí iría el código que realiza el cambio de estado
          const lista = this.state.services.map((service) =>
            service.id === id ? { ...service, estado: !service.estado } : service
          );
          this.setState({ services: lista });
  
          // Mostrar alerta de éxito
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Estado cambiado exitosamente',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              confirmButton: 'custom-swal'
            }
          });
        } catch (error) {
          // Mostrar alerta de error si algo falla
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cambiar el estado del servicio',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'custom-swal'
            }
          });
        }
      }
    });
  };  

  handleClickPage = (event, pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { services, searchTerm, form, modalAñadir, modalEditar, currentPage, servicesPerPage } = this.state;

    // Filtrado de servicios por término de búsqueda
    const filteredServices = services.filter(service =>
      service.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica para la paginación
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    const renderServices = currentServices.map((service) => (
      <div className="card m-3" style={{ width: '23rem', height: '33-rem', display: 'flex', flexDirection: 'column' }} key={service.id}>
        <img className="card-img-top" src={service.imagen} alt="Imagen del servicio" style={{ height: '300px', objectFit: 'cover' }} />
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: '1', padding: '1rem' }}>
          <h5 className="card-title">{service.nombre}</h5>
          <p className="card-text" style={{ 
            height: '7rem', /* Ajusta la altura según sea necesario */ 
            border: '1px solid #ccc', 
            padding: '0.5rem', 
            overflowY: 'auto', /* Permite el desplazamiento vertical */
            marginBottom: '1rem'
          }}>
            {service.descripcion}
          </p>
          <p className="card-text">{service.precio} </p>
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
            </div>
          </div>
        </div>
      </div>
    ));
    
    return (
      <Container>
        <div className="row mb-4">
          <p></p>
          <div className="col-md-6 mb-3">
            <Button color="success" onClick={this.mostrarModalAñadir}>Añadir servicio</Button>
          </div>
          <div className="col-md-6 mb-3">
            <Input
              type="text"
              placeholder="Buscar servicio..."
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center flex-wrap">
          {renderServices}
        </div>

        <div className="d-flex justify-content-center mt-3">
          <Stack spacing={2}>
            <Pagination count={Math.ceil(filteredServices.length / servicesPerPage)} page={currentPage} onChange={this.handleClickPage} />
          </Stack>
        </div>

        {/* Modal Añadir */}
        <Modal isOpen={modalAñadir} toggle={this.ocultarModalAñadir}>
          <ModalHeader toggle={this.ocultarModalAñadir}>Añadir Servicio</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="Number" name="precio" placeholder="Precio" value={form.precio} onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <Input type="file" name="imagenFile" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.añadirServicio}>Añadir</Button>
            <Button color="danger" onClick={this.ocultarModalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal Editar */}
        <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>
          <ModalHeader toggle={this.ocultarModalEditar}>Editar Servicio</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="Number" name="precio" placeholder="Precio" value={form.precio} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="file" name="imagenFile" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.editarServicio}>Guardar cambios</Button>
            <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Services;
