// src/controllers/categoryController.ts

import { Request, Response, NextFunction } from 'express';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../models/types';
import storageService from '../services/storageService';

class CategoryController {
    /**
     * GET /api/categories
     * Retorna todas as categorias
     */
    public async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await storageService.getCategories();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/categories/:id
     * Retorna uma categoria específica por ID
     */
    public async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const category = await storageService.getCategory(id);
            
            if (!category) {
                return res.status(404).json({ 
                    error: 'Categoria não encontrada',
                    details: `Não foi possível encontrar uma categoria com o ID: ${id}`
                });
            }
            
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/categories
     * Cria uma nova categoria
     */
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

            // Processar keywords
            const processedKeywords = keywords
                .map(k => k.trim())
                .filter(k => k.length > 0);

            if (processedKeywords.length === 0) {
                return res.status(400).json({
                    error: 'Keywords inválidas',
                    details: 'Nenhuma palavra-chave válida fornecida'
                });
            }

            // Validar peso
            const weightNum = Number(weight);
            if (isNaN(weightNum) || weightNum < 0.5 || weightNum > 5) {
                return res.status(400).json({
                    error: 'Peso inválido',
                    details: 'O peso deve ser um número entre 0.5 e 5'
                });
            }

            const newCategory = await storageService.createCategory({
                name: name.trim(),
                keywords: processedKeywords,
                weight: weightNum
            });

            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/categories/:id
     * Atualiza uma categoria existente
     */
    public async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body as UpdateCategoryDTO;
            
            // Validações dos dados de atualização
            if (updateData.name !== undefined) {
                if (!updateData.name.trim()) {
                    return res.status(400).json({
                        error: 'Nome inválido',
                        details: 'O nome da categoria não pode estar vazio'
                    });
                }
                updateData.name = updateData.name.trim();
            }

            if (updateData.keywords !== undefined) {
                if (!Array.isArray(updateData.keywords) || updateData.keywords.length === 0) {
                    return res.status(400).json({
                        error: 'Keywords inválidas',
                        details: 'É necessário fornecer ao menos uma palavra-chave'
                    });
                }

                const processedKeywords = updateData.keywords
                    .map(k => k.trim())
                    .filter(k => k.length > 0);

                if (processedKeywords.length === 0) {
                    return res.status(400).json({
                        error: 'Keywords inválidas',
                        details: 'Nenhuma palavra-chave válida fornecida'
                    });
                }

                updateData.keywords = processedKeywords;
            }

            if (updateData.weight !== undefined) {
                const weightNum = Number(updateData.weight);
                if (isNaN(weightNum) || weightNum < 0.5 || weightNum > 5) {
                    return res.status(400).json({
                        error: 'Peso inválido',
                        details: 'O peso deve ser um número entre 0.5 e 5'
                    });
                }
                updateData.weight = weightNum;
            }

            const updatedCategory = await storageService.updateCategory(id, updateData);

            if (!updatedCategory) {
                return res.status(404).json({ 
                    error: 'Categoria não encontrada',
                    details: `Não foi possível encontrar uma categoria com o ID: ${id}`
                });
            }

            res.json(updatedCategory);
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/categories/:id
     * Remove uma categoria e seus templates associados
     */
    public async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await storageService.deleteCategory(id);

            if (!deleted) {
                return res.status(404).json({ 
                    error: 'Categoria não encontrada',
                    details: `Não foi possível encontrar uma categoria com o ID: ${id}`
                });
            }

            res.json({ 
                message: 'Categoria deletada com sucesso',
                details: 'A categoria e todos os templates associados foram removidos'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();