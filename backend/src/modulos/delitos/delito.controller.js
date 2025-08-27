import {
  getDelitosDB,
  getDelitoByIdDB,
  createDelitoDB,
  updateDelitoDB,
  deleteDelitoDB
} from './delito.model.js';

export async function getAllDelitos(req, res) {
  try {
    const resultado = await getDelitosDB();
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getDelitoById(req, res) {
  try {
    const resultado = await getDelitoByIdDB(req.params.id);
    if (!resultado.data) return res.status(404).json({ message: 'No encontrado' });
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createDelito(req, res) {
  try {
    const resultado = await createDelitoDB(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateDelito(req, res) {
  try {
    const resultado = await updateDelitoDB(req.params.id, req.body);
    res.json({ message: 'Actualizado correctamente', ...resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteDelito(req, res) {
  try {
    const resultado = await deleteDelitoDB(req.params.id);
    res.json({ message: 'Eliminado correctamente', ...resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
