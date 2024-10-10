import React, { useState } from 'react';
import { Table, Card, CardBody, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from '@mui/lab/Pagination';
import PaginationItem from '@mui/lab/PaginationItem';
import Swal from 'sweetalert2';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const modules = [
   "Profile", "Users", "Roles", "Clients", "Services", "Package", "Headquarters", "Category of Specimens", "Transfers", "Records", "Dashboard"
];

const permissions = ["View", "Create", "Change Status", "Edit", "Delete"];

// Initial Data
const createInitialPermissions = () => {
  const initialPermissions = {};
  modules.forEach(mod => {
    initialPermissions[mod] = {
      View: false,
      Create: false,
      ChangeStatus: false,
      Edit: false,
      Delete: false,
    };
  });
  return initialPermissions;
};

const data = [
  { 
    id: 1, 
    Rol: "Administrador", 
    Description: "Se encargará de la administración de criadero", 
    Estado: true, 
    Permisos: {
      Users: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Roles: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Employees: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Clients: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Services: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Venues: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      "Category of Specimens": { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Transfers: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Records: { View: true, Create: true, ChangeStatus: true, Edit: true, Delete: true },
      Dashboard: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false }
    }
  },
  { 
    id: 2, 
    Rol: "Palafrenero", 
    Description: "Se encargará de ayudarle al montador y también podrá administrar medicina si así es requerido", 
    Estado: true, 
    Permisos: {
      Users: { View: false, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Roles: { View: false, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Employees: { View: true, Create: true, ChangeStatus: false, Edit: true, Delete: false },
      Clients: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Services: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Venues: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      "Category of Specimens": { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Transfers: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Records: { View: false, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Dashboard: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false }
    }
  },
  { 
    id: 3, 
    Rol: "Cuidador", 
    Description: "Se encargará de la alimentación y cuidado de los ejemplares", 
    Estado: true, 
    Permisos: {
      Users: { View: false, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Roles: { View: false, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Employees: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Clients: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Services: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Venues: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      "Category of Specimens": { View: false, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Transfers: { View: false, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Records: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false },
      Dashboard: { View: true, Create: false, ChangeStatus: false, Edit: false, Delete: false }
    }
  }
];

const Roles = () => {
  const [roles, setRoles] = useState(data);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ role: '', description: '', status: true, permissions: createInitialPermissions() });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      resetForm(); // Reset form on close
    }
  };

  const toggleViewModal = (role) => {
    console.log("Selected Role:", role); // Verificar los datos
    setSelectedRole(role);
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
    setSelectedRole(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePermissionChange = (module, permission) => {
    if (module === "Dashboard" && permission !== "View") {
      Swal.fire({
        icon: "error",
        title: "Permiso no permitido",
      });
      return; // No cambiar el estado si no es "View"
    }
  
    setForm(prevForm => ({
      ...prevForm,
      permissions: {
        ...prevForm.permissions,
        [module]: {
          ...prevForm.permissions[module],
          [permission]: !prevForm.permissions[module][permission]
        }
      }
    }));
  };
  
  const handleSubmit = () => {
    const { role, description, permissions } = form;
    const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;

    if (!regex.test(role)) {
      Swal.fire({ icon: "error", title: "Oops...", text: "El nombre del rol no puede comenzar con un número o contener caracteres especiales." });
      return;
    }

    if (role.trim() === '' || description.trim() === '') {
      Swal.fire({ icon: "error", title: "Oops...", text: "Por favor, complete todos los campos." });
      return;
    }

    const existingRole = roles.find(item => item.Rol.toLowerCase() === role.toLowerCase() && item.id !== (selectedRole ? selectedRole.id : null));
    if (existingRole) {
      Swal.fire({ icon: "error", title: "Oops...", text: "El rol ya existe." });
      return;
    }

    if (selectedRole) {
      const updatedRoles = roles.map(r => r.id === selectedRole.id ? { ...r, Rol: role, Description: description, Permisos: permissions } : r);
      setRoles(updatedRoles);
      Swal.fire('Éxito', 'Rol actualizado con éxito.', 'success');
    } else {
      const newRole = { id: roles.length + 1, Rol: role, Description: description, Estado: form.status, Permisos: permissions };
      setRoles([...roles, newRole]);
      Swal.fire('Éxito', 'Rol agregado con éxito.', 'success');
    }

    toggle();
  };

  const resetForm = () => {
    setForm({ role: '', description: '', status: true, permissions: createInitialPermissions() });
    setSelectedRole(null);
  };

  const handleDelete = (roleId) => {
    const roleToDelete = roles.find(item => item.id === roleId);
    if (roleToDelete.Estado) {
      Swal.fire({ icon: "warning", title: "No se puede eliminar", text: "El rol está activo." });
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: "¡No podrá revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, elimínalo',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles(roles.filter(r => r.id !== roleId));
        Swal.fire('Eliminado!', 'El rol ha sido eliminado.', 'success');
      }
    });
  };

  const changeStatus = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esto cambiará el estado del rol!',
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
        const roleToEdit = roles.find(item => item.id === id);
        const updatedList = roles.map(r =>
          r.id === id ? { ...r, Estado: !r.Estado } : r
        );
  
        setRoles(updatedList);
  
        // Muestra alerta de éxito
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Estado cambiado a ${roleToEdit.Estado ? 'inactivo' : 'activo'} con éxito`,
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
      }
    }).catch((error) => {
      // Muestra alerta de error si ocurre un problema
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cambiar el estado',
        confirmButtonColor: '#d33',
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
    });
  };  

  const filteredRoles = roles.filter(role =>
    role.Rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const currentRoles = filteredRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (role) => {
    console.log("Editing role:", role); // Agrega este console.log
    setSelectedRole(role);
    setForm({ role: role.Rol, description: role.Description, status: role.Estado, permissions: role.Permisos });
    toggle(); // Asegúrate de que este toggle abra el modal
};

  return (
    <div className="container">
      <p></p>
      <div className="d-flex justify-content-between mb-3">
        <Button color="success" onClick={toggle}>Agregar Rol</Button>
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '600px' }} // Size of the search input
        />
      </div>
      <Table className="table table-bordered" responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rol</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentRoles.map(role => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.Rol}</td>
              <td>{role.Description}</td>
              <td>{role.Estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <ButtonGroup>
                  <Button
                    color={role.Estado ? 'success' : 'secondary'}
                    onClick={(e) => { e.stopPropagation(); changeStatus(role.id); }}
                    size="sm"
                    className="mr-1"
                  >
                    {role.Estado ? 'Off' : 'On'}
                  </Button>
                  <Button
                    color="dark"
                    onClick={(e) => { e.stopPropagation(); handleEdit(role); }}
                    size="sm"
                    className="mr-1"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    color="danger"
                    onClick={(e) => { e.stopPropagation(); handleDelete(role.id); }}
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                  outline
                  style={{
                    color: 'info',
                    marginLeft: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                  size="sm"
                  className="mr-2 p-0"
                  onClick={() => toggleViewModal(role)} // Cambia esta línea
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
                </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center mt-3">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          renderItem={(item) => (
            <PaginationItem component="a" {...item} />
          )}
        />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{selectedRole ? 'Editar Rol' : 'Agregar Rol'}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="role">Rol</Label>
              <Input type="text" name="role" value={form.role} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Descripción</Label>
              <Input type="text" name="description" value={form.description} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Permisos</Label>
              <Table className="table table-bordered" style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th>Módulo</th>
              {permissions.map(permission => <th key={permission}>{permission}</th>)}
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <tr key={module}>
                <td>{module}</td>
                {permissions.map(permission => (
                  <td key={permission}>
                    <Input
                      type="checkbox"
                      checked={form.permissions[module][permission]}
                      onChange={() => handlePermissionChange(module, permission)}
                      style={{ borderColor: '#212529' }} // Borde más oscuro
                      disabled={module === "Dashboard" && !["View"].includes(permission)} // Deshabilitar ciertas opciones para Dashboard
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleSubmit}>{selectedRole ? 'Actualizar' : 'Agregar'}</Button>
          <Button color="danger" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
      {/* Modal para ver el rol */}
      <Modal isOpen={viewModal} toggle={closeViewModal}>
  <ModalBody>
    {selectedRole && permissions && modules && (
      <Card className="rounded">
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="role">Rol:</Label>
              <Input
                type="text"
                id="role"
                value={selectedRole.Rol || ''}
                readOnly
                className="rounded"
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Descripción:</Label>
              <Input
                type="text"
                id="description"
                value={selectedRole.Description || ''}
                readOnly
                className="rounded"
              />
            </FormGroup>
            <FormGroup>
              <Label for="status">Estado:</Label>
              <Input
                type="text"
                id="status"
                value={selectedRole.Estado ? 'Activo' : 'Inactivo'}
                readOnly
                className="rounded"
              />
            </FormGroup>
          </Form>
          <hr />
          <h5>Permisos:</h5>
          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Módulo</th>
                {permissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
              </tr> 
            </thead>
            <tbody>
              {modules.map(module => (
                <tr key={module}>
                  <td>{module}</td>
                  {permissions.map(permission => (
                    <td key={permission}>
                      <Input
                        type="checkbox"
                        checked={selectedRole.Permisos?.[module]?.[permission] || false}
                        readOnly
                        style={{ pointerEvents: 'none' }} // Deshabilitar eventos del mouse
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    )}
  </ModalBody>
  <ModalFooter>
    <Button color="danger" onClick={closeViewModal}>Cerrar</Button>
  </ModalFooter>
</Modal>
    </div>
  );
};

export default Roles;
