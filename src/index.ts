// src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { MessageAnalyzer } from './services/messageAnalyzer';
import categoryRoutes from './routes/categoryRoutes';
import templateRoutes from './routes/templateRoutes';

// Inicialização da aplicação
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Rotas da API
app.use('/api/categories', categoryRoutes);
app.use('/api/templates', templateRoutes);

// Rota para análise de mensagem
app.post('/api/analyze', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Mensagem inválida',
                details: 'É necessário fornecer uma mensagem válida para análise'
            });
        }

        const analyzer = new MessageAnalyzer();
        const analysis = await analyzer.analyzeMessage(message);
        
        res.json({
            original: message,
            analysis
        });
    } catch (error) {
        next(error);
    }
});

// Rota para análise em lote
app.post('/api/analyze/batch', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { messages } = req.body;
        
        if (!Array.isArray(messages)) {
            return res.status(400).json({ 
                error: 'Formato inválido',
                details: 'É necessário fornecer um array de mensagens'
            });
        }

        const analyzer = new MessageAnalyzer();
        const analyses = await analyzer.analyzeBatch(messages);
        
        res.json({
            results: messages.map((msg, index) => ({
                original: msg,
                analysis: analyses[index]
            }))
        });
    } catch (error) {
        next(error);
    }
});

// Rota para a página de gerenciamento
app.get('/manager', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public/manager.html'));
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
});

// Middleware para rotas não encontradas
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        details: `A rota ${req.method} ${req.path} não existe`
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Interface de gerenciamento em http://localhost:${PORT}/manager`);
});

export default app;