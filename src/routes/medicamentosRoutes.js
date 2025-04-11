const express = require('express');
const router = express.Router();
const { Medicamento } = require('../models/medicamentos'); 

// Crear medicamento
router.post('/', async (req, res) => {
  try {
    const nuevo = new Medicamento(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos
router.get('/', async (req, res) => {
  const lista = await Medicamento.find();
  res.json(lista);
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  const med = await Medicamento.findById(req.params.id);
  med ? res.json(med) : res.status(404).send("No encontrado");
});

// Actualizar
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Medicamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  await Medicamento.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;