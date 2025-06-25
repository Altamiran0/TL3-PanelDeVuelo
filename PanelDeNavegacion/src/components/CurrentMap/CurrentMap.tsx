import "./CurrentMap.css";

function CurrentMap() {
return (
   <div className={ "map" }>
      <span className={ "positionCard" }>
         <p>Latitud: { "-34.7242" }º</p>
         <p>Longitud: { "-58.3506" }º</p>
      </span>
   </div>
   );
};

export default CurrentMap;