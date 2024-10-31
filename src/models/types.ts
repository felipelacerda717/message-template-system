// src/models/types.ts

// Base interfaces for Category and Template
export interface Category {
    id: string;
    name: string;
    keywords: string[];
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Template {
    id: string;
    categoryId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

// DTOs for creating new items
export interface CreateCategoryDTO {
    name: string;
    keywords: string[];
    weight: number;
}

export interface CreateTemplateDTO {
    categoryId: string;
    text: string;
}

// DTOs for updating existing items
export interface UpdateCategoryDTO {
    name?: string;
    keywords?: string[];
    weight?: number;
}

export interface UpdateTemplateDTO {
    categoryId?: string;
    text?: string;
}