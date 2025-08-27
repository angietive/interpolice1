import {
  getAllUsuariosDB,
  getUsuarioByIdDB,
  createUsuarioDB,
  updateUsuarioDB,
  deleteUsuarioDB
} from "./usuarios.model.js";

export async function getAllUsuarios(req, res) {
  try {
    const resultado = await getAllUsuariosDB();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      estado: "error",
      mensaje: error.message + " => Error al obtener usuarios",
    });
  }
}

export async function getUsuarioById(req, res) {
  try {
    const resultado = await getUsuarioByIdDB(req.params.id_usuario);
    if (!resultado.data) {
      return res.status(404).json({
        estado: "error",
        mensaje: "No existe el usuario"
      });
    }
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      estado: "error",
      mensaje: error.message + " => Error al obtener usuario",
    });
  }
}

export async function createUsuario(req, res) {
  try {
    const resultado = await createUsuarioDB(req.body);
    
    // Verificar si el modelo devolvió un error
    if (resultado.estado === "error") {
      return res.status(400).json({
        estado: "error",
        mensaje: resultado.mensaje || "Error al crear usuario"
      });
    }
    
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error en createUsuario:', error);
    res.status(500).json({
      estado: "error",
      mensaje: error.message + " => Error al crear usuario",
    });
  }
}

export async function updateUsuario(req, res) {
  try {
    const resultado = await updateUsuarioDB(req.params.id_usuario, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      estado: "error",
      mensaje: error.message + " => Error al actualizar usuario",
    });
  }
}

export async function deleteUsuario(req, res) {
  try {
    const resultado = await deleteUsuarioDB(req.params.id_usuario);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      estado: "error",
      mensaje: error.message + " => Error al eliminar usuario",
    });
  }
}

