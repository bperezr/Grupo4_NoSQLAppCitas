// 1.Mover la propiedad 'especialidad' de Usuarios a Doctores
// Eliminar la propiedad 'especialidad' de Usuarios
db.runCommand({
    collMod: "Usuarios",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["email", "contraseña", "rol", "estado"],
            properties: {
                email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
                contraseña: { bsonType: "string", minLength: 8 },
                rol: { bsonType: "string", enum: ["paciente", "doctor", "admin"] },
                estado: { bsonType: "string", enum: ["activo", "inactivo"] }
            }
        }
    }
});

// Agregar un índice en estado
//db.Usuarios.createIndex({ estado: 1 });

// 2. Mejorar la colección Doctores
// Agregar índice compuesto en especialidad y sucursalId
db.Doctores.createIndex({ especialidad: 1, sucursalId: 1 });

// 3. Mejorar la colección HorariosDisponibles
// Modificar la estructura para almacenar fecha y horas en formato ISO
db.runCommand({
    collMod: "HorariosDisponibles",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["doctorId", "fecha", "horaInicio", "horaFin", "disponible"],
            properties: {
                doctorId: { bsonType: "objectId" },
                fecha: { bsonType: "date" },
                horaInicio: { bsonType: "date" },
                horaFin: { bsonType: "date" },
                disponible: { bsonType: "bool" },
                citaId: { bsonType: "objectId" }
            }
        }
    }
});

// 4. Mejorar la colección Citas
// Agregar sucursalId
db.runCommand({
    collMod: "Citas",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["pacienteId", "doctorId", "fechaHora", "estado"],
            properties: {
                pacienteId: { bsonType: "objectId" },
                doctorId: { bsonType: "objectId" },
                fechaHora: { bsonType: "date" },
                estado: { bsonType: "string", enum: ["pendiente", "confirmada", "cancelada"] },
                motivo: { bsonType: "string" },
                notas: { bsonType: "string" },
                sucursalId: { bsonType: "objectId" }
            }
        }
    }
});

// Agregar índice en doctorId y fechaHora
db.Citas.createIndex({ doctorId: 1, fechaHora: 1 });
