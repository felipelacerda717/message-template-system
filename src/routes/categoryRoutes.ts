import express from 'express';
import CategoryController from '../controllers/categoryController';

const router = express.Router();
const categoryController = new CategoryController();

// Rotas básicas CRUD
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', categoryController.getCategory.bind(categoryController));
router.post('/', categoryController.createCategory.bind(categoryController));
router.put('/:id', categoryController.updateCategory.bind(categoryController));
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export default router;