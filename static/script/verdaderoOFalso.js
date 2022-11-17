var preguntasVF = 0;
var aciertosVF = 0;
var numeroPregunta = 0;
var agregarJustificacion = document.getElementById("listadoErroresVF");

function corroborar(respuesta) {
  if(preguntasVF == 0){
    $.ajax({
      url:'/verdaderoOFalsoAjax',
      method:'GET',
      success: function (response){
        preguntasVF = response.length
        corroborar(respuesta)
      },
      error: function(error){
        console.log(error)
      }
    })
  } else {
    $.ajax({
      url:'/verdaderoOFalsoAjax',
      method:'GET',
      success: function (response){
        consignas = response
        if (consignas[numeroPregunta][0].includes(respuesta)){
          aciertosVF++
          numeroPregunta++          
        } else {
          document.getElementById("errores").hidden=false
          if(respuesta=="V"){
            respuestaCorrecta="Falso"
          } else {
            respuestaCorrecta="Verdadera"
          }
          if(respuestaCorrecta=="Falso"){
            var justificacion = "";
            if (document.getElementById('consigna').innerHTML == consignas[2][1]){
              justificacion = "miles de mujeres menores contraen matrimonio cada año"
            } else if (document.getElementById('consigna').innerHTML == consignas[3][1]){
              justificacion = "las niñas no poseen un acceso a un mayor acceso a una asistencia sanitaria o una buena nutricion, por lo que hace que aumente la tasa de mortalidad"
            } else if (document.getElementById('consigna').innerHTML == consignas[5][1]){
              justificacion = "en Asia, Africa aubsahariana y Oceania tienen dificultados para matricularse tanto en escuelas primarias como secundarias"
            }
            agregarJustificacion.innerHTML += `<li>- ${respuestaCorrecta}, ${justificacion}</li>`
          } else {
            agregarJustificacion.innerHTML += `<li>- ${respuestaCorrecta}, ${document.getElementById('consigna').innerHTML}</li>`
          }
          numeroPregunta++ 
        }
      
        if(numeroPregunta<preguntasVF){
          document.getElementById('consigna').innerHTML = consignas[numeroPregunta][1]
        } else {
          $.ajax({
            url:'/agregarJuegoCompleto',
            type:'POST',
            data:{"ODS":5},
            success: function(response) {
              if (response){
                document.getElementById('consigna').innerHTML = ""
                document.getElementById("puntajeVF").innerHTML += ` ${aciertosVF}/${preguntasVF}`
                document.getElementById("resultadosFinales").hidden=false
                document.getElementById("botonesVF").hidden = true
              }
            },
            error: function(error){
              console.log(error)
            }
          })
        }
      },
      error: function(error){
        console.log(error)
      }
    })
  }
}