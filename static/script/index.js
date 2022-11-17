let valoresDeImagenes = [2,5,7,13]
let imagenActivaEnElVector = 0
/* cambio del texto del juego */
function textoJuego(){
  $.ajax({
    url:"/extraerDatosDelJuego",
    type:"POST",
    data:{"ODS":valoresDeImagenes[imagenActivaEnElVector]},
    success: function(response){
      datos=response
      document.getElementById("tituloJuego").innerHTML=datos[0]
      document.getElementById("comoSeJuega").innerHTML=datos[1]
      /*cambio enlace de botones*/
      if (valoresDeImagenes[imagenActivaEnElVector]==13){
        document.getElementById("botonInfo").href=`https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/10/13-Spanish_Why-it-Matters.pdf`
      }else if(valoresDeImagenes[imagenActivaEnElVector]==16){
        document.getElementById("botonInfo").href=`https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2017/01/Goal_16_Spanish.pdf`
      }else{
      document.getElementById("botonInfo").href=`https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/10/${valoresDeImagenes[imagenActivaEnElVector]}_Spanish_Why_it_Matters.pdf`
      }
      document.getElementById("botonJugar").href=`/advertencia/${valoresDeImagenes[imagenActivaEnElVector]}/${datos[0]}`
    },
    error: function(error){
      console.log(error)
    }
  })
}
 
  
/*cambio de imagen a la amterior*/
function juegoAnterior() {
  document.getElementById(`${valoresDeImagenes[imagenActivaEnElVector]}img`).hidden = true
  if(imagenActivaEnElVector == 0){
    imagenActivaEnElVector = 3
  }else{
    imagenActivaEnElVector--
  }
  document.getElementById(`${valoresDeImagenes[imagenActivaEnElVector]}img`).hidden = false
  textoJuego()
}

/*cambio de imagen a la siguiente*/
function juegoSiguiente(){
  document.getElementById(`${valoresDeImagenes[imagenActivaEnElVector]}img`).hidden = true
  if(imagenActivaEnElVector==3){
    imagenActivaEnElVector = 0
  }else{
    imagenActivaEnElVector++
  }
  document.getElementById(`${valoresDeImagenes[imagenActivaEnElVector]}img`).hidden = false
  textoJuego()
}