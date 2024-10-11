import React, { useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrash } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, ButtonGroup } from 'reactstrap';

 

const DetailsP = () => {

  const { id } = useParams();

  const navigate = useNavigate();

 

  const paquetes = [

    { id: 1, nombre: 'Paquete 1', serviciosAsociados: [{ id: 1, nombre: 'Servicio 1' }, { id: 2, nombre: 'Servicio 2' }] },

    { id: 2, nombre: 'Paquete 2', serviciosAsociados: [{ id: 3, nombre: 'Servicio 3' }, { id: 4, nombre: 'Servicio 4' }] },

    { id: 3, nombre: 'Paquete 3', serviciosAsociados: [{ id: 5, nombre: 'Servicio 5' }, { id: 6, nombre: 'Servicio 6' }] },

  ];

 

  const todosLosServicios = [

    { id: 1, nombre: 'Servicio 1' },

    { id: 2, nombre: 'Servicio 2' },

    { id: 3, nombre: 'Servicio 3' },

  ];

 

  const paqueteActual = paquetes.find(paquete => paquete.id === parseInt(id));

  const [servicios, setServicios] = useState(paqueteActual.serviciosAsociados);

  const [modalAgregar, setModalAgregar] = useState(false);

  const [servicioSeleccionado, setServicioSeleccionado] = useState('');

 

  const agregarServicio = () => {

    const servicio = todosLosServicios.find(s => s.id === parseInt(servicioSeleccionado));

    if (servicio && !servicios.find(s => s.id === servicio.id)) {

      setServicios([...servicios, servicio]);

      setServicioSeleccionado('');

      setModalAgregar(false);

    } else {

      Swal.fire('Error', 'El servicio ya está añadido o no es válido.', 'error');

    }

  };

 

  const eliminarServicio = (id) => {

    Swal.fire({

      title: '¿Estás seguro?',

      text: `Realmente deseas eliminar el servicio ${id}?`,

      icon: 'warning',

      showCancelButton: true,

    }).then(result => {

      if (result.isConfirmed) {

        setServicios(servicios.filter(servicio => servicio.id !== id));

      }

    });

  };

 

  return (

    <Container>

      <div className="d-flex justify-content-between mb-3 mt-3">

        <Button color="success" onClick={() => setModalAgregar(true)}>Seleccionar servicio</Button>

        <Button color="secondary" onClick={() => navigate('/Packages')}>Volver a paquetes</Button>

      </div>

 

      <Table className="table table-bordered">

        <thead>

          <tr>

            <th>Id</th>

            <th>Nombre</th>

            <th>Descripción</th>

            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {servicios.map(servicio => (

            <tr key={servicio.id}>

              <td>{servicio.id}</td>

              <td>{servicio.nombre}</td>

              <td>{servicio.descripcion || 'Sin descripción'}</td>

              <td>

                <ButtonGroup>

                  <Button color="danger" onClick={() => eliminarServicio(servicio.id)} size="sm">

                    <FontAwesomeIcon icon={faTrash} />

                  </Button>

                </ButtonGroup>

              </td>

            </tr>

          ))}

        </tbody>

      </Table>

 

      <Modal isOpen={modalAgregar} toggle={() => setModalAgregar(false)}>

        <ModalHeader toggle={() => setModalAgregar(false)}>Seleccionar servicio</ModalHeader>

        <ModalBody>

          <FormGroup>

            <label>Selecciona un servicio:</label>

            <Input type="select" value={servicioSeleccionado} onChange={(e) => setServicioSeleccionado(e.target.value)}>

              <option value="">-- Seleccionar --</option>

              {todosLosServicios.map(servicio => (

                <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>

              ))}

            </Input>

          </FormGroup>

        </ModalBody>

        <ModalFooter>

          <Button color="primary" onClick={agregarServicio}>Añadir</Button>

          <Button color="secondary" onClick={() => setModalAgregar(false)}>Cancelar</Button>

        </ModalFooter>

      </Modal>

    </Container>

  );

};

 

export default DetailsP;