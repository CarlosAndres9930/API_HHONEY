import React, { useState } from 'react'; 

import { Card, CardBody, CardHeader, CardTitle, CardText, Row, Col, Button, Collapse, FormGroup, Label, Input, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; 

import Calendar from 'react-calendar'; 

import 'react-calendar/dist/Calendar.css'; 

import { FaTrash, FaEdit } from 'react-icons/fa'; 

import 'bootstrap-icons/font/bootstrap-icons.css'; 

import 'bootstrap/dist/css/bootstrap.min.css'; 

import Swal from 'sweetalert2'; 

import ListGroup from 'react-bootstrap/ListGroup'; 

import { Image } from 'react-bootstrap'; 

import miImagen from "../../assets/horse.png"; 

 
 

const categoryOfSpecimens = { 

  "Caballos": ["Caballo 1", "Caballo 2", "Caballo 3"], 

  "Yeguas": ["Yegua 1", "Yegua 2", "Yegua 3"], 

}; 

 

const HorseTrackingWithScheduler = () => { 

  const [date, setDate] = useState(new Date()); 

  const [isCalendarOpen, setIsCalendarOpen] = useState(false); 

  const [eventType, setEventType] = useState(''); 

  const [time, setTime] = useState(''); 

  const [scheduledEvents, setScheduledEvents] = useState([]); 

  const [selectedCategory, setSelectedCategory] = useState(''); 

  const [horseName, setHorseName] = useState(''); 

  const [showEventsModal, setShowEventsModal] = useState(false); 

  const [showCreateObservationModal, setShowCreateObservationModal] = useState(false); 

  const [observationTitle, setObservationTitle] = useState(''); 

  const [observationDetails, setObservationDetails] = useState(''); 

  const [observationDate, setObservationDate] = useState(''); 

  const [observations, setObservations] = useState([ 

    { id: 1, title: 'Consulta General', details: 'Se realizó una revisión completa del caballo. No se encontraron problemas.', date: '2024-09-01', category: 'Historial Veterinario', active: true }, 

    { id: 2, title: 'Entrenamiento Diario', details: 'Se completó el entrenamiento de la mañana y tarde.', date: '2024-09-02', category: 'Actividad Física', active: true },]); 

  const [editObservation, setEditObservation] = useState(null); // Estado para la observación en edición 

  const [observationActive, setObservationActive] = useState(true); // Estado para manejar el estado de la observación 

 

  const onDateChange = (selectedDate) => { 

    if (selectedDate < new Date()) { 

      Swal.fire({ 

        title: 'Fecha inválida', 

        text: 'No se puede seleccionar una fecha anterior a la fecha actual, tampoco puedes agendar en la fecha actual.', 

        icon: 'error', 

        confirmButtonColor: '#3085d6', 

        confirmButtonText: 'Aceptar' 

      }); 

      return; 

    } 

    setDate(selectedDate); 

  }; 

 

  // Función para mostrar/ocultar el calendario y el formulario 

  const toggleCalendar = () => { 

    setIsCalendarOpen(!isCalendarOpen); 

  }; 

 

  // Manejar el cambio de tipo de evento 

  const handleEventTypeChange = (e) => { 

    setEventType(e.target.value); 

  }; 

 

  // Manejar el cambio de categoría 

  const handleCategoryChange = (e) => { 

    setSelectedCategory(e.target.value); 

    setHorseName('');  // Limpiar el nombre del ejemplar al cambiar la categoría 

  }; 

 

  // Manejar el cambio del nombre del ejemplar 

  const handleHorseChange = (e) => { 

    setHorseName(e.target.value); 

  }; 

 

  // Manejar el cambio de hora 

  const handleTimeChange = (e) => { 

    setTime(e.target.value); 

  }; 

 

  const handleSave = () => { 

    if (!eventType || !date || !time || !horseName || !selectedCategory) { 

      Swal.fire({ 

        title: 'Campos incompletos', 

        text: 'Por favor, completa todos los campos antes de guardar.', 

        icon: 'warning', 

        confirmButtonColor: '#3085d6', 

        confirmButtonText: 'Aceptar' 

      }); 

      return; 

    } 

 

    const newEvent = { 

      horseName, 

      eventType, 

      date, 

      time, 

    }; 

 

    setScheduledEvents([...scheduledEvents, newEvent]); 

    Swal.fire({ 

      title: 'Éxito', 

      text: 'Evento agendado exitosamente.', 

      icon: 'success', 

      confirmButtonColor: '#3085d6', 

      confirmButtonText: 'Aceptar' 

    }); 

 

    setEventType(''); 

    setTime(''); 

    setHorseName(''); 

    setSelectedCategory(''); 

  }; 

 

  const handleCancel = () => { 

    setEventType(''); 

    setTime(''); 

    setHorseName(''); 

    setSelectedCategory(''); 

  }; 

 

  // Función para alternar la visibilidad del modal de eventos 

  const toggleShowEventsModal = () => { 

    setShowEventsModal(!showEventsModal); 

  }; 

 

  const toggleCreateObservationModal = () => { 

    setShowCreateObservationModal(!showCreateObservationModal); 

  }; 

 

  const handleRemoveEvent = (index) => { 

    Swal.fire({ 

      title: '¿Estás seguro?', 

      text: `Realmente deseas eliminar el evento ${scheduledEvents[index].horseName}?`, 

      icon: 'warning', 

      showCancelButton: true, 

      confirmButtonColor: '#3085d6', 

      cancelButtonColor: '#d33', 

      confirmButtonText: 'Sí, eliminar', 

      cancelButtonText: 'Cancelar' 

    }).then(result => { 

      if (result.isConfirmed) { 

        const updatedEvents = scheduledEvents.filter((_, i) => i !== index); 

        setScheduledEvents(updatedEvents); 

        Swal.fire('Eliminado', 'Evento eliminado exitosamente.', 'success'); 

      } 

    }); 

  }; 

 

  const handleCreateObservation = () => { 

    if (validateObservationFields()) { 

      const newObservation = { 

        id: observations.length + 1, // Generar un ID simple para nuevas observaciones 

        title: observationTitle, 

        details: observationDetails, 

        date: observationDate, 

        active: true, 

      }; 

   

      setObservations([...observations, newObservation]); // Actualizar el estado 

   

      Swal.fire({ 

        title: 'Éxito', 

        text: 'Observación creada exitosamente.', 

        icon: 'success', 

        confirmButtonColor: '#3085d6', 

        confirmButtonText: 'Aceptar' 

      }); 

   

      // Limpiar campos 

      setObservationTitle(''); 

      setObservationDetails(''); 

      setObservationDate(''); 

      toggleCreateObservationModal(); // Cerrar modal 

    } 

  }; 

 

  const validateObservationFields = () => { 

    const titleRegex = /^[^\d][\w\s]+$/; 

    const detailsRegex = /^[^\d][\w\s]+$/; 

   

    if (!observationTitle || !observationDetails || !observationDate) { 

      Swal.fire({ 

        title: 'Campos incompletos', 

        text: 'Por favor, completa todos los campos antes de guardar.', 

        icon: 'warning', 

        confirmButtonColor: '#3085d6', 

        confirmButtonText: 'Aceptar' 

      }); 

      return false; 

    } 

   

    if (!titleRegex.test(observationTitle)) { 

      Swal.fire({ 

        title: 'Título inválido', 

        text: 'El título no puede comenzar con un número ni contener caracteres especiales.', 

        icon: 'warning', 

        confirmButtonColor: '#3085d6', 

        confirmButtonText: 'Aceptar' 

      }); 

      return false; 

    } 

   

    if (!detailsRegex.test(observationDetails)) { 

      Swal.fire({ 

        title: 'Detalles inválidos', 

        text: 'Los detalles no pueden comenzar con un número ni contener caracteres especiales.', 

        icon: 'warning', 

        confirmButtonColor: '#3085d6', 

        confirmButtonText: 'Aceptar' 

      }); 

      return false; 

    } 

   

    return true; 

  };   

   

  const handleToggleObservationStatus = (id) => { 

    const updatedObservations = observations.map((obs) => 

      obs.id === id ? { ...obs, active: !obs.active } : obs 

    ); 

    setObservations(updatedObservations); 

  };   

 

  const toggleEditObservationModal = (observation) => { 

    setEditObservation(observation); 

    setObservationTitle(observation.title); 

    setObservationDetails(observation.details); 

    setObservationDate(observation.date); 

  }; 

   

  const handleEditObservation = () => { 

    if (validateObservationFields()) { 

      const updatedObservations = observations.map((obs) => 

        obs.id === editObservation.id 

          ? { ...obs, title: observationTitle, details: observationDetails, date: observationDate } 

          : obs 

      ); 

      setObservations(updatedObservations); 

       

      Swal.fire({ 

        title: 'Éxito', 

        text: 'Observación actualizada exitosamente.', 

        icon: 'success', 

        confirmButtonColor: '#3085d6', 

        confirmButtonText: 'Aceptar' 

      }); 

   

      // Limpiar campos y cerrar el modal 

      setObservationTitle(''); 

      setObservationDetails(''); 

      setObservationDate(''); 

      setEditObservation(null); 

      toggleCreateObservationModal(); 

    } 

  };   

 

  const handleRemoveObservation = (id) => { 

    Swal.fire({ 

      title: '¿Estás seguro?', 

      text: '¡Esta observación será eliminada!', 

      icon: 'warning', 

      showCancelButton: true, 

      confirmButtonColor: '#3085d6', 

      cancelButtonColor: '#d33', 

      confirmButtonText: 'Sí, eliminarla', 

    }).then((result) => { 

      if (result.isConfirmed) { 

        const updatedObservations = observations.filter((obs) => obs.id !== id); 

        setObservations(updatedObservations); 

        Swal.fire( 

          'Eliminada!', 

          'La observación ha sido eliminada.', 

          'success' 

        ); 

      } 

    }); 

  }; 

 

  const buttonStyle = { 

    width: '100%', 

    fontWeight: 'bold', 

    borderRadius: '25px', 

    textAlign: 'center', 

    cursor: 'pointer', 

    color: 'white', 

    border: 'none', 

    display: 'flex', 

    alignItems: 'center', 

    justifyContent: 'center', 

    padding: '10px 10px', // Ajustar padding para igualar la altura 

    lineHeight: '1.0' 

  }; 

  function DefaultExample() {} 

 

  return ( 

<div style={{padding: 16}}> 

<Row> 

 

        <Col xs={5} md={2}> 

          <Image src={miImagen} thumbnail className="mb-0"/> 

        </Col> 

        <Col xs={12} md={8}> 

          <ListGroup className="mb-4"> 

            <ListGroup.Item><b>Nombre: </b>Don Juan</ListGroup.Item> 

            <ListGroup.Item><b>Edad: </b>3 años</ListGroup.Item> 

            <ListGroup.Item><b>Peso: </b>422 KG</ListGroup.Item> 

            <ListGroup.Item><b>Andar: </b>P4</ListGroup.Item> 

            <ListGroup.Item><b>Fin: </b>competencia</ListGroup.Item> 

          </ListGroup> 

        </Col> 

      </Row> 

<Row className="mb-3"> 

        <Col sm="4" className="text-center"> 

          <button  

            onClick={toggleCalendar} 

            style={{  

              ...buttonStyle, 

              backgroundColor: '#4caf50' 

            }} 

          > 

            <i className="bi bi-calendar-plus" style={{ marginRight: '8px' }}></i> 

            {isCalendarOpen ? 'Ocultar Calendario y Formulario' : 'Mostrar Calendario y Formulario'} 

          </button> 

        </Col> 

        <Col sm="4" className="text-center"> 

          <button  

            onClick={toggleShowEventsModal} 

            style={{  

              ...buttonStyle, 

              backgroundColor: '#2196F3' 

            }} 

          > 

            <i className="bi bi-calendar2-check" style={{ marginRight: '8px' }}></i> 

            Mostrar Eventos Agendados 

          </button> 

        </Col> 

        <Col sm="4" className="text-center"> 

          <Button  

            onClick={toggleCreateObservationModal} 

            style={{  

              ...buttonStyle, 

              backgroundColor: '#FF4F4F' 

            }} 

          > 

            <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i> 

            Crear Nueva Observación 

          </Button> 

        </Col> 

      </Row> 

 

      {/* Colapso para mostrar el calendario y el formulario */} 

      <Collapse isOpen={isCalendarOpen}> 

        <Row> 

          <Col sm="6" className="mb-4"> 

            <Card className="border-info" style={{ textAlign: 'center' }}> 

              <CardHeader>Agenda de Citas</CardHeader> 

              <CardBody> 

                <CardTitle tag="h5">Selecciona una Fecha</CardTitle> 

                <div style={{ maxWidth: '500px', margin: '0 auto' }}> 

                  <Calendar 

                    onChange={onDateChange} 

                    value={date} 

                    style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }} 

                  /> 

                </div> 

                <CardText className="mt-3"> 

                  <strong>Fecha seleccionada:</strong> {date.toDateString()} 

                </CardText> 

              </CardBody> 

            </Card> 

          </Col> 

 

          {/* Formulario al lado del calendario */} 

          <Col sm="6" className="mb-4"> 

            <Card className="border-warning" style={{ textAlign: 'center' }}> 

              <CardHeader>Detalles del Evento</CardHeader> 

              <CardBody> 

                <Form> 

                  {/* Selección de Categoría */} 

                  <FormGroup> 

                    <Label for="category">Seleccionar Categoría</Label> 

                    <Input type="select" id="category" value={selectedCategory} onChange={handleCategoryChange}> 

                      <option value="">Selecciona una categoría...</option> 

                      {Object.keys(categoryOfSpecimens).map((category, index) => ( 

                        <option key={index} value={category}>{category}</option> 

                      ))} 

                    </Input> 

                  </FormGroup> 

 

                  {/* Selección del Ejemplar */} 

                  {selectedCategory && ( 

                    <FormGroup> 

                      <Label for="horseName">Seleccionar Ejemplar</Label> 

                      <Input type="select" id="horseName" value={horseName} onChange={handleHorseChange}> 

                        <option value="">Selecciona un ejemplar...</option> 

                        {categoryOfSpecimens[selectedCategory].map((horse, index) => ( 

                          <option key={index} value={horse}>{horse}</option> 

                        ))} 

                      </Input> 

                    </FormGroup> 

                  )} 

 

                  {horseName === 'Otro' && ( 

                    <FormGroup> 

                      <Label for="customHorseName">Ingresar Nombre del Ejemplar</Label> 

                      <Input type="text" id="customHorseName" value={horseName} onChange={handleHorseChange} placeholder="Nombre del ejemplar" /> 

                    </FormGroup> 

                  )} 

 

                  <FormGroup> 

                    <Label for="eventType">Tipo de Evento</Label> 

                    <Input type="select" id="eventType" value={eventType} onChange={handleEventTypeChange}> 

                      <option value="">Selecciona...</option> 

                      <option value="Revisión Veterinaria">Revisión Veterinaria</option> 

                      <option value="Medicación">Medicación</option> 

                      <option value="Alimentación">Alimentación</option> 

                    </Input> 

                  </FormGroup> 

 

                  <FormGroup> 

                    <Label for="eventTime">Hora</Label> 

                    <Input type="time" id="eventTime" value={time} onChange={handleTimeChange} /> 

                  </FormGroup> 

 

                  {/* Botones para Guardar y Cancelar */} 

                  <Button color="success" onClick={handleSave} className="me-2" style={{ borderRadius: '25px' }}>Guardar</Button> 

                  <Button color="danger" onClick={handleCancel} style={{ borderRadius: '25px' }}>Cancelar</Button> 

                </Form> 

              </CardBody> 

            </Card> 

          </Col> 

        </Row> 

      </Collapse> 

        {/* Modal para mostrar eventos agendados */} 

        <Modal isOpen={showEventsModal} toggle={toggleShowEventsModal} size="lg" className="modal-dialog-centered"> 

          <ModalHeader toggle={toggleShowEventsModal}>Eventos Agendados</ModalHeader> 

          <ModalBody> 

            {scheduledEvents.length > 0 ? ( 

              <Row> 

                {scheduledEvents.map((event, index) => ( 

                  <Col sm="6" key={index} className="mb-3"> 

                    <Card className={`border-${index % 4 === 0 ? 'primary' : index % 4 === 1 ? 'secondary' : index % 4 === 2 ? 'success' : 'warning'} mb-3`} style={{ maxWidth: '18rem', margin: '0 auto', position: 'relative' }}> 

                      <Button color="danger" style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '0.75rem' }} onClick={() => handleRemoveEvent(index)}> 

                        <FaTrash /> 

                      </Button> 

                      <CardHeader>Evento Agendado</CardHeader> 

                      <CardBody className={`text-${index % 4 === 0 ? 'primary' : index % 4 === 1 ? 'secondary' : index % 4 === 2 ? 'success' : 'warning'}`}> 

                        <CardTitle tag="h5">{event.horseName}</CardTitle> 

                        <CardText><strong>Tipo:</strong> {event.eventType}</CardText> 

                        <CardText><strong>Fecha:</strong> {event.date.toDateString()}</CardText> 

                        <CardText><strong>Hora:</strong> {event.time}</CardText> 

                      </CardBody> 

                    </Card> 

                  </Col> 

                ))} 

              </Row> 

            ) : ( 

              <CardText>No hay eventos agendados.</CardText> 

            )} 

          </ModalBody> 

        <ModalFooter> 

          <Button color="secondary" onClick={toggleShowEventsModal}>Cerrar</Button> 

        </ModalFooter> 

      </Modal> 

 

      {/* Modal para crear una nueva observación */} 

     <Modal isOpen={showCreateObservationModal} toggle={toggleCreateObservationModal} size="lg"> 

  <ModalHeader toggle={toggleCreateObservationModal}>Crear Nueva Observación</ModalHeader> 

  <ModalBody> 

    <Form> 

      <FormGroup> 

        <Label for="observationTitle">Título de la Observación</Label> 

        <Input type="text" id="observationTitle" placeholder="Ingrese el título de la observación" value={observationTitle}  onChange={(e) => setObservationTitle(e.target.value)}/> 

      </FormGroup> 

      <FormGroup> 

        <Label for="observationDetails">Detalles</Label>  

        <Input type="textarea" id="observationDetails" placeholder="Ingrese los detalles de la observación" value={observationDetails} onChange={(e) => setObservationDetails(e.target.value)}/> 

      </FormGroup> 

      <FormGroup> 

        <Label for="observationDate">Fecha</Label> 

        <Input type="date" id="observationDate" value={observationDate} onChange={(e) => setObservationDate(e.target.value)}/> 

      </FormGroup> 

      <Button color="success" onClick= {handleCreateObservation}> Guardar Observación </Button> 

      <Button color="danger"onClick= {toggleCreateObservationModal} className="ml-2"> Cancelar </Button> 

    </Form> 

  </ModalBody> 

</Modal> 

<Modal isOpen={editObservation !== null} toggle={() => setEditObservation(null)} size="lg"> 

  <ModalHeader toggle={() => setEditObservation(null)}>Editar Observación</ModalHeader> 

  <ModalBody> 

    <Form> 

      <FormGroup> 

        <Label for="observationTitle">Título de la Observación</Label> 

        <Input type="text" id="observationTitle" placeholder="Ingrese el título de la observación" value={observationTitle} onChange={(e) => setObservationTitle(e.target.value)} /> 

      </FormGroup> 

      <FormGroup> 

        <Label for="observationDetails">Detalles</Label> 

        <Input type="textarea" id="observationDetails" placeholder="Ingrese los detalles de la observación" value={observationDetails} onChange={(e) => setObservationDetails(e.target.value)} /> 

      </FormGroup> 

      <FormGroup> 

        <Label for="observationDate">Fecha</Label> 

        <Input type="date" id="observationDate" value={observationDate} onChange={(e) => setObservationDate(e.target.value)} /> 

      </FormGroup> 

      <Button color="success" onClick={handleEditObservation}>Guardar Cambios</Button> 

      <Button color="danger" onClick={() => setEditObservation(null)} className="ml-2">Cancelar</Button> 

    </Form> 

  </ModalBody> 

</Modal> 

<Row> 

{observations.length > 0 ? ( 

        observations.map((observation) => ( 

          <Col md="4" key={observation.id} className="mb-3"> 

            <Card className={`border-${observation.active ? 'success' : 'danger'}`}> 

              <CardHeader> 

                <CardTitle tag="h5">{observation.title}</CardTitle> 

              </CardHeader> 

              <CardBody> 

                <CardText>{observation.details}</CardText> 

                <CardText><strong>Fecha:</strong> {observation.date}</CardText> 

                <FormGroup> 

                  <Label for={`observationStatus-${observation.id}`}>Estado</Label> 

                  <Input 

                    type="text" 

                    id={`observationStatus-${observation.id}`} 

                    value={observation.active ? 'Activo' : 'Inactivo'} 

                    readOnly 

                    style={{ 

                      textAlign: 'left', 

                      backgroundColor: 'transparent', 

                      border: 'none', 

                      color: observation.active ? 'green' : 'black', 

                      fontWeight: 'bold', 

                      marginBottom: '10px' 

                    }} 

                  /> 

                </FormGroup> 

                <div className="d-flex justify-content-start"> 

                  <Button 

                    color={observation.active ? "success" : "secondary"} 

                    onClick={() => handleToggleObservationStatus(observation.id)} 

                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', marginRight: '0.5rem' }} 

                  > 

                    {observation.active ? "Off" : "On"} 

                  </Button> 

                  <Button 

                    color="dark" 

                    onClick={() => toggleEditObservationModal(observation)} 

                    className="mr-2" 

                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', marginRight: '0.70rem' }} 

                  > 

                    <FaEdit /> 

                  </Button> 

                  <Button 

                    color="danger" 

                    onClick={() => handleRemoveObservation(observation.id)} 

                    style={{ fontSize: '0.70rem', padding: '0.3rem 0.5rem' }} 

                  > 

                    <FaTrash /> 

                  </Button> 

                </div> 

              </CardBody> 

            </Card> 

          </Col> 

        )) 

      ) : ( 

        <Col md="12"> 

          <Card> 

            <CardBody> 

              <CardText>No hay observaciones disponibles.</CardText> 

            </CardBody> 

          </Card> 

        </Col> 

      )} 

    </Row> 

    </div> 

  ); 

}; 

 

export default HorseTrackingWithScheduler; 