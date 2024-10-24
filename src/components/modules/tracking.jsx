// JustifiedExample.jsx
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Alimentacion from './Alimentacion'; // Ajusta la ruta según tu estructura de carpetas
import Vacunacion from './Vacunacion'; // Ajusta la ruta según tu estructura de carpetas
import Medicinas from './Medicinas'; // Ajusta la ruta según tu estructura de carpetas
import Home from './Home'; // Ajusta la ruta según tu estructura de carpetas
import Tracking from './Tracking2'; // Importa el módulo Tracking

function JustifiedExample() {
  return (
    <Tabs
      defaultActiveKey="home"
      id="justify-tab-example"
      className="mb-3"
      justify
      style={{ padding: '16px' }}
    >
      <Tab eventKey="home" title="Historial de seguimiento y control del ejemplar">
        <Home />
      </Tab>
      <Tab eventKey="meds" title="Medicinas">
        <Medicinas />
      </Tab>
      <Tab eventKey="food" title="Alimentación">
        <Alimentacion />
      </Tab>
      <Tab eventKey="vacination" title="Vacunación">
        <Vacunacion />
      </Tab>
      <Tab eventKey="tracking" title="Seguimiento"> {/* Nueva pestaña para Tracking */}
        <Tracking />
      </Tab>
    </Tabs>
  );
}

export default JustifiedExample;
