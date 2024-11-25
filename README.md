 <h1 align="center">CLINICA ONLINE </h1>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e6fcce6a-eff9-404e-af21-72f56555c7e8" alt="Clínica logo" width="300px"/>
</p>

---

# Indice

- [Sobre mí](#personal)
- [Introducción](#introduccion)
- [Interfaz y uso](#uso)
  - [Inicio](#inicio)
  - [Registro](#registro)
  - [Inicio de sesión](#inicio-sesión)
  - [Solicitar turnos](#solicitar-turno)
  - [Mis turnos (paciente)](#mis-turnos-paciente)
  - [Mi perfil](#mi-perfil)
  - [Mis turnos (especialista)](#mis-turnos-especialista)
  - [Usuarios](#usuarios)
  - [Registrar administrador](#registrar-administrador)
  - [Registrar pacientes / especialistas](#registrar-paciente-especialista)
  - [Solicitar turno (administrador)](#solicitar-turno-administrador)
  - [Registrar administrador](#turnos)
  - [Graficos y estadísticas](#graficos-estadisticas)


# Personal

Me llamo Franco Yapura, tengo 19 años y actualmente estoy cursando el último cuatrimestre de la tecnicatura en Programacion en la UTN.
Este es uno de los proyectos finales de la cursada y está trabajado con Angular y Firebase.


# Introduccion

Este proyecto simula un sistema de clínica virtual en donde se pueden registrar usuarios que pueden reservar y realizar turnos en caso de ser paciente y aceptarlos y rechazarlos en caso de ser un especialista.

##### Link: https://clinica-yapura.web.app/home

# uso

## inicio


<div align="center">
<p> Al entrar a la página tendremos dos opciones: Registrarnos o iniciar sesión </p>
<br>
  <img src="https://github.com/user-attachments/assets/2ddf7a28-fea0-4295-8851-650b616b7551" alt="Inicio del sistema" width="800px" margin-top="100px"/>
  <br>
</div>

## registro

  
<div align="center">
<p> Si ingresamos al registro podremos ver dos opciones: </p>
  <p>- Registrarnos como pacientes</p>
  <p>- Registrarnos como Especialistas</p>
<br>
  <img src="https://github.com/user-attachments/assets/18dcaed6-b954-45b8-a543-2d079271fdac" alt="tipos de registro" width="800px" margin-top="100px"/>
  <br>
  <br>
  <br>

<p> Al ingresar al registro de pacientes deberemos completar el formulario con datos personales y dos imágenes. </p>
<br>

  <img src="https://github.com/user-attachments/assets/103ee457-3c1b-4c4a-bb36-ddee9f89e631" alt="registro de cliente" width="800px" margin-top="100px"/>

<br>
<br>
<br>
  
  <p> Cuando finalicemos de registrar al cliente nos llegará un mail de confirmación de cuenta. Una vez de confirmada podremos utilizar la cuenta de cliente </p>
<br>
<br>

  <p> Si, en cambio, ingresamos como Especialista deberemos completar también con datos personales y las especialidades del mismo. Para ser aceptada su cuenta deberá confirmar nuevamente a través de un correo su identidad y además deberá esperar a que un administrador permita su acceso</p>
<br>

<img src="https://github.com/user-attachments/assets/bc19a88b-ea7d-454b-93ae-7c70a00ccb25" alt="registro de especialista" width="800px"/>
</div>


## inicio-sesión

  
<div align="center">
<p> Si ingresamos Inicio de sesión podremos ver el formulario para iniciar y también 6 perfiles predeterminados: </p>
  <p>- 1 Administrador</p>
  <p>- 2 Especialistas</p>
  <p>- 3 Pacientes</p>
<br>
  <img src="https://github.com/user-attachments/assets/aa1c3b87-9285-4816-979e-9985cef7e6a6" alt="Inicio de sesión" width="800px" margin-top="100px"/>
  <br>
  <br>

<p> Si iniciamos como Paciente podremos ver una pantalla de inicio con una barra de navegación </p>
<br>

  <img src="https://github.com/user-attachments/assets/f7e3dde8-9a03-4dda-bfa6-a574d907c746" alt="Inicio de paciente" width="800px" margin-top="100px"/>

<br>
<br>

## solicitar-turno

  
  <p> Si ingresamos a "Solicitar turno" podremos ver un formulario para solicitar un nuevo turno basándonos en los especialistas, sus especialidades y sus horarios disponibles </p>
<br>
<br>


<img src="https://github.com/user-attachments/assets/9a5a162c-600e-48ee-9c3e-0ededd013066" alt="Solicitar turno" width="800px"/>

<br>
<br>

## mis-turnos-paciente

  
  <p> Si ingresamos a "Mis turnos" podremos ver los turnos solicitados en donde se especifican los especialistas, especialidades, fecha y hora y sus estados </p>
<br>
<br>

<img src="https://github.com/user-attachments/assets/881341e5-4ab0-4414-9de8-25d63453331f" alt="Mis turnos" width="800px"/>


<br>
<br>
<p> Los estados de los turnos pueden ser: </p>
  <p>- Solicitado</p>
<img src="https://github.com/user-attachments/assets/4ecf33c2-d4cf-404c-9178-906a52fde752" width="800px"/>

<br>
<br>
  <p>- No realizado</p>
<img src="https://github.com/user-attachments/assets/4cf4978e-877b-4e01-98c2-83ee31b043ae" alt="No realizado" width="800px"/>
<br>
<br>
  <p>- Realizado</p>
<img src="https://github.com/user-attachments/assets/c9a780eb-e8e7-4c09-881b-e8546de53cfd" alt="Realizado" width="800px"/>
  <br>
<br>
  <p>- Cancelado</p>
<img src="https://github.com/user-attachments/assets/d1123c85-4e93-4072-bc10-f4840c1757e3" alt="Cancelado" width="800px"/>

  <p>- Rechazado</p>
<img src="https://github.com/user-attachments/assets/965a5c99-001a-4069-a0fc-99493712050a" alt="Rechazado" width="800px"/>

<br>
<br>

## mi-perfil

 <p> Por último podremos ingresar a "mi perfil" en donde se podrán ver los datos del usuario y si se está iniciado como paciente se puede ver el historial clínico, e incluso descargarlo en pdf</p>

<img src="https://github.com/user-attachments/assets/20e22353-7770-403b-9f6a-01ac639d2d2c" alt="Mi perfil" width="800px"/>

<img src="https://github.com/user-attachments/assets/26869e88-b73d-4b5c-b7d5-dff4b70e718f" alt="Historial clínico" width="800px"/>


<br>
<br>

<p> Si iniciamos como especialista podremos nuevamente ver la barra de navegación </p>
<br>
  <img src="https://github.com/user-attachments/assets/76202605-929a-47d7-a2ef-e5bbbb3fe668" alt="Inicio de especialista" width="800px" margin-top="100px"/>
<br>
<br>

## mis-turnos-especialista

  <p> Si ingresamos a "Mis turnos" podremos ver los turnos solicitados por los pacientes y tendermos las opciones de aceptarlos, rechazarlos, cancelarlos o finalizarlos  </p>

  <img src="https://github.com/user-attachments/assets/7488b88b-ced4-474a-bdbb-8380fa57c407" alt="Mis turnos" width="800px" margin-top="100px"/>


<br>
<br>

<p> Si iniciamos como administrador podremos nuevamente ver la barra de navegación </p>
<br>
  <img src="https://github.com/user-attachments/assets/ed440079-bffb-4f64-a0a6-c9aeaf5838f9" alt="Inicio de administrador" width="800px" margin-top="100px"/>
<br>
<br>

## usuarios

  <p> Si ingresamos a "usuarios" podremos ver todos los usuarios registrados en el sitema, tanto administradores, como especialistas y pacientes, con los respesctivos usuarios e información de sus cuentas </p>

  <img src="https://github.com/user-attachments/assets/97e171b7-a09e-4bde-a929-6872a3643a8c" alt="administradores" width="800px" margin-top="100px"/>
  <img src="https://github.com/user-attachments/assets/493d34c3-421c-4f00-adb9-8c38284da4b8" alt="Especialistas" width="800px" margin-top="100px"/>
  <img src="https://github.com/user-attachments/assets/b97f49f0-d794-4470-b047-519de1b98e86" alt="Pacientes" width="800px" margin-top="100px"/>
<br>
<br>

## registrar-administrador

  <p> Si ingresamos a "Registrar administrador" podremos ver un formulario para ingresar los datos y registrar un nuevo usuario de perfil administrador </p>

  <img src="https://github.com/user-attachments/assets/4f851b2d-594a-428d-bf23-32e17a6345cd" alt="Registrar administrador" width="800px" margin-top="100px"/>
  <br>
<br>

## registrar-paciente-especialista

  <p> Si ingresamos a "Registrar paciente / especialista" podremos ver los formularios respectivos para registrar pacientes y especialistas</p>

  <img src="https://github.com/user-attachments/assets/3fe80ff5-2bca-4da1-9dc1-327bbcc87077" alt="Registrar paciente / especialista" width="800px" margin-top="100px"/>
  <br>
<br>

## solicitar-turno-administrador

  <p> Si ingresamos a "solicitar turno" podremos solicitar un turno ingresando el especialista, especialidad, fecha, hora y paciente (todos los registrados en el sistema)</p>


  <img src="https://github.com/user-attachments/assets/9a5a162c-600e-48ee-9c3e-0ededd013066" alt="Registrar administrador" width="800px" margin-top="100px"/>
  <br>
  <br>

## turnos

<p> Si ingresamos a "Turnos" podremos ver todos los turnos del sistema, con su respectiva información</p>

  <img src="https://github.com/user-attachments/assets/850995d0-8de5-4b72-8ed3-5a03d0106cb0" alt="turnos" width="800px" margin-top="100px"/>
  <br>
  <br>

## graficos-estadisticas

<p> Si ingresamos a "Gráficos y estadísticas" podremos ver las estadísticas de algunos datos de la página, como la cantidad de turnos por especialidad o por día, o la cantidad de turnos en un lapso determinado de tiempo</p>

  <img src="https://github.com/user-attachments/assets/9770c2b2-f339-4ee0-ada4-088c85668f49" alt="turnos" width="800px" margin-top="100px"/>
  
  <img src="https://github.com/user-attachments/assets/a5079508-bbb9-480f-bfa0-405ec0b6b8ae" alt="turnos" width="800px" margin-top="100px"/>
  <br>

</div>

