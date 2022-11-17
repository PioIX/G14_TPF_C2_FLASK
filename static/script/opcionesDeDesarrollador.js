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

    if ((juego==2&&((parteBase=="leyenda"&&(accion=='POST'||accion=='DELETE'))||(parteBase=="respuesta"&&(accion=='POST'||accion=='PUT'||accion=='DELETE'))))||(juego==7&&((parteBase=='leyenda'&&(accion=='GET'||accion=='POST'||accion=='PUT'||accion=='DELETE'))||(parteBase=='respuesta'&&(accion=='POST'||accion=='PUT'||accion=='DELETE'))))||((parteBase=='titulo'||parteBase=='comoSeJuega')&&(accion=='POST'||accion=='DELETE'))){
      document.getElementById('accion').innerHTML = '<h1 id="accionNoDisponible"> Accion no disponible :( </h1>'
    } else if ((juego==5||juego==13)&&(accion=='POST'||accion=='DELETE')) {
        if(accion=='POST'){
          document.getElementById('accion').innerHTML=`<form action="agregarConsigna(${juego})" Method=${accion}><lebel for="leyendaAAgregar">Leyenda: </lebel><input name="leyendaAAgregar" class="datoIngresarCuenta" type="text"/><br/><lebel for="respuestaAAgregar">Respuesta: </lebel><input name="respuestaAAgregar" class="datoIngresarCuenta" type="text"/><br/><button type="submit" class="b">Agregar Pregunta</button></form>`
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