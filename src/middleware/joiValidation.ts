import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

// Define quais partes da requisição podem ser validadas
type RequestSegment = 'body' | 'params' | 'query';

/**
 * Middleware para validação com Joi
 * 
 * Usado em conjunto com a validação do TSOA para regras mais complexas.
 * O TSOA valida tipos, mas o Joi permite validações customizadas como:
 * - Transformações (trim, lowercase)
 * - Validações complexas (regex, custom)
 * - Validações condicionais
 * 
 * @param schema - Schema Joi que define as regras de validação
 * @param segment - Parte da requisição a validar: 'body', 'params' ou 'query'
 * @returns Middleware Express que valida os dados
 * 
 * @example
 * // Validar corpo da requisição
 * @Middlewares(validateWithJoi(createPersonSchema, 'body'))
 * 
 * @example
 * // Validar parâmetros da URL
 * @Middlewares(validateWithJoi(personIdSchema, 'params'))
 */
export const validateWithJoi = (schema: ObjectSchema, segment: RequestSegment = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Obtém os dados do segmento especificado da requisição
        const requestData = (req as Record<RequestSegment, unknown>)[segment];
        
        // Valida os dados usando o schema Joi
        const { error, value } = schema.validate(requestData, {
            abortEarly: false,      // Retorna TODOS os erros, não apenas o primeiro
            stripUnknown: true      // Remove campos que não estão no schema
        });

        // Se houver erros de validação
        if (error) {
            // Formata os erros em um formato mais legível
            const details = error.details.map(detail => ({
                field: detail.path.join('.'),  // Nome do campo com erro
                message: detail.message         // Mensagem do erro
            }));
            
            // Retorna resposta 400 Bad Request com detalhes dos erros
            res.status(400).json({
                message: 'Validation failed (Joi)',
                errors: details
            });
            return;
        }

        // Se validação passou, substitui os dados originais pelos dados validados e sanitizados
        // Isso garante que apenas dados válidos sejam processados pelo controller
        (req as Record<RequestSegment, unknown>)[segment] = value;
        
        // Passa para o próximo middleware/controller
        next();
    };
};
