//codigo encargado de gestionar los datos con la base de datos de los pacientes
require('rootpath')();

const mysql = require("mysql");
const configuracion = require("config.json");

// agregue las credenciales para acceder a la base de datos
const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("BD conectada");
    }
});

var metodos = {}

// obtener a todos los pacientes ingresados
metodos.getAll = function (callback) {
    let consulta = "select * from paciente";
    connection.query(consulta, function (err, resultados) {
        if (err) {
            callback(err);
        } else {
            callback(undefined, {
                messaje: "Resultados de la consulta",
                detail: resultados,
            });
        }
    });
}

// obtener paciente por numero de historial clinico
metodos.getPaciente = function (nhc, callback) {
    let consulta = "select * from paciente where numero_historial_clinico = ?";
    connection.query(consulta, [nhc], function (err, resultados) {
        if (err) {
            callback(err);
        } else if (resultados.length == 0) {
            callback(undefined, "no encontramos un paciente con el numero de historial clinico: " + nhc);
        } else {
            callback(undefined, resultados);
        }
    });
}

// ingresar un nuevo paciente
metodos.crearPaciente = function (datosPaciente, callback) {
    let consulta = "insert into paciente (nss, nombre, apellido, domicilio, codigo_postal, telefono, numero_historial_clinico, observaciones) values (?, ?, ?, ?, ?, ?, ?, ?)";
    let paciente = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.numero_historial_clinico,
        datosPaciente.observaciones
    ];

    connection.query(consulta, paciente, (err, resultados) => {
        if (err) {
            callback(err);
        } else {
            callback(undefined, "paciente ingresado con exito");
        }
    });
}

// modificamos los datos de un paciente
metodos.update = function (datosPaciente, nhc, callback) {
    let consulta = "update paciente set nss = ?, nombre = ?, apellido = ?, domicilio = ?, codigo_postal = ?, telefono = ?, observaciones = ? where numero_historial_clinico = ?";
    let datos = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.observaciones,
        parseInt(nhc)
    ];

    connection.query(consulta, datos, (err, resultados) => {
        if (err) {
            callback(err);
        } else if (resultados.affectedRows == 0) {
            callback(undefined, "no encontramos un paciente con el numero de historial clinico: " + nhc);
        } else {
            callback(undefined, "paciente modificado exitosamente");
        }
    });
}

// eliminar un paciente ingresado
metodos.deletePaciente = function (nhc, callback) {
    let consulta = "delete from paciente where numero_historial_clinico = ?";
    connection.query(consulta, [nhc], function (err, resultados) {
        if (err) {
            callback(err);
        } else if (resultados.affectedRows == 0) {
            callback(undefined, "no encontramos un paciente con el numero de historial clinico: " + nhc);
        } else {
            callback(undefined, "paciente eliminado exitosamente");
        }
    });
}

// encontramos al paciente por ByNSS
metodos.getByNSS = function (nss, callback) {
    let consulta = "select * from paciente where nss = ?";
    connection.query(consulta, [nss], function (err, resultados) {
        if (err) {
            callback(err);
        } else if (resultados.length == 0) {
            callback(undefined, "no encontramos un paciente con el ByNSS: " + nss);
        } else {
            callback(undefined, resultados);
        }
    });
}

module.exports = { metodos }
