import * as bootstrap from 'bootstrap';
import Swal from "sweetalert2";

const miTabla = document.querySelector('#miTabla')
const url = "http://localhost:4100/ciudadanos/";

const modalCiudadano = new bootstrap.Modal(
    document.getElementById("ModalCiudadano")
);

const btnCrear = document.querySelector('#btnCrear');

let codigo;
let nombre = document.querySelector("#nombre");
let apellido = document.querySelector("#apellido");
let Nickname = document.querySelector("#Nickname");
let nacimiento = document.querySelector("#nacimiento");
let origen = document.querySelector("#origen");
let residencia = document.querySelector("#residencia");
let foto = document.querySelector("#foto");
let qr = document.querySelector("#qr");
const estado = document.getElementById("estado");


const frmCiudadano = document.querySelector("#frmCiudadano");

var opcion = "";

document.addEventListener("DOMContentlpaded", cargarCiudadanos());

function cargarCiudadanos() {
    fetch(url + "listarTodos")
        .then(Response => Response.json())
        .then((datos) => {
            llenarTabla(datos);
        });
}

function llenarTabla(datos) {
    datos.data.forEach((Ciudadano) => {
        const fecha = new Date(Ciudadano.fecha_nacimiento);
        
        let fila = `<tr>
        <td>${Ciudadano.codigo}</td>
        <td>${Ciudadano.nombre}</td>
        <td>${Ciudadano.apellido}</td>
        <td>${Ciudadano.apodo_nickname}</td>
        <td>${fecha.toISOString().split("T")[0]}</td>
        <td>${Ciudadano.planeta_origen}</td>
        <td>${Ciudadano.planeta_residencia}</td>
        <td>${Ciudadano.foto}</td>
        <td><img src="${`http://localhost:4100${Ciudadano.codigo_qr}`}" alt="" srcset=""></td>
        <td>${Ciudadano.estado}</td>
        <td>
        <button type="button" class="btn btn-light btnEditar"><i class="bi bi-pencil"></i></button>
        <button type="button" class="btn btn-dark btnBorrar"><i class="bi bi-trash"></i></button>
        </td>
        </tr>
        `;
        miTabla.innerHTML += fila;
    });
}

btnCrear.addEventListener('click', () => {
    nombre.value = "";
    apellido.value = "";
    Nickname.value = "";
    nacimiento.value = "";
    origen.value = "";
    residencia.value = "";
    foto.value = "";
    qr.value = "";
    modalCiudadano.show();
    opcion = "crear";
});

miTabla.addEventListener('click', (e) => {
    if (e.target.closest(".btnEditar")) {
        const boton = e.target.closest(".btnEditar");
        const fila = boton.closest("tr");
        codigo = fila.children[0].textContent;
        nombre.value = fila.children[1].textContent;
        apellido.value = fila.children[2].textContent;
        Nickname.value = fila.children[3].textContent;
        nacimiento.value = fila.children[4].textContent;
        origen.value = fila.children[5].textContent;
        residencia.value = fila.children[6].textContent;
        foto.value = fila.children[7].textContent;
        qr.value = fila.children[8].textContent;
        estado.value = fila.children[9].textContent;
        opcion = "editar";
        modalCiudadano.show();
    }
    if (e.target.closest(".btnBorrar")) {
        const boton = e.target.closest(".btnBorrar");
        const fila = boton.closest("tr");
        nombre = fila.children[1].textContent;
        codigo = fila.children[0].textContent;
        Swal.fire({
            title: "Seguro de eliminar el registro: " + nombre + "?",
            text: "Si lo borras no se puede recuperar!",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        }).then((willDelete) => {
            fetch(url + "Eliminar/" + codigo, {
                method: "PUT",
            })
                .then((response) => response.json())
                .then((response) => {
                    Swal.fire("registro eliminado!");
                });

            location.reload();
        });
    }
});

frmCiudadano.addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    if (opcion == "crear") {
        const estado = document.getElementById("estado");

        
        
        fetch(url + "crear", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre.value,
            apellido: apellido.value,
            apodo_nickname: Nickname.value,
            fecha_nacimiento: nacimiento.value,
            planeta_origen: origen.value,
            planeta_residencia: residencia.value,
            foto: foto.value,
            codigo_qr: qrCodeDataURL,
            estado: estado.value,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            location.reload();
          });
        
    }
    if (opcion == "editar") {
        fetch(url + "actualizar/" + codigo, {
            method: "PUT",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    nombre: nombre.value,
                    apellido: apellido.value,
                    Nickname: Nickname.value,
                    fecha_nacimiento: nacimiento.value,
                    planeta_origen: origen.value,
                    planeta_residencia: residencia.value,
                    foto: foto.value,
                    
                    estado: estado.nodeValue
                }
            ),
        })
            .then((response) => response.json())
            .then((response) => {
                Swal.fire(response.status, "Editado con exito!").then((value) => {
                   location.reload();
                })
            })
    }
    modalCiudadano.hide()
});

