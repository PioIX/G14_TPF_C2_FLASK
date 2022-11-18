from flask import Flask, render_template, request, jsonify, session,redirect, url_for
import sqlite3
import os

app = Flask(__name__)
app.secret_key = os.environ['session']

## INDEX
@app.route('/')
def index():
  if 'estadoCuenta' not in session:
    session['estadoCuenta'] = False
    session['usuario'] = None
  conn = sqlite3.connect('ODSGames.db')
  tituloODSDos = '''SELECT titulo FROM juegos WHERE ods=2'''
  comoSeJuegaODSDos = '''SELECT comoSeJuega FROM juegos WHERE ods=2'''
  
  return render_template("index.html",usuario=session['usuario'], estadoCuenta=session['estadoCuenta'], tituloJuego=conn.execute(tituloODSDos).fetchone()[0], comoSeJuega=conn.execute(comoSeJuegaODSDos).fetchone()[0])

##CUENTAS
@app.route('/ingresarCuenta/<proceso>', methods=['GET','POST'])
def ingresarCuenta(proceso):
  if request.method=='POST':
    nombreUsuario = request.form['user']
    contraseñaUsuario = request.form['pass']
    alerta = ""
    conn = sqlite3.connect('ODSGames.db')
    if proceso == "loguearse":
      comprobarExistencia = f'''SELECT cuenta FROM usuarios WHERE cuenta="{nombreUsuario}" AND contraseña = "{contraseñaUsuario}"'''
      if conn.execute(comprobarExistencia).fetchone() != None:
        session['estadoCuenta'] = True
      else:
        alerta = "Usuario o contraseña incorrectos"
    else:
      comprobarExistencia = f'''SELECT cuenta FROM usuarios WHERE cuenta="{nombreUsuario}"'''
      if conn.execute(comprobarExistencia).fetchone() != None:
        alerta = "Cuenta ya creada, intente con otro nombre"
      else:
        agregarCuenta = f'''INSERT INTO usuarios (cuenta,contraseña) VALUES ("{nombreUsuario}","{contraseñaUsuario}")''' 
        conn.execute(agregarCuenta)
        conn.commit()
        session['estadoCuenta'] = True
    
    if session['estadoCuenta']:
      session['usuario'] = nombreUsuario
      return redirect('/perfil')
    else:
      return render_template("ingresarCuenta.html", usuario=session['usuario'], estadoCuenta=session['estadoCuenta'], proceso=proceso, alerta=alerta)
      
  else:
    if proceso != "cerrarSesion":
      return render_template("ingresarCuenta.html", usuario=session['usuario'], estadoCuenta=session['estadoCuenta'], proceso=proceso)
    else:
      session['estadoCuenta'] = False
      session['usuario'] = None
      return redirect('/')
  

@app.route('/perfil')
def perfil():
  conn = sqlite3.connect('ODSGames.db')
  buscarJuegosCompletados=f'''SELECT ods FROM juegosJugados WHERE cuenta="{session['usuario']}"'''
  cantidadJuegosCompletados=len(conn.execute(buscarJuegosCompletados).fetchall())
  return render_template("perfil.html", usuario=session['usuario'], estadoCuenta=session['estadoCuenta'],juegosCompletados=conn.execute(buscarJuegosCompletados).fetchall(),cantidadJuegosCompletados=cantidadJuegosCompletados)

##OPCIONES DE DESAROLLADOR {}
@app.route('/desarrollador')
def opcionesDeDesarrollador():
  conn = sqlite3.connect('ODSGames.db')
  listaJuegos=conn.execute('''SELECT * FROM juegos''').fetchall()
  numeroDeJuegos=len(listaJuegos)
  leyendasODS2=conn.execute('''SELECT leyenda FROM consignas WHERE ods=2''').fetchall()
  numeroLeyendas=len(leyendasODS2) 
  return render_template('opcionesDeDesarrollador.html',usuario=session['usuario'], estadoCuenta=session['estadoCuenta'],listaJuegos=listaJuegos,numeroDeJuegos=numeroDeJuegos,leyendasODS=leyendasODS2, numeroLeyendas=numeroLeyendas)

  
##JUEGOS
@app.route('/advertencia/<int:ODS>/<tituloJuego>')
def advertencia(ODS,tituloJuego):
  juego = f'{ODS} - {tituloJuego}'
  if ODS == 13:
    enlace = 'https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/10/13-Spanish_Why-it-Matters.pdf'
  elif ODS == 16:
    enlace = 'https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2017/01/Goal_16_Spanish.pdf'
  else:
    enlace = f'https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/10/{ODS}_Spanish_Why_it_Matters.pdf'

  if ODS == 2:
    botonJugar = url_for('crucigrama')
  elif ODS == 5:
    botonJugar = url_for('verdaderoOFalso')
  elif ODS == 7:
    botonJugar = url_for('sopaDeLetras')
  elif ODS == 13:
    botonJugar = url_for('ahorcado')
  
  
  return render_template("advertencia.html", usuario=session['usuario'], estadoCuenta=session['estadoCuenta'], tituloJuego=juego, pdf=enlace, url=botonJugar)

@app.route('/crucigrama')
def crucigrama():
  conn=sqlite3.connect('ODSGames.db')
  extraerLeyendas = '''SELECT leyenda FROM consignas WHERE ods=2'''
  leyendas = conn.execute(extraerLeyendas).fetchall()
  return render_template('crucigrama.html',leyendas=leyendas, numeroLeyendas=len(leyendas), usuario=session['usuario'], estadoCuenta=session['estadoCuenta'])
@app.route('/verdaderoOFalso')

def verdaderoOFalso():  
  conn = sqlite3.connect('ODSGames.db')
  extraerPrimerConsigna = '''SELECT leyenda FROM consignas WHERE ods=5 LIMIT 1'''
  consigna = conn.execute(extraerPrimerConsigna).fetchone()[0]
  
  return render_template('verdaderoOFalso.html', usuario=session['usuario'],estadoCuenta=session['estadoCuenta'],consigna=consigna)
  
@app.route('/sopaDeLetras')
def sopaDeLetras():
  return render_template('sopaDeLetras.html',usuario=session['usuario'], estadoCuenta=session['estadoCuenta'])  

@app.route('/ahorcado')
def ahorcado():
  conn = sqlite3.connect('ODSGames.db')
  extraerPrimerConsigna = '''SELECT respuesta,leyenda FROM consignas WHERE ods=13 LIMIT 1'''
  consigna = conn.execute(extraerPrimerConsigna).fetchall()
  longitudPalabra = len(consigna[0][0])
  return render_template('ahorcado.html',usuario=session['usuario'],estadoCuenta=session['estadoCuenta'], consigna=consigna,longitudPalabra=longitudPalabra)


## AJAX
  ##INDEX
@app.route('/extraerDatosDelJuego', methods=["GET","POST"])
def extraerDatosDelJuego():
  if request.method == "POST":
    ODS = request.form["ODS"]
    conn = sqlite3.connect('ODSGames.db')
    tituloODS = f'''SELECT titulo FROM juegos WHERE ods={ODS}'''
    comoSeJuegaODS = f'''SELECT comoSeJuega FROM juegos WHERE ods={ODS}'''
    tituloJuego=conn.execute(tituloODS).fetchone()[0]    
    comoSeJuega=conn.execute(comoSeJuegaODS).fetchone()[0]
    datos=[tituloJuego,comoSeJuega]
    return jsonify(datos)
    
  ##PERFIL
@app.route('/agregarJuegoCompleto', methods=["GET","POST"])
def agregarJuegoCompleto():
  if request.method == "POST":
    if session['estadoCuenta']==True:
      conn = sqlite3.connect('ODSGames.db')
      comprobarExistencia = f'''SELECT cuenta FROM juegosJugados WHERE ods="{request.form['ODS']}" AND cuenta="{session['usuario']}"'''
      if conn.execute(comprobarExistencia).fetchone() == None:
        juegoCompletado=f'''INSERT INTO juegosJugados (cuenta, ods) VALUES ("{session['usuario']}", {request.form['ODS']})'''
        conn.execute(juegoCompletado)
        conn.commit()
    return jsonify(True)
    
  ##OPCIONES DE DESARROLLADOR
@app.route('/baseDesarrollador', methods=['GET','POST','DELETE','PUT'])
def BaseDesarrollador():
  conn=sqlite3.connect('ODSGames.db')
  if request.method == 'POST':
    if request.form['accion'] == 'GET':
      if request.form["parteBase"]=="leyenda" or request.form["parteBase"]=="respuesta":
        varFrom = "consignas"
      else:
        varFrom = "juegos"
      return jsonify(conn.execute(f'''SELECT {request.form["parteBase"]} FROM {varFrom} WHERE ods={request.form["ods"]}''').fetchall())
  elif request.method == 'GET':
    cuentas = conn.execute('SELECT cuenta FROM usuarios').fetchall()
    return jsonify(cuentas)
  elif request.method == 'DELETE':
    conn.execute(f'''DELETE FROM usuarios WHERE cuenta="{request.form['cuenta']}"''')
    conn.execute(f'''DELETE FROM juegosJugados WHERE cuenta="{request.form['cuenta']}"''')
    conn.commit()
    return jsonify(True)
  else:
    pass

##JUEGOS
@app.route('/crucigramaAjax')
def crucigramaAjax():
  conn = sqlite3.connect('ODSGames.db')
  respuestas = conn.execute('''SELECT respuesta FROM consignas WHERE ods=2''').fetchall()
  datos=[]
  for i in range(len(respuestas)):
    datos.append(respuestas[i][0])
  return jsonify(datos)

@app.route('/verdaderoOFalsoAjax')
def verdaderoOFalsoAjax():
  conn = sqlite3.connect('ODSGames.db')
  consignas = conn.execute('''SELECT respuesta, leyenda FROM consignas WHERE ods=5''').fetchall()
  return jsonify(consignas)

@app.route('/ahorcadoAjax')
def ahorcadoAjax():
  conn = sqlite3.connect('ODSGames.db')
  consignas = conn.execute('''SELECT respuesta, leyenda FROM consignas WHERE ods=13''').fetchall()
  return jsonify(consignas)
  
app.run(host='0.0.0.0', port=81)