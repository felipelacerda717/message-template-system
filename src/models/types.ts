// src/models/types.ts

// Interface para Categoria
export interface Category {
    id: string;
    name: string;
    keywords: string[];
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}

// Interface para Template
export interface Template {
    id: string;
    categoryId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interface para Resultado de Análise
export interface AnalysisResult {
    categories: {
        [key: string]: number;  // Nome da categoria -> pontuação
    };
    dominantCategory: string;   // Categoria com maior pontuação
    suggestedTemplates: string[]; // Templates sugeridos baseados na análise
    confidence: number;         // Nível de confiança da análise
}

// Interface para dados de criação de categoria
export interface CreateCategoryDTO {
    name: string;
    keywords: string[];
    weight: number;
}

// Interface para dados de criação de template
export interface CreateTemplateDTO {
    categoryId: string;
    text: string;
}

// Interface para dados de atualização de categoria
export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

// Interface para dados de atualização de template
export interface UpdateTemplateDTO extends Partial<CreateTemplateDTO> {}

// Interface para mensagem a ser analisada
export interface AnalyzeMessageDTO {
    message: string;
}