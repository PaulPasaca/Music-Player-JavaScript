
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
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
  songs: [...allSongs],
  // maneja la cancion actual
  currentSong: null,
  // maneja el tiempo de la cancion actual
  songCurrentTime: 0,

};

//FUNCION PARA REPRODUCIR LAS CANCIONES
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");
  highlightCurrentSong();

  audio.play();
};

const pauseSong = () => {
  /** 
   * Para almacenar el tiempo actual de la canción cuando está en pausa, 
   * establece el songCurrentTime del objeto userData al currentTime de la variable audio.
  */
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing")
  audio.pause();

};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    //Suma +1 al index de la cancion 
    const nextSong = userData?.songs[currentSongIndex + 1];
    //reproduce la cancion segun el id 
    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
  if (userData?.currentSong === null) return;
  else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
  }
};


const highlightCurrentSong = () => {
  //obtener el elemento .playlist-song y asígnalo a una constante playlistSongElements.
  const playlistSongElements = document.querySelectorAll(".playlist-song");

  //Utiliza getElementById() para obtener el id de la canción que se está reproduciendo, 
  //luego utiliza literales de plantilla para anteponerle song-. Asígnalo a la constante 
  //songToHighlight.
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );
  //El método forEach se utiliza para recorrer un array y realizar una función en cada 
  //elemento del array. 
  playlistSongElements.forEach((songEl) => {
    //para eliminar el atributo "aria-current". Esto eliminará el atributo para cada 
    //una de las canciones.
    songEl.removeAttribute("aria-current");
  });
  //Resalta la cancion reproducida
  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

/**
 * Una función de flecha es una forma más corta y concisa de escribir funciones en JavaScript. 
 * Es una expresión de función, que es una función que se asigna a una variable.

 */
const renderSongs = (array) => {
  //Añadir nuevo HTML para cada canción utilizando el método map(). 
  const songsHTML = array.map((song) => {
    return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
  }).join("");

  playlistSongs.innerHTML = songsHTML;
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);


playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    //Esto garantiza que la canción que se está reproduciendo seguirá sonando cuando 
    //se pulse el botón de reproducción.

    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);


/**El método sort() convierte los elementos de una matriz en cadenas y las ordena en su 
 * lugar basándose en sus valores en la codificación UTF-16.
 */
const sortSongs = () => {
  // recorre el user data de las canciones y las ordena
  userData?.songs.sort((a, b) => {
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
  return userData?.songs;

};

renderSongs(sortSongs());