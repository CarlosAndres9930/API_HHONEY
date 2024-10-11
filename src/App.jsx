import React, { useState } from 'react';
import Swal from 'sweetalert2';
import NavbarComp from './components/navegation';
import miImagen from './assets/donjuan.jpg'; // Importa la imagen  
import RecoveryForm from '/src/components/modules/RecoveryForm.jsx';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    
    // Verifica las credenciales (esto es solo un ejemplo)
    if (username === 'honey' && password === '123') {
      setIsAuthenticated(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Por favor, revisa tu nombre de usuario y clave.',
      });
    }
  };

  const handleRecovery = () => {
    setShowRecoveryForm(true);
  };

  const handleBackToLogin = () => {
    setShowRecoveryForm(false);
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    width: '100%',
    overflow: 'hidden', // Evita el desplazamiento si el contenido es mayor que el viewport
  };

  const imageSectionStyle = {
    flex: '1',
    backgroundImage: `url(${miImagen})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    width: '100%',
  };   

  const formContainerStyle = {
    flex: '0 0 27%', // Ocupa el 25% del contenedor
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: '20px',
  };

  const formStyle = {
    backgroundColor: '#',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  };

  const headingStyle = {
    margin: '0 0 20px 0',
    fontSize: '24px',
    color: '#F9E79F',
    textAlign: 'center',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    color: '#F9E79F',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    color: 'BLACK',
    backgroundColor: '#F0E686',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#E8B949',
  };

  const linkStyle = {
    display: 'block',
    marginTop: '10px',
    textAlign: 'center',
    color: '#F9E79F',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <>
      {isAuthenticated ? (
        <NavbarComp />
      ) : (
        <div style={containerStyle}>
          <div style={imageSectionStyle}></div>
          <div style={formContainerStyle}>
            {!showRecoveryForm ? (
              <form style={formStyle} onSubmit={handleLogin}>
                <h2 style={headingStyle}>Iniciar sesión</h2>
                <div style={formGroupStyle}>
                  <label htmlFor="username" style={labelStyle}>Nombre de usuario:</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="password" style={labelStyle}>Clave:</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                  Iniciar sesión
                </button>
                <a
                  style={linkStyle}
                  onClick={handleRecovery}
                >
                  Olvidé mi clave
                </a>
              </form>
            ) : (
              <RecoveryForm onBackToLogin={handleBackToLogin} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
