
//Variables y constantes
let offset=1;
const limit=9;
const contenedorPokemons=document.querySelector(`#container__pokemons`);
async function getApiPokemon(id){
    try{
      const conexion= await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const data= await conexion.json();
      
        const pokemon={
          nombre:data.name,
          imagen:data.sprites.other.dream_world.front_default,
          numero:data.id,
          tipos:data.types,
          estadisticas:data.stats,
          movimientos:data.moves,
          altura:data.height,
          peso:data.weight

        }
        
        
      return dibujarPokemon(pokemon);
      
    }
    catch(err){
      console.error(err)
    }
}

function createModal(content){
  const modal=document.createElement( `div`);
  modal.classList.add(`modal`);
  const contentModal=document.createElement( `div`);
  contentModal.classList.add(`modal__content`);
  contentModal.appendChild(content);
  modal.appendChild(contentModal);
  document.body.appendChild(modal);

  //remover modal
  modal.addEventListener(`click`,(e)=>{
    if(e.target===modal){
      document.body.removeChild(modal);
    }
  });
}

function dibujarPokemonModal(pokemon){
  const {nombre,imagen,numero,estadisticas,movimientos,altura,peso}=pokemon;

  const templateModalPoke=document.querySelector(`#template__modalpoke`).content;
  const clonarPoke=templateModalPoke.cloneNode(true);
  const templateEstadisticas=document.querySelector(`#template__estadisticas`).content;
  const fragmentoEstadisticas=document.createDocumentFragment();
  const templateMovimientos=document.querySelector(`#template__movimientos`).content;
  const fragmentoMovimientos=document.createDocumentFragment();
  

  clonarPoke.querySelector(`.pokemon__nombre`).textContent=`N°${numero.toString().padStart(3,0)}  ${nombre}`;
  clonarPoke.querySelector(`.pokemon__imagen`).setAttribute(`src`,imagen);
  clonarPoke.querySelector(`.pokemon__imagen`).setAttribute(`alt`,nombre);
  clonarPoke.querySelector(`.pokemon__peso`).textContent=`${peso/10} kg.`;
  clonarPoke.querySelector(`.pokemon__altura`).textContent=`${altura/10} m.`;
  
  estadisticas.forEach(data=>{
    const clonarEstadisticas=templateEstadisticas.cloneNode(true);
    clonarEstadisticas.querySelector(`.pokemon__nombre-stat`).textContent=`${data.stat.name}`;
    clonarEstadisticas.querySelector(`.pokemon__dato-stat`).textContent=`${data.base_stat}`;
    fragmentoEstadisticas.appendChild(clonarEstadisticas);
    
  });
  clonarPoke.querySelector(`.pokemon__estadisticas`).appendChild(fragmentoEstadisticas);

  movimientos.forEach(movimiento=>{

    const clonarMovimientos=templateMovimientos.cloneNode(true);
    clonarMovimientos.querySelector(`.pokemon__movimiento`).textContent=movimiento.move.name;
    fragmentoMovimientos.appendChild(clonarMovimientos);
  });
  clonarPoke.querySelector(`.pokemon__movimientos`).appendChild(fragmentoMovimientos);
  return clonarPoke;
}

//crear el html para el pokemon 
function dibujarPokemon(pokemon){    
    const {nombre,imagen,numero,tipos}=pokemon
    const template=document.querySelector(`#template__pokemon`).content;
    const clonarPoke=template.firstElementChild.cloneNode(true);
    clonarPoke.querySelector(`.pokemon__nombre`).textContent=nombre;
    clonarPoke.querySelector(`.pokemon__numero`).textContent=`N° ${numero.toString().padStart(3,0)}`;
    clonarPoke.querySelector(`.pokemon__imagen`).setAttribute(`src`,imagen);
    clonarPoke.querySelector(`.pokemon__imagen`).setAttribute(`alt`,nombre);
    //clonarPoke.querySelector(`.pokemon__tipos`)
    let pokemonTipos=tipos;
    const fragmentoTipos=document.createDocumentFragment();
    //objeto de traduccion de tipos al español
    const listaTipos={
      normal:`normal`,
      fighting:`Lucha`,
      flying:`volador`,
      poison :`veneno`,
      ground:`tierra`,
      rock:`roca`,
      bug:`bicho`,
      ghost:`fantasma`,
      steel:`acero`,
      fire:`fuego`,
      water:`agua`,
      grass:`planta`,
      electric:`eléctrico`,
      psychic:`psiquico`,
      ice:`hielo`,
      dragon:`dragón`,
      dark:`Siniestro`,
      fairy:`hada`,
      unknown:`desconocido`,
      shadow:`oscuridad`
    }
    pokemonTipos.forEach(tipo=> {
      const li=document.createElement(`li`);
      li.classList.add(`pokemon__tipo`,`${tipo.type.name}`);
      li.textContent=listaTipos[`${tipo.type.name}`];
      fragmentoTipos.appendChild(li);
    });
    clonarPoke.querySelector(`.pokemon__tipos`).appendChild(fragmentoTipos);
    clonarPoke.addEventListener(`click`,(e)=>{
      if(document.querySelector(`.modal`)){
        return
      }else{
        createModal(dibujarPokemonModal(pokemon));
      }
    });
    return clonarPoke;
}

function borrarpokemon(contenedorPokemons){
  while(contenedorPokemons.firstChild){
    contenedorPokemons.removeChild(contenedorPokemons.firstChild);
  }
}

//dibuja los 9 primeros pokemons
async function listarPokemon(inicio,fin){
    try {
      const titlePokemon=document.querySelector(`.pokes__title`);
      let fragmento=document.createDocumentFragment(); 
      for(let i=inicio;i<inicio + fin;++i){
      fragmento.appendChild( await getApiPokemon(i));
    }
      titlePokemon.classList.remove(`skeletitle`);
      borrarpokemon(contenedorPokemons);
      contenedorPokemons.appendChild(fragmento);
    } catch (err) {
      console.error(err);
    } 
}

//busqueda de pokemon por nombre o número
async function searchPoke(search){
 
  try {  
    const titlePokemon=document.querySelector(`.pokes__title`);
    let fragmento=document.createDocumentFragment();
    fragmento.appendChild( await getApiPokemon(search));

    titlePokemon.classList.remove(`skeletitle`);
    borrarpokemon(contenedorPokemons);
    contenedorPokemons.classList.add(`container__pokemons--result`);
    contenedorPokemons.appendChild(fragmento);
  } catch (err) {
    console.error(err);
  }

}

//delegación de evento clic
document.addEventListener(`click`,(e)=>{
  e.preventDefault();
  //detectar click en el boton aterior
  if(e.target.id==="boton__anterior"){
    if(offset>=9){
      offset-=9
      borrarpokemon(contenedorPokemons);
      skeletoLoading(limit)
      listarPokemon(offset,limit)
    }
  }
 //detectar click en el boton siguiente
  if(e.target.id==="boton__siguiente"){
    offset+=9
    borrarpokemon(contenedorPokemons);
    skeletoLoading(limit)
    listarPokemon(offset,limit)
  }
   //detectar click en el boton busqueda
   if(e.target.id==="btnSearch"){
    const searchValue=document.querySelector(`#search`).value;
    let btnpag=document.querySelectorAll(`.navigation__boton`);
    if(searchValue===null || searchValue===`` || searchValue===undefined ){
     // borrarpokemon(contenedorPokemons);
      skeletoLoading(limit);
      contenedorPokemons.classList.remove(`container__pokemons--result`);
      listarPokemon(offset,limit);
      document.querySelector(`.navigation__boton`).disabled=false;
    }else{
      searchPoke(searchValue);
    }
  }
});

document.addEventListener(`DOMContentLoaded`,()=>{ 
  skeletoLoading(limit)
})
listarPokemon(offset,limit) 

//crear dinamicamente la skeleton loader 
function skeletoLoading(cantidad){
  const templateSkeleton=document.querySelector(`#template__skeleton`).content;
  const fragmentoSkeleton=document.createDocumentFragment();
  for (let i = 1; i <= cantidad; i++) {
    const clonarSkeleton=templateSkeleton.cloneNode(true);
    fragmentoSkeleton.appendChild(clonarSkeleton);
  }
  contenedorPokemons.appendChild(fragmentoSkeleton);
}

function elementClass(element,classs){
  const elementoCreado=document.createElement(element);
  elementoCreado.classList.add(classs);
  return elementoCreado;
}