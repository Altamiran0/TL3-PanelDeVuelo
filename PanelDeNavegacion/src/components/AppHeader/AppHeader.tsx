import './AppHeader.css';

interface Props {
   isConnected: boolean,
   GPSmodule_isWork: boolean
}

function AppHeader ({ isConnected, GPSmodule_isWork }: Props) {
   return (
   <header className={ "appHeader" }>
      <h1>Panel de Navegacion</h1>
      <h3>Instrumentos de Navegacion a tiempo real</h3>
      {  ! isConnected
         ?  <p className={ "textState" }>
            <span className={ "state noConnected" }/> No conectado </p>
         : GPSmodule_isWork 
            ?  <p className={ "textState" }>
               <span className={ "state isConnected" }/> Conectado </p>
            :  <p className={ "textState" }>
               <span className={ "state GPSmoduleDontWork" }/> Conectado </p>
      }
   </header>
   );
};

export default AppHeader;