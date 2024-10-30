// src/controllers/templateController.ts

import { Request, Response, NextFunction } from 'express';
import { CreateTemplateDTO, UpdateTemplateDTO } from '../models/types';
import storageService from '../services/storageService';

class TemplateController {
    /**
     * GET /api/templates
     * Retorna todos os templates ou filtrados por categoria
     */
    public async getAllTemplates(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.query;
            
            if (categoryId && typeof categoryId === 'string') {
                // Verificar se a categoria existe
                const category = await storageService.getCategory(categoryId);
                if (!category) {
                    return res.status(404).json({
                        error: 'Categoria não encontrada',
                        details: `Não existe uma categoria com o ID: ${categoryId}`
                    });
                }

                const templates = await storageService.getTemplatesByCategory(categoryId);
                return res.json(templates);
            }

            const templates = await storageService.getTemplates();
            res.json(templates);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/templates/:id
     * Retorna um template específico por ID
     */
    public async getTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const template = await storageService.getTemplate(id);
            
            if (!template) {
                return res.status(404).json({ 
                    error: 'Template não encontrado',
                    details: `Não foi possível encontrar um template com o ID: ${id}`
                });
            }
            
            res.json(template);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/templates
     * Cria um novo template
     */
    public async createTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId, text } = req.body as CreateTemplateDTO;

            // Validação dos dados
            if (!categoryId?.trim()) {
                return res.status(400).json({
                    error: 'ID da categoria inválido',
                    details: 'É necessário especificar uma categoria'
                });
            }

            // Verificar se a categoria existe
            const category = await storageService.getCategory(categoryId);
            if (!category) {
                return res.status(400).json({
                    error: 'Categoria não encontrada',
                    details: `Não existe uma categoria com o ID: ${categoryId}`
                });
            }

            if (!text?.trim()) {
                return res.status(400).json({
                    error: 'Texto inválido',
                    details: 'O texto do template não pode estar vazio'
                });
            }

            const newTemplate = await storageService.createTemplate({
                categoryId: categoryId.trim(),
                text: text.trim()
            });

            res.status(201).json(newTemplate);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/templates/:id
     * Atualiza um template existente
     */
    public async updateTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body as UpdateTemplateDTO;
            
            // Validação dos dados de atualização
            if (updateData.categoryId !== undefined) {
                if (!updateData.categoryId.trim()) {
                    return res.status(400).json({
                        error: 'ID da categoria inválido',
                        details: 'É necessário especificar uma categoria'
                    });
                }

                // Verificar se a nova categoria existe
                const category = await storageService.getCategory(updateData.categoryId);
                if (!category) {
                    return res.status(400).json({
                        error: 'Categoria não encontrada',
                        details: `Não existe uma categoria com o ID: ${updateData.categoryId}`
                    });
                }

                updateData.categoryId = updateData.categoryId.trim();
            }

            if (updateData.text !== undefined) {
                if (!updateData.text.trim()) {
                    return res.status(400).json({
                        error: 'Texto inválido',
                        details: 'O texto do template não pode estar vazio'
                    });
                }
                updateData.text = updateData.text.trim();
            }

            const updatedTemplate = await storageService.updateTemplate(id, updateData);

            if (!updatedTemplate) {
                return res.status(404).json({ 
                    error: 'Template não encontrado',
                    details: `Não foi possível encontrar um template com o ID: ${id}`
                });
            }

            res.json(updatedTemplate);
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/templates/:id
     * Remove um template
     */
    public async deleteTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await storageService.deleteTemplate(id);

            if (!deleted) {
                return res.status(404).json({ 
                    error: 'Template não encontrado',
                    details: `Não foi possível encontrar um template com o ID: ${id}`
                });
            }

            res.json({ 
                message: 'Template deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/templates/category/:categoryId
     * Retorna todos os templates de uma categoria específica
     */
    public async getTemplatesByCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.params;

            // Verificar se a categoria existe
            const category = await storageService.getCategory(categoryId);
            if (!category) {
                return res.status(404).json({
                    error: 'Categoria não encontrada',
                    details: `Não existe uma categoria com o ID: ${categoryId}`
                });
            }

            const templates = await storageService.getTemplatesByCategory(categoryId);
            res.json(templates);
        } catch (error) {
            next(error);
        }
    }
}

export default new TemplateController();