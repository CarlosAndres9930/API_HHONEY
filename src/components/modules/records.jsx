import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

// Datos iniciales de pagos
const initialPayments = [
  { id: 1, nombreCliente: 'Carlos Pérez', fechaPago: '2024-08-01', valor: 1000000, metodoPago: 'Transferencia', comprobante: 'comprobante1.jpg', contratoDuracion: 6, mesesPagados: 2, totalAPagar: 6000000 },
  { id: 2, nombreCliente: 'Ana Gómez', fechaPago: '2024-08-15', valor: 1000000, metodoPago: 'Efectivo', comprobante: 'comprobante2.jpg', contratoDuracion: 6, mesesPagados: 3, totalAPagar: 6000000 },
  { id: 3, nombreCliente: 'Luis Martínez', fechaPago: '2024-09-05', valor: 1000000, metodoPago: 'Tarjeta de Crédito', comprobante: 'comprobante3.jpg', contratoDuracion: 6, mesesPagados: 1, totalAPagar: 6000000 },
];

class Pagos extends React.Component {
  state = {
    payments: initialPayments,
    clientes: initialPayments.map(payment => ({
      id: payment.id,
      nombre: payment.nombreCliente,
      contratoDuracion: payment.contratoDuracion,
      mesesPagados: payment.mesesPagados,
      totalAPagar: payment.totalAPagar,
      valorMes: 1000000,
      ultimaFechaPago: payment.fechaPago
    })),
    form: {
      clienteId: '',
      fechaPago: new Date().toISOString().split('T')[0],
      valor: 1000000,
      metodoPago: 'Efectivo',
      comprobante: null,
      mesPago: ''
    },
    searchText: '',
    modalRegistro: false,
    fileError: '',
    filteredPayments: initialPayments,
    selectedComprobante: null,
    comprobanteModal: false
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
      fileError: ''
    });
  }

  handleClientChange = e => {
    const clienteId = e.target.value;
    const selectedClient = this.state.clientes.find(c => c.id === parseInt(clienteId));
    const siguienteMes = selectedClient.mesesPagados + 1;

    this.setState({
      form: {
        ...this.state.form,
        clienteId,
        mesPago: siguienteMes
      }
    });
  }

  handleFileChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                form: {
                    ...this.state.form,
                    comprobante: reader.result, // Almacena la URL de la imagen
                },
                fileError: ''
            });
        };
        reader.readAsDataURL(file);
    } else {
        this.setState({ fileError: 'El archivo debe ser una imagen.' });
    }
}


  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredPayments: this.state.payments.filter(item =>
        item.nombreCliente.toLowerCase().includes(searchText) ||
        item.fechaPago.includes(searchText) ||
        item.metodoPago.toLowerCase().includes(searchText)
      )
    });
  }

  mostrarmodalRegistro = () => {
    this.setState({
      modalRegistro: true,
      form: {
        clienteId: '',
        fechaPago: new Date().toISOString().split('T')[0],
        valor: 1000000,
        metodoPago: 'Efectivo',
        comprobante: null,
        mesPago: ''
      }
    });
  }

  ocultarmodalRegistro = () => {
    this.setState({ modalRegistro: false });
  }

  toggleComprobanteModal = () => {
    this.setState({ comprobanteModal: !this.state.comprobanteModal });
  }

  handleComprobanteClick = (comprobante) => {
    this.setState({ selectedComprobante: comprobante, comprobanteModal: true });
  }
  

  registrarPago = () => {
    const { clienteId, fechaPago, valor, metodoPago, comprobante, mesPago } = this.state.form;

    if (!clienteId || !fechaPago || !valor || !metodoPago || !comprobante || !mesPago) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    if (isNaN(valor) || valor !== 1000000) {
      Swal.fire('Error', 'El valor debe ser exactamente 1 millón.', 'error');
      return;
    }

    const cliente = this.state.clientes.find(cliente => cliente.id === parseInt(clienteId));
    if (!cliente) {
      Swal.fire('Error', 'Cliente no encontrado.', 'error');
      return;
    }

    const nuevoPago = {
      id: cliente.id,
      nombreCliente: cliente.nombre,
      fechaPago,
      valor: parseFloat(valor),
      metodoPago,
      comprobante: this.state.form.comprobante, // Se almacena la URL de la imagen
      contratoDuracion: cliente.contratoDuracion,
      mesesPagados: cliente.mesesPagados + 1,
      totalAPagar: cliente.totalAPagar
    };

    this.setState(prevState => {
      const updatedClientes = prevState.clientes.map(c =>
        c.id === parseInt(clienteId) ? {
          ...c,
          mesesPagados: c.mesesPagados + 1,
          ultimaFechaPago: fechaPago
        } : c
      );

      return {
        clientes: updatedClientes,
        modalRegistro: false,
        payments: [...prevState.payments, nuevoPago], // Se añade el nuevo pago a la lista
        form: {
          clienteId: '',
          fechaPago: new Date().toISOString().split('T')[0],
          valor: 1000000,
          metodoPago: 'Efectivo',
          comprobante: null,
          mesPago: ''
        }
      };
    });
    Swal.fire('Éxito', 'Pago registrado exitosamente.', 'success');
  }

  render() {
    const { form, modalRegistro, fileError, filteredPayments, selectedComprobante, comprobanteModal } = this.state;

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
          <div>
            <Button color="success" onClick={this.mostrarmodalRegistro} style={{ marginRight: '10px' }}>Registrar Pago</Button>
          </div>
        </div>

        <Table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Cliente</th>
              <th>Duración del Contrato (meses)</th>
              <th>Última Fecha de Pago</th>
              <th>Método de Pago</th>
              <th>Meses Pagados</th>
              <th>Valor Total a Pagar</th>
              <th>Valor Restante a Pagar</th>
              <th>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => {
              const cliente = this.state.clientes.find(c => c.nombre === payment.nombreCliente);
              const valorRestante = cliente ? cliente.totalAPagar - (cliente.mesesPagados * cliente.valorMes) : 0;
              return (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.nombreCliente}</td>
                  <td>{cliente ? cliente.contratoDuracion : ''}</td>
                  <td>{payment.fechaPago}</td>
                  <td>{payment.metodoPago}</td>
                  <td>{cliente ? cliente.mesesPagados : ''}</td>
                  <td>{cliente ? cliente.totalAPagar.toLocaleString() : ''}</td>
                  <td>{valorRestante.toLocaleString()}</td>
                  <td>
                    <Button onClick={() => this.handleComprobanteClick(payment.comprobante)}>
                      <FontAwesomeIcon icon={faFile} style={{ cursor: 'pointer', fontSize: '20px', color: '#007bff' }} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Modal para registrar un pago */}
        <Modal isOpen={modalRegistro}>
          <ModalHeader>
            <h3>Registrar Pago</h3>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Cliente:</label>
              <Input
                className="form-control"
                name="clienteId"
                type="select"
                value={form.clienteId}
                onChange={this.handleClientChange}
              >
                <option value="">Seleccione un cliente</option>
                {this.state.clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <label>Fecha de Pago:</label>
              <Input
                className="form-control"
                name="fechaPago"
                type="date"
                value={form.fechaPago}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Valor:</label>
              <Input
                className="form-control"
                name="valor"
                type="number"
                value={form.valor}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <label>Método de Pago:</label>
              <Input
                className="form-control"
                name="metodoPago"
                type="select"
                value={form.metodoPago}
                onChange={this.handleChange}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <label>Mes a Pagar:</label>
              <Input
                className="form-control"
                name="mesPago"
                type="number"
                min="1"
                max="12"
                value={form.mesPago}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <label>Comprobante (Imagen):</label>
              <Input
                className="form-control"
                name="comprobante"
                type="file"
                accept="image/*"
                onChange={this.handleFileChange}
              />
              <small className="text-danger">{fileError}</small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.registrarPago}>Registrar</Button>
            <Button color="secondary" onClick={this.ocultarmodalRegistro}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal para visualizar el comprobante */}
        <Modal isOpen={comprobanteModal} toggle={this.toggleComprobanteModal}>
          <ModalHeader toggle={this.toggleComprobanteModal}>
            Comprobante
          </ModalHeader>
          <ModalBody>
            {selectedComprobante ? (
              <img 
                src={selectedComprobante} 
                alt="Comprobante" 
                style={{ width: '100%', height: 'auto' }} 
              />
            ) : (
              <p>No hay comprobante que mostrar.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleComprobanteModal}>Cerrar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Pagos;
