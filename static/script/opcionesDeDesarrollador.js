function cambioSeccion(seccion) {
  document.getElementById(id=`menuAccion${seccion}`).hidden = false
  if (seccion=="Cuentas"){
    document.getElementById(id=`menuAccionJuegos`).hidden = true
  } else {
    document.getElementById(id=`menuAccionCuentas`).hidden = true
  }
  cambioDeAccion(seccion)
}

function cambioDeAccion(seccion){
  if(seccion=="Cuentas"){
    var accion = document.getElementById("seleccionAccionCuentas").value
    $.ajax({
      url:"/baseDesarrollador",
      method: "GET",
      success: function (response){
        datos=response
        document.getElementById('accion').innerHTML = ''
          for (let i = 0; i<datos.length; i++){
            if (datos[i][0]!="admin"){
              if (accion == "ver"){
              document.getElementById('accion').innerHTML += `<li><img src="/static/img/BASE/fotoUsuario.png" id="fotoUsuario"/>@${datos[i][0]}</li>`
            } else {
            document.getElementById('accion').innerHTML += `<li><div id='infoCuenta'><img src="/static/img/BASE/fotoUsuario.png" id="fotoUsuario"/>@${datos[i][0]}</div><button onclick='eliminarCuenta("${datos[i][0]}")' class="a"><span></span><span></span><span></span><span></span>Eliminar cuenta</button></a></li>`
            }
            }
          }          
      },
      error: function (error) {
        console.log(error)
      }
    })
  }else{
    var juego = document.getElementById("seleccionJuego").value
    var parteBase = document.getElementById("seleccionParteBase").value
    var accion = document.getElementById("seleccionAccion").value

    if (juego.includes("2")){
      juego = 2
    } else if (juego.includes("5")){
      juego = 5
    } else if (juego.includes("7")){
      juego = 7
    } else {
      juego = 13
    }
    
    if (parteBase=="leyendas"){
      parteBase = "leyenda"
    } else if (parteBase=="respuestas"){
      parteBase = "respuesta"
    } else if (parteBase=="titulo del juego"){
      parteBase = "titulo"
    } else if (parteBase=="descripcion del juego"){
      parteBase = "comoSeJuega"
    }

    if (accion=="ver"){
      accion = 'GET'
    } else if(accion=="editar"){
      accion = 'PUT'
    } else if(accion=="insertar"){
      accion = 'POST'
    } else {
      accion = 'DELETE'
    }
alert(`${juego}, ${parteBase}, ${accion} `)
    
    if ((juego==2&&((parteBase=="leyenda"&&(accion=='POST'||accion=='DELETE'))||(parteBase=="respuesta"&&(accion=='POST'||accion=='PUT'||accion=='DELETE'))))||(juego==7&&((parteBase=='leyenda'&&(accion=='GET'||accion=='POST'||accion=='PUT'||accion=='DELETE'))||(parteBase=='respuesta'&&(accion=='POST'||accion=='PUT'||accion=='DELETE'))))||((parteBase=='titulo'||parteBase=='comoSeJuega')&&(accion=='POST'||accion=='DELETE'))){
      document.getElementById('accion').innerHTML = '<h1 id="accionNoDisponible"> Accion no disponible :( </h1>'
    } else if ((juego==5||juego==13)&&(accion=='POST'||accion=='DELETE')){
        if(accion=='POST'){
          document.getElementById('accion').innerHTML=`
          <form action="/agregarConsigna" Method='POST'>
          <lebel for="leyendaAAgregar">Leyenda: </lebel><input name="leyendaAAgregar" class="datoIngresarCuenta" type="text"/>
          <br/><br/>
          <lebel for="respuestaAAgregar">Respuesta: </lebel><input name="respuestaAAgregar" class="datoIngresarCuenta" type="text"/>
          <br/><br/>
          <button type="submit" class="b">Agregar Pregunta</button>
          <br/><br/><br/><br/>
          <input name="ods" class="datoGuardar" class="datoGuardar" type="text" value="${juego}" readOnly/>
          </form>`
        } else {
          document.getElementById('accion').innerHTML=`
          <form action="/eliminarConsigna" Method='POST'>
          <lebel for="leyendaAAgregar">Leyenda: </lebel><select name="leyendaAEliminar" id="leyendaAEliminar" class="datoIngresarCuenta"></select>
          <br/><br/>
          <button type="submit" class="b">Agregar Pregunta</button>
          <br/><br/><br/><br/>
          <input name="ods" class="datoGuardar" class="datoGuardar" type="text" value="${juego}" readOnly/>
          </form>`
          $.ajax({
          url:'/obtenerDatosConsignas',
          method: 'POST',
          data:{"ods":juego},
          success:function(response){
          datos=response
          for (let i = 0; i<datos.length; i++){
              document.getElementById('leyendaAEliminar').innerHTML += `<option>${datos[i][0]}</option>`
            }
        },
        error:function(error){
          console.log(error)
        }
      })
        }
    } else if (accion=='GET'){
      $.ajax({
        url:'/baseDesarrollador',
        method: 'POST',
        data:{"parteBase":parteBase, "ods":juego, "accion":accion},
        success:function(response){
          datos=response
          document.getElementById('accion').innerHTML = ''
          for (let i = 0; i<datos.length; i++){
              document.getElementById('accion').innerHTML += `<li>${datos[i][0]}</li>`
            }
        },
        error:function(error){
          console.log(error)
        }
      })
    } else if (accion=='PUT'){
      if (parteBase == "titulo" || parteBase == "comoSeJuega"){
        document.getElementById('accion').innerHTML = `<form action="/cambiarTablaJuegos" method='POST'>
        <lebel for="parteACambiar">cambio: </lebel>
        <input name="parteACambiar" class="datoIngresarCuenta" type="text"/>
        <br/><br/>
        <button type="submit" class="b">Editar</button>
        <br/><br/><br/><br/>
        <input name="parteBase" class="datoGuardar" type="text" class="datoGuardar" value="${parteBase}" readOnly/>
        <input name="ods" class="datoGuardar" class="datoGuardar" type="text" value="${juego}" readOnly/>
        </form>`
      } else {
        document.getElementById('accion').innerHTML = `<form action="/cambiarTablaConsignas" method='POST'>
        <lebel for="parteOriginal">parte a cambiar: </lebel> 
        <select name="parteOriginal" id="parteOriginal"></select>
        <br/><br/>
        <lebel for="parteACambiar">cambio: </lebel>
        <input name="parteACambiar" class="datoIngresarCuenta" type="text"/>
        <br/><br/>
        <button type="submit" class="b">Editar</button>
        <br/><br/><br/><br/>
        <input name="parteBase" class="datoGuardar" type="text" class="datoGuardar" value="${parteBase}" readOnly/>
        <input name="ods" class="datoGuardar" class="datoGuardar" type="text" value="${juego}" readOnly/>
        </form>`
        $.ajax({
        url:'/baseDesarrollador',
        method: 'POST',
        data:{"parteBase":parteBase, "ods":juego, "accion":'GET'},
        success:function(response){
          datos=response
          for (let i = 0; i<datos.length; i++){
              document.getElementById('parteOriginal').innerHTML += `<option>${datos[i][0]}</option>`
            }
        },
        error:function(error){
          console.log(error)
        }
      })
      }
      
    }
  }
}

function eliminarCuenta(cuenta) {
    $.ajax({
    url:"/baseDesarrollador",
    method:"DELETE",
    data:{"cuenta":cuenta},
    success: function (response){
      if (response){
        alert(`la cuenta: @${cuenta} ha sido eliminada con exito`)
        cambioDeAccion("Cuentas")
      }
    },
    error: function (error){
      console.log(error)      
    }
  })
  }