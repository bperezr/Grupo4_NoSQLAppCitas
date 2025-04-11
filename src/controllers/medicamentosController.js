const { Medicamento } = require('../models/medicamentos');

exports.crearMedicamento = async (req, res) => {
  try {
    const nuevo = new Medicamento(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerMedicamentos = async (req, res) => {
  const lista = await Medicamento.find();
  res.json(lista);
};

exports.obtenerMedicamentoPorId = async (req, res) => {
  const med = await Medicamento.findById(req.params.id);
  med ? res.json(med) : res.status(404).send("No encontrado");
};

exports.actualizarMedicamento = async (req, res) => {
  try {
    const actualizado = await Medicamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarMedicamento = async (req, res) => {
  await Medicamento.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};