var cantidadPalabras = 0;
var palabraNumero = 0;
var personajesUsados = 0;
var intentos = 0;

function corroborar(letra) {
  if (cantidadPalabras == 0){
    $.ajax({
    url:"/ahorcadoAjax",
    type:'GET',
    success: function(response){
      cantidadPalabras = response.length
      corroborar(letra)
    },
    error: function(error){
      console.log(error)
    }
    })
  } else {
    $.ajax({
    url:"/ahorcadoAjax",
    type:'GET',
    success: function(response){
      datos = response;
      palabra = datos[palabraNumero][0];
      palabra = palabra.toLowerCase()
      seUsoLaLetra = false;
      for(let i=0; i<palabra.length; i++){
        if (letra == palabra[i]){
          document.getElementById(`${i}`).innerHTML = ` ${letra} `
          seUsoLaLetra = true
        }
      }
      if (!seUsoLaLetra){
        intentos++
        document.getElementById('intentos').src = `/static/img/intentosAhorcado/intento${intentos}.png`
      }
      if (intentos==6){
        document.getElementById('qwerty').style.display = 'none';
        document.getElementById('resetearPersonaje').hidden = false;
        document.getElementById('pista').hidden = true;
        document.getElementById('mensaje').hidden = true;
      }
      
      palabraCompletada=true
      for(let i=0; i<palabra.length; i++){
        if (document.getElementById(`${i}`).innerHTML.includes("-")){
          palabraCompletada=false
        }
      }
      if(palabraCompletada){
        document.getElementById('juegoAhorcado').hidden = false;
        document.getElementById('qwerty').style.display = 'none';
        document.getElementById('pista').hidden = true;
        document.getElementById('mensaje').hidden = true;
        palabraNumero++
      }
    },
    error: function(error){
      console.log(error)
    }
    })
  }
}

function pista(){
  document.getElementById('mensaje').hidden = false;
  document.getElementById('pista').hidden = true;
}

function resetearMonigote(){
  intentos = 0
  document.getElementById('intentos').src = `/static/img/intentosAhorcado/intento0.png`
  personajesUsados++
  document.getElementById("numeroIntentos").innerHTML = `Personajes usados: ${personajesUsados}`
  document.getElementById('qwerty').style.display = 'block';
  document.getElementById('mensaje').hidden = false;
  document.getElementById('resetearPersonaje').hidden = true;
}

function nuevaPalabra(){
  if(palabraNumero<cantidadPalabras){
    document.getElementById('juegoAhorcado').hidden = true;
  document.getElementById('qwerty').style.display = 'block';
  document.getElementById('mensaje').hidden = true;
  document.getElementById('pista').hidden = false;
  intentos = 0
  document.getElementById('intentos').src = `/static/img/intentosAhorcado/intento0.png`
  $.ajax({
    url:"/ahorcadoAjax",
    type:'GET',
    success: function(response){
      document.getElementById('palabraAdivinar').innerHTML=""
      datos = response;
      palabra = datos[palabraNumero][0];
      for(let i=0; i<palabra.length; i++){
        if (palabra[i] === " "){
          document.getElementById('palabraAdivinar').innerHTML+=`<span class="espacio" id="${i}"> | </span>`
        } else {
          document.getElementById('palabraAdivinar').innerHTML+=`<span id="${i}"> - </span>`
        }
      }
      document.getElementById('mensaje').innerHTML= datos[palabraNumero][1]
    },
    error: function(error){
      console.log(error)
    }
    })
  } else {
    $.ajax({
            url:'/agregarJuegoCompleto',
            type:'POST',
            data:{"ODS":13},
            success: function(response) {
              if (response){
                document.getElementById('tablero').innerHTML=""
                document.getElementById('personaje').innerHTML+="<a href='/' id='botonIndex'><button class='c'><span></span><span></span><span></span><span></span>Inicio</button></a>"
                  
              }
            },
            error: function(error){
              console.log(error)
            }
          })
  }
  
}