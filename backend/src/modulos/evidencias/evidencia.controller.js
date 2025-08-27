import {
    getEvidenciasDB,
    getEvidenciaByIdDB,
    getEvidenciasByDelitoDB,
    createEvidenciaDB,
    updateEvidenciaDB,
    deleteEvidenciaDB
} from "./evidencia.model.js";

export async function getAllEvidencias(req, res) {
    try {
        const resultado = await getEvidenciasDB();
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al obtener evidencias:", error);
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al obtener evidencias",
        });
    }
}

export async function getEvidenciaById(req, res) {
    try {
        const resultado = await getEvidenciaByIdDB(req.params.id_evidencia);
        if (!resultado.data) {
            return res.status(404).json({
                estado: "error",
                mensaje: "No existe la evidencia"
            });
        }
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.message + " => Error al obtener evidencia",
        });
    }
}

export async function getEvidenciasByDelito(req, res) {
    try {
        const resultado = await getEvidenciasByDelitoDB(req.params.id_delito);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.message + " => Error al obtener evidencias del delito",
        });
    }
}

export async function createEvidencia(req, res) {
    try {
        const resultado = await createEvidenciaDB(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al crear evidencia",
        });
    }
}

export async function updateEvidencia(req, res) {
    try {
        const resultado = await updateEvidenciaDB(req.params.id_evidencia, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al actualizar evidencia",
        });
    }
}

export async function deleteEvidencia(req, res) {
    try {
        const resultado = await deleteEvidenciaDB(req.params.id_evidencia);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al eliminar evidencia",
        });
    }
}