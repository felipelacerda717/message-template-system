// src/services/storageService.ts

import { Category, Template, CreateCategoryDTO, CreateTemplateDTO, UpdateCategoryDTO, UpdateTemplateDTO } from '../models/types';
import fs from 'fs';
import path from 'path';

class StorageService {
    private static instance: StorageService;
    private categories: Category[] = [];
    private templates: Template[] = [];
    private readonly dataDir = path.join(__dirname, '../../data');
    private readonly categoriesFile = path.join(this.dataDir, 'categories.json');
    private readonly templatesFile = path.join(this.dataDir, 'templates.json');

    private constructor() {
        this.initializeStorage();
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    private initializeStorage() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }

        try {
            if (fs.existsSync(this.categoriesFile)) {
                const data = fs.readFileSync(this.categoriesFile, 'utf8');
                this.categories = JSON.parse(data);
            }

            if (fs.existsSync(this.templatesFile)) {
                const data = fs.readFileSync(this.templatesFile, 'utf8');
                this.templates = JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            // Inicializar com arrays vazios em caso de erro
            this.categories = [];
            this.templates = [];
        }
    }

    private saveCategories(): void {
        fs.writeFileSync(this.categoriesFile, JSON.stringify(this.categories, null, 2));
    }

    private saveTemplates(): void {
        fs.writeFileSync(this.templatesFile, JSON.stringify(this.templates, null, 2));
    }

    // Métodos para Categorias
    async getCategories(): Promise<Category[]> {
        return this.categories;
    }

    async getCategory(id: string): Promise<Category | null> {
        return this.categories.find(c => c.id === id) || null;
    }

    async createCategory(data: CreateCategoryDTO): Promise<Category> {
        const newCategory: Category = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.categories.push(newCategory);
        this.saveCategories();
        return newCategory;
    }

    async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category | null> {
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) return null;

        const updatedCategory = {
            ...this.categories[index],
            ...data,
            updatedAt: new Date()
        };

        this.categories[index] = updatedCategory;
        this.saveCategories();
        return updatedCategory;
    }

    async deleteCategory(id: string): Promise<boolean> {
        const initialLength = this.categories.length;
        this.categories = this.categories.filter(c => c.id !== id);
        
        if (this.categories.length < initialLength) {
            // Excluir templates associados à categoria
            this.templates = this.templates.filter(t => t.categoryId !== id);
            this.saveCategories();
            this.saveTemplates();
            return true;
        }
        return false;
    }

    // Métodos para Templates
    async getTemplates(): Promise<Template[]> {
        return this.templates;
    }

    async getTemplate(id: string): Promise<Template | null> {
        return this.templates.find(t => t.id === id) || null;
    }

    async getTemplatesByCategory(categoryId: string): Promise<Template[]> {
        return this.templates.filter(t => t.categoryId === categoryId);
    }

    async createTemplate(data: CreateTemplateDTO): Promise<Template> {
        // Verificar se a categoria existe
        const categoryExists = this.categories.some(c => c.id === data.categoryId);
        if (!categoryExists) {
            throw new Error('Categoria não encontrada');
        }

        const newTemplate: Template = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.templates.push(newTemplate);
        this.saveTemplates();
        return newTemplate;
    }

    async updateTemplate(id: string, data: UpdateTemplateDTO): Promise<Template | null> {
        const index = this.templates.findIndex(t => t.id === id);
        if (index === -1) return null;

        // Se estiver atualizando a categoria, verificar se a nova categoria existe
        if (data.categoryId) {
            const categoryExists = this.categories.some(c => c.id === data.categoryId);
            if (!categoryExists) {
                throw new Error('Categoria não encontrada');
            }
        }

        const updatedTemplate = {
            ...this.templates[index],
            ...data,
            updatedAt: new Date()
        };

        this.templates[index] = updatedTemplate;
        this.saveTemplates();
        return updatedTemplate;
    }

    async deleteTemplate(id: string): Promise<boolean> {
        const initialLength = this.templates.length;
        this.templates = this.templates.filter(t => t.id !== id);
        
        if (this.templates.length < initialLength) {
            this.saveTemplates();
            return true;
        }
        return false;
    }

    // Método para resetar o armazenamento (útil para testes)
    async resetStorage(): Promise<void> {
        this.categories = [];
        this.templates = [];
        this.saveCategories();
        this.saveTemplates();
    }
}

export default StorageService.getInstance();