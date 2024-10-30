// src/routes/categoryRoutes.ts

import express from 'express';
import categoryController from '../controllers/categoryController';

const router = express.Router();

// Rotas básicas CRUD
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;