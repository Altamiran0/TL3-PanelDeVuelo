import './AppHeader.css';

function AppHeader () {
   const isConnected = false;
   return (
   <header className={ "appHeader" }>
      <h1>Panel de Navegacion</h1>
      <h3>Instrumentos de Navegacion a tiempo real</h3>
      {  isConnected
         ? <p className={ "textState" }>
            <span className={ "state isConnected" }/> Conectado </p>
         : <p className={ "textState" }>
            <span className={ "state noConnected" }/> No conectado </p>
      }
   </header>
   );
};

export default AppHeader;