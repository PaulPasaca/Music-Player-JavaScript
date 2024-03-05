
const playlistCanciones = document.getElementById("playlist-canciones");
const btn_play = document.getElementById("play");
const btn_pause = document.getElementById("pause");
const btn_siguiente = document.getElementById("next");
const btn_anterior = document.getElementById("previous");
const btn_aleatorio = document.getElementById("shuffle");

const todasCanciones = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();
let userData = {
  /**operador de dispersión (...) permite copiar todos los elementos de una matriz en otra. También 
   * puede utilizarse para concatenar varias matrices en una sola */
  canciones: [...todasCanciones],
  // maneja la cancion actual
  cancionActual: null,
  // maneja el tiempo de la cancion actual
  tiempoActualCanción: 0,

};

//FUNCION PARA REPRODUCIR LAS CANCIONES
const playCancion = (id) => {
  const cancion = userData?.canciones.find((song) => song.id === id);
  audio.src = cancion.src;
  audio.title = cancion.title;

  if (userData?.cancionActual === null || userData?.cancionActual.id !== cancion.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.tiempoActualCanción;
  }
  userData.cancionActual = cancion;

  /**A continuación, utiliza la propiedad classList y el método add() para añadir la 
   * clase playing al elemento playButton. Esto buscará la clase playing en el archivo CSS 
   * y la añadirá al elemento playButton.
   * Pinta o resalta al pulsar el boton play
 */
  btn_play.classList.add("playing");
  destacarCancionActual();
  establecerPantallaReproductor();
  textoAccesibleBtnReproducir()
  audio.play();
};

const pausarCancion = () => {
  /** 
   * Para almacenar el tiempo actual de la canción cuando está en pausa, 
   * establece el songCurrentTime del objeto userData al currentTime de la variable audio.
  */
  userData.tiempoActualCanción = audio.currentTime;
  btn_play.classList.remove("playing")
  audio.pause();

};

const playSiguienteCancion = () => {
  if (userData?.cancionActual === null) {
    playCancion(userData?.canciones[0].id);
  } else {
    const indiceCancionActual = obtenerIndiceCancionActual();
    //Suma +1 al index de la cancion 
    const siguienteCancion = userData?.canciones[indiceCancionActual + 1];
    //reproduce la cancion segun el id 
    playCancion(siguienteCancion.id);
  }
};

const playAnteriorCancion = () => {
  if (userData?.cancionActual === null) return;
  else {
    const indiceCancionActual = obtenerIndiceCancionActual();
    const anteriorCancion = userData?.canciones[indiceCancionActual - 1];
    playCancion(anteriorCancion.id);
  }
};

const aleatorio = () => {
  //entra a la data y la hace aleatorio
  userData?.canciones.sort(() => Math.random() - 0.5);
  // vacia el currentsong y currentTime
  userData.cancionActual = null;
  userData.tiempoActualCanción = 0;
  //muetra los nuevos dato 
  renderCanciones(userData?.canciones);
  pausarCancion();
  establecerPantallaReproductor();
  textoAccesibleBtnReproducir();
};



const borrarCancion = (id) => {
  if (userData?.cancionActual?.id === id) {
    userData.cancionActual = null;
    userData.tiempoActualCanción = 0;
    pausarCancion();
    establecerPantallaReproductor();
  }


  userData.canciones = userData?.canciones.filter((song) => song.id !== id);
  renderCanciones(userData?.canciones);
  destacarCancionActual();
  textoAccesibleBtnReproducir();
  //Optional chaining (?.) encadenamiento opcional
  if (userData?.canciones.length === 0) {
    //createElement() es un método DOM que puede utilizar para crear dinámicamente
    //un elemento utilizando JavaScript.
    const resetearBoton = document.createElement("button");
    //El método createTextNode() se utiliza para crear un nodo de texto.
    const resetearTexto = document.createTextNode("Resetear Playlist");
    resetearBoton.id = "reset";
    resetearBoton.ariaLabel = "Resetear playlist";
    //appendChild() permite añadir un nodo o un elemento como hijo de otro elemento.
    resetearBoton.appendChild(resetearTexto);
    playlistCanciones.appendChild(resetearBoton);

    resetearBoton.addEventListener("click", () => {
      userData.canciones = [...todasCanciones];
      renderCanciones(ordenarCanciones());
      textoAccesibleBtnReproducir();
      resetearBoton.remove();
    });
  }
};


const establecerPantallaReproductor = () => {
  const cancionPlay = document.getElementById("player-song-title");
  const artistaCancion = document.getElementById("player-song-artist");
  const tituloActual = userData?.cancionActual?.title;
  const artistaActual = userData?.cancionActual?.artist;

  cancionPlay.textContent = tituloActual ? tituloActual : "";
  artistaCancion.textContent = artistaActual ? artistaActual : "";
};


const destacarCancionActual = () => {
  //obtener el elemento .playlist-song y asígnalo a una constante playlistSongElements.
  const playlistElementosCancion = document.querySelectorAll(".playlist-song");

  //Utiliza getElementById() para obtener el id de la canción que se está reproduciendo, 
  //luego utiliza literales de plantilla para anteponerle song-. Asígnalo a la constante 
  //songToHighlight.
  const cancionDestacar = document.getElementById(
    `song-${userData?.cancionActual?.id}`
  );
  //El método forEach se utiliza para recorrer un array y realizar una función en cada 
  //elemento del array. 
  playlistElementosCancion.forEach((songEl) => {
    //para eliminar el atributo "aria-current". Esto eliminará el atributo para cada 
    //una de las canciones.
    songEl.removeAttribute("aria-current");
  });
  //Resalta la cancion reproducida
  if (cancionDestacar) cancionDestacar.setAttribute("aria-current", "true");
};

/**
 * Una función de flecha es una forma más corta y concisa de escribir funciones en JavaScript. 
 * Es una expresión de función, que es una función que se asigna a una variable.

 */
const renderCanciones = (array) => {
  //Añadir nuevo HTML para cada canción utilizando el método map(). 
  const cancionesHTML = array.map((song) => {
    return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playCancion(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="borrarCancion(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
  }).join("");

  playlistCanciones.innerHTML = cancionesHTML;

};

/**Esta función establece el atributo aria-label en la canción actual o en la primera canción 
 * de la lista de reproducción. Y si la lista de reproducción está vacía,establece el atributo 
 * aria-label en "Reproducir".
 */

const textoAccesibleBtnReproducir = () => {
  const cancion = userData?.cancionActual || userData?.canciones[0];
  
  btn_play.setAttribute(
    "aria-label",
    cancion?.title ? `Play ${cancion.title}` : "Play"
   
  );
};


const obtenerIndiceCancionActual = () => userData?.canciones.indexOf(userData?.cancionActual);


btn_play.addEventListener("click", () => {
  if (userData?.cancionActual === null) {
    playCancion(userData?.canciones[0].id);
  } else {
    //Esto garantiza que la canción que se está reproduciendo seguirá sonando cuando 
    //se pulse el botón de reproducción.

    playCancion(userData?.cancionActual.id);
  }
});

btn_pause.addEventListener("click", pausarCancion);
btn_siguiente.addEventListener("click", playSiguienteCancion);
btn_anterior.addEventListener("click", playAnteriorCancion);
btn_aleatorio.addEventListener("click", aleatorio);

//Si finaliza la cancion reproduce la siguiente 
audio.addEventListener("ended", () => {
  const indiceCancionActual = obtenerIndiceCancionActual();
  const existeSiguienteCancion = userData?.canciones[indiceCancionActual + 1] !== undefined;
  if (existeSiguienteCancion) {
    playSiguienteCancion();
  } else {
    userData.cancionActual = null;
    userData.tiempoActualCanción = 0;
    pausarCancion()
    establecerPantallaReproductor()
    destacarCancionActual()
    textoAccesibleBtnReproducir()
  }
 
 
 });
 

/**El método sort() convierte los elementos de una matriz en cadenas y las ordena en su 
 * lugar basándose en sus valores en la codificación UTF-16.
 */
const ordenarCanciones = () => {
  // recorre el user data de las canciones y las ordena
  userData?.canciones.sort((a, b) => {
    /*
    La razón por la que este ejemplo devuelve números es porque el método sort()
    espera que se devuelva un número. Si devuelve un número negativo, el primer 
    elemento se ordena antes que el segundo.
    */
    if (a.title < b.title) {
      return -1;
    }

    //la función devuelve 1, lo que ordena el primer title después del segundo.
    if (a.title > b.title) {
      return 1;
    }
    // devuelva el número 0 para dejar el orden de los dos elementos sin cambios.
    return 0;
  });
  return userData?.canciones;

};

renderCanciones(ordenarCanciones());
textoAccesibleBtnReproducir();