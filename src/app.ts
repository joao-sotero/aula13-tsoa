// ⚠️ IMPORTANTE: reflect-metadata DEVE ser a primeira importação
// Isso é necessário para que os decorators do TSOA funcionem corretamente
import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';  // Logger de requisições HTTP
import swaggerUi from 'swagger-ui-express';  // Interface visual para documentação Swagger
import { RegisterRoutes } from './routes/routes';  // Rotas geradas automaticamente pelo TSOA

// Cria a aplicação Express
const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware de log - registra todas as requisições no console
app.use(morgan('dev'));

// ========================
// Documentação Swagger UI
// ========================
// Acesse http://localhost:3333/api-docs para ver a documentação interativa
// O arquivo swagger.json é gerado automaticamente pelo comando: npm run tsoa:spec
app.use('/api-docs', swaggerUi.serve, async (req: Request, res: Response, next: NextFunction) => {
    const swaggerDocument = await import('./swagger/swagger.json');
    return swaggerUi.setup(swaggerDocument)(req, res, next);
});

// ========================
// Registro de Rotas
// ========================
// RegisterRoutes é gerado automaticamente pelo comando: npm run tsoa:routes
// Ele lê todos os controllers e cria as rotas do Express baseado nos decorators
RegisterRoutes(app);

// ========================
// Handler de Rota Não Encontrada (404)
// ========================
// Este middleware é executado quando nenhuma rota corresponde à requisição
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found.' });
});

// ========================
// Handler Global de Erros
// ========================
// Este middleware captura todos os erros lançados nos controllers ou middlewares
// IMPORTANTE: Deve ser o último middleware registrado
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    // Se a resposta já foi enviada, passa o erro adiante
    if (res.headersSent) {
        next(error);
        return;
    }

    // Retorna erro 500 com mensagem
    res.status(500).json({
        message: 'Unexpected error. Please try again.',
        detail: error.message
    });
});

// Exporta a aplicação para ser usada no server.ts
export default app;
