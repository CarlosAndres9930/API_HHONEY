// Tracking.jsx
import React from 'react';
import { Container, FormGroup, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';

const localizer = momentLocalizer(moment);

class Tracking extends React.Component {
  state = {
    events: [
      {
        id: 0,
        title: 'Entrenamiento',
        description: 'Descripción del Evento A',
        eventType: 'Entrenamiento',
        start: new Date(2024, 9, 8, 10, 0),
        end: new Date(2024, 9, 8, 12, 0),
      },
      {
        id: 1,
        title: 'Visita veterinaria',
        description: 'Descripción del Evento B',
        eventType: 'Revisión veterinaria',
        start: new Date(2024, 9, 9, 14, 0),
        end: new Date(2024, 9, 9, 16, 0),
      },
    ],
    selectedEvent: null,
    searchTerm: '',
    modalVisible: false,
    modalType: 'add', // 'add' or 'edit'
  };

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  handleSelectEvent = (event) => {
    this.setState({ selectedEvent: event, modalType: 'edit' }, this.toggleModal);
  };

  handleSelectSlot = ({ start, end }) => {
    this.setState({ selectedEvent: { start, end, eventType: 'Entrenamiento' }, modalType: 'add' }, this.toggleModal);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      selectedEvent: {
        ...prevState.selectedEvent,
        [name]: value,
      }
    }));
  };

  handleSubmit = () => {
    const { selectedEvent, events } = this.state;
    const { title, description, eventType, start, end } = selectedEvent;

    if (!title || !description || !eventType || !start || !end) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    if (this.state.modalType === 'edit') {
      // Editar evento existente
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id
          ? { ...event, title, description, eventType, start: new Date(start), end: new Date(end) }
          : event
      );
      this.setState({ events: updatedEvents });
    } else {
      // Añadir nuevo evento
      const newEvent = {
        id: events.length,
        title,
        description,
        eventType,
        start: new Date(start),
        end: new Date(end),
      };
      this.setState({ events: [...events, newEvent] });
    }

    this.toggleModal();
  };

  handleDeleteEvent = () => {
    const { selectedEvent, events } = this.state;
    this.setState({ events: events.filter(event => event.id !== selectedEvent.id) });
    this.toggleModal();
  };

  render() {
    const { events, selectedEvent, modalVisible, searchTerm } = this.state;

    const filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <Container>

        <Input
          type="text"
          placeholder="Buscar evento..."
          value={searchTerm}
          onChange={(e) => this.setState({ searchTerm: e.target.value })}
          style={{ width: '200px', marginBottom: '20px' }} // Reducido el ancho
        />

        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '50px' }}
          onSelectEvent={this.handleSelectEvent}
          onSelectSlot={this.handleSelectSlot}
          selectable
        />

        {/* Modal para añadir/editar evento */}
        <Modal isOpen={modalVisible} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>{this.state.modalType === 'edit' ? 'Editar Evento' : 'Añadir Evento'}</h3>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Título:</label>
              <Input
                name="title"
                type="text"
                value={selectedEvent ? selectedEvent.title : ''}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Descripción:</label>
              <Input
                name="description"
                type="text"
                value={selectedEvent ? selectedEvent.description : ''}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Tipo de Evento:</label>
              <Input
                name="eventType"
                type="select"
                value={selectedEvent ? selectedEvent.eventType : ''}
                onChange={this.handleChange}
              >
                <option value="Entrenamiento">Entrenamiento</option>
                <option value="Revisión veterinaria">Revisión veterinaria</option>
                <option value="Medicación">Medicación</option>
                <option value="Alimentación">Alimentación</option>
                <option value="Vacunación">Vacunación</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <label>Inicio:</label>
              <Input
                name="start"
                type="datetime-local"
                value={selectedEvent ? moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm") : ''}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Fin:</label>
              <Input
                name="end"
                type="datetime-local"
                value={selectedEvent ? moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm") : ''}
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              {this.state.modalType === 'edit' ? 'Actualizar' : 'Añadir'}
            </Button>
            {this.state.modalType === 'edit' && (
              <Button color="danger" onClick={this.handleDeleteEvent}>
                Eliminar
              </Button>
            )}
            <Button color="secondary" onClick={this.toggleModal}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Tracking;