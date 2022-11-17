var casillasPalabras = [
  /*1*/[['11C2','11C3','11C4','11C5','11C6','11C7','11C8','11C9','11C10','11C12','11C13','11C14','11C15','11C16','11C17','11C18','11C19','11C20','11C21','11C22'],'H'],
  /*2*/[['4C6','4C7', '4C8', '4C9', '4C10', '4C11', '4C12', '4C13', '4C14', '4C15', '4C16', '4C17'],'H'],
  /*3*/[['2C6','3C6','4C6','5C6','6C6','7C6','9C6','10C6','11C6','12C6'],'V'],
  /*4*/[['3C3','3C4','3C5','3C6','3C8','3C9','3C10','3C11','3C12'],'H'],
  /*5*/[['7C2','7C3','7C4','7C5','7C6','7C7','7C8','7C9','7C10','7C11','7C13','7C14','7C15','7C16','7C17','7C18'],'H'],
  /*6*/[['10C12','11C12','12C12','13C12','14C12','15C12'],'V'],
  /*7*/[['8C19','9C19','10C19','11C19','12C19','13C19','14C19','15C19','16C19','17C19','19C19','20C19','21C19','22C19','23C19','24C19'],'V'],
  /*8*/[['4C21', '5C21', '6C21', '7C21', '8C21', '9C21', '10C21', '11C21', '12C21', '13C21', '14C21', '16C21', '17C21', '18C21', '19C21', '20C21', '21C21', '22C21', '23C21', '24C21', '25C21', '26C21'],'V'],
  /*9*/[['9C2', '10C2', '11C2', '12C2', '13C2', '14C2', '15C2', '16C2', '17C2', '18C2', '20C2', '21C2', '22C2', '23C2', '24C2', '25C2'],'V']
  
]

var errorActivo=0;
function error(){
  document.getElementById("mensaje").innerHTML="Hay Palabras incorrectas";
  document.getElementById("mensaje").style.color="#FF0000";
  errorActivo=1;
}

setInterval('ocultarError()',10000);

function ocultarError(){
  if(errorActivo==1){
    document.getElementById("mensaje").innerHTML="";
    document.getElementById("mensaje").className="";
    errorActivo=0;
  }
}


function verificar(boton){
    document.getElementById("mensaje").innerHTML="";
  
    var palabra1 = "";
    for(i=0;i<casillasPalabras[0][0].length;i++){
      palabra1+= document.getElementById("fila"+casillasPalabras[0][0][i]).value.toLowerCase();
    }
  
    var palabra2 = "";
    for(i=0;i<casillasPalabras[1][0].length;i++){
      palabra2+= document.getElementById("fila"+casillasPalabras[1][0][i]).value.toLowerCase();
    }
  
    var palabra3 = ""; 
    for(i=0;i<casillasPalabras[2][0].length;i++){
      palabra3+= document.getElementById("fila"+casillasPalabras[2][0][i]).value.toLowerCase();
    }
  
    var palabra4 = "";
    for(i=0;i<casillasPalabras[3][0].length;i++){
      palabra4+= document.getElementById("fila"+casillasPalabras[3][0][i]).value.toLowerCase();
    }
  
    var palabra5 = "";
    for(i=0;i<casillasPalabras[4][0].length;i++){
      palabra5+= document.getElementById("fila"+casillasPalabras[4][0][i]).value.toLowerCase();
    }
  
    var palabra6 = "";
    for(i=0;i<casillasPalabras[5][0].length;i++){
      palabra6+= document.getElementById("fila"+casillasPalabras[5][0][i]).value.toLowerCase();
    }
  
    var palabra7 = "";
    for(i=0;i<casillasPalabras[6][0].length;i++){
      palabra7+= document.getElementById("fila"+casillasPalabras[6][0][i]).value.toLowerCase();
    }
    var palabra8 = "";
    for(i=0;i<casillasPalabras[7][0].length;i++){
      palabra8+= document.getElementById("fila"+casillasPalabras[7][0][i]).value.toLowerCase();
    }
    var palabra9 = "";
    for(i=0;i<casillasPalabras[8][0].length;i++){
      palabra9+= document.getElementById("fila"+casillasPalabras[8][0][i]).value.toLowerCase();
    }
    
    var palabrasBase = []
    $.ajax({
      url:'/crucigramaAjax',
      method: 'GET',
      success: function (response) {
        palabrasBase = response
        var palabrasIngresadas = [palabra1,palabra2,palabra3,palabra4,palabra5,palabra6,palabra7,palabra8,palabra9]
    console.log()
        var bien;
    
        for(i=0;i<palabrasBase.length;i++){
          for(m=0;m<casillasPalabras[i][0].length;m++){
            var casillas = document.getElementById('fila'+casillasPalabras[i][0][m])
          if(palabrasBase[i] !== palabrasIngresadas[i]){
            if(boton == 'reset' && !casillas.classList.contains('correcto')){
              casillas.value = ''
              casillas.classList.remove('incorrecto');
            }else{
              !casillas.classList.contains('correcto') && casillas.classList.add('incorrecto');
              document.getElementById('botonReset').style.display = 'block';
              bien = false;
            }
          }else{
            casillas.classList.remove('incorrecto');
            casillas.classList.add('correcto');
            if (bien != false){
              bien = true;
            }
          }
        }
          console.log(bien)
        }
        if(bien == true && boton !== 'reset'){
          $.ajax({
            url:'/agregarJuegoCompleto',
            type:'POST',
            data:{"ODS":2},
            success: function(response) {
              if (response){
                document.getElementById("mensaje").innerHTML="Ganaste";
                document.getElementById("mensaje").style.fontSize="24px";
                document.getElementById("mensaje").style.color="#64bf4b";
                document.getElementById("botonIndex").hidden=false;
              }
            },
            error: function(error){
              console.log(error)
            }
          })
        }else{
          error()
        }
      },
      error: function (error){
        console.log(error)
      }
    })

    
}

var ultimaPalabra = -1;

function siguiente(valor){
  valor = valor.substring(4)
  var ultimaCasilla = [];
  
  var coincidencias = []
  for(i=0;i<casillasPalabras.length;i++){
    if(casillasPalabras[i][0].includes(valor)){
      coincidencias.push([i, casillasPalabras[i][0].indexOf(valor)])
    }
  }
    if((coincidencias.length == 2 && coincidencias[0][1] == 0 && (ultimaPalabra !== 2 && ultimaPalabra !== 8)) || coincidencias.length == 1){
      ultimaCasilla.push(coincidencias[0][0])
      ultimaCasilla.push(coincidencias[0][1])
      
    }else if(coincidencias.length == 2 && coincidencias[1][1] == 0){
      ultimaCasilla.push(coincidencias[1][0])
      ultimaCasilla.push(coincidencias[1][1])
      
    }else{
      if(coincidencias[0][0] === ultimaPalabra){
        ultimaCasilla.push(coincidencias[0][0])
        ultimaCasilla.push(coincidencias[0][1])
        
      }else if(coincidencias[1][0] === ultimaPalabra){
        ultimaCasilla.push(coincidencias[1][0])
        ultimaCasilla.push(coincidencias[1][1])
      
      }
    }
  
    try{
      document.getElementById('fila'+casillasPalabras[ultimaCasilla[0]][0][ultimaCasilla[1]+1]).focus()
      ultimaPalabra = ultimaCasilla[0]
    }catch{
      ultimaPalabra = -1;
    }

}

for(fila=1; fila<=26; fila++){
  for(columna=1;columna<=23;columna++){
    var casillas = document.getElementById(`fila${fila}C${columna}`)
   casillas.setAttribute("onkeyup","siguiente(this.id);");
  }
}