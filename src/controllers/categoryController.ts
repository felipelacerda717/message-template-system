import { Request, Response, NextFunction } from 'express';
import storageService from '../services/storageService';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../models/types';


class CategoryController {
    // Remova static e torne os métodos regulares da classe
    public async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await storageService.getCategories();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    public async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const category = await storageService.getCategory(id);
            
            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }
            
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    public async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, keywords, weight } = req.body as CreateCategoryDTO;
    
            // Validação dos dados
            if (!name?.trim()) {
                return res.status(400).json({
                    error: 'Nome inválido',
                    details: 'O nome da categoria é obrigatório'
                });
            }
    
            if (!Array.isArray(keywords) || keywords.length === 0) {
                return res.status(400).json({
                    error: 'Keywords inválidas',
                    details: 'É necessário fornecer ao menos uma palavra-chave'
                });
            }
    
            const newCategory = await storageService.createCategory({
                name: name.trim(),
                keywords: keywords,
                weight: Number(weight)
            });
    
            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    }

    public async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body as UpdateCategoryDTO;
            
            const updatedCategory = await storageService.updateCategory(id, updateData);
    
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }
    
            res.json(updatedCategory);
        } catch (error) {
            next(error);
        }
    }

    public async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await storageService.deleteCategory(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json({ message: 'Categoria deletada com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;