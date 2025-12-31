import Joi from 'joi';

// ========================
// Schema para Criação de Pessoa
// ========================
/**
 * Define regras de validação para criar uma nova pessoa
 * 
 * Regras:
 * - name: obrigatório, string entre 3 e 120 caracteres (sem espaços nas pontas)
 * - email: obrigatório, deve ser um email válido
 * - age: opcional, número inteiro entre 0 e 130
 */
export const createPersonSchema = Joi.object({
    name: Joi.string()
        .trim()                 // Remove espaços no início e fim
        .min(3)                 // Mínimo 3 caracteres
        .max(120)               // Máximo 120 caracteres
        .required(),            // Campo obrigatório
    
    email: Joi.string()
        .trim()                 // Remove espaços
        .email()                // Valida formato de email
        .required(),            // Campo obrigatório
    
    age: Joi.number()
        .integer()              // Deve ser número inteiro
        .min(0)                 // Idade mínima: 0
        .max(130)               // Idade máxima: 130
        .optional()             // Campo opcional
});

// ========================
// Schema para Atualização de Pessoa
// ========================
/**
 * Define regras de validação para atualizar uma pessoa
 * 
 * Diferenças em relação ao createPersonSchema:
 * - Todos os campos são opcionais (nenhum é obrigatório)
 * - MAS pelo menos 1 campo deve ser fornecido (.min(1))
 * - Isso permite atualização parcial (PATCH-like)
 */
export const updatePersonSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(120),              // Sem .required() - campo opcional
    
    email: Joi.string()
        .trim()
        .email(),               // Sem .required() - campo opcional
    
    age: Joi.number()
        .integer()
        .min(0)
        .max(130)               // Já é opcional por padrão
}).min(1);  // Garante que pelo menos 1 campo seja enviado

// ========================
// Schema para Validação de ID
// ========================
/**
 * Valida o parâmetro ID recebido na URL
 * 
 * Usado nas rotas:
 * - GET /api/people/:id
 * - PUT /api/people/:id
 * - DELETE /api/people/:id
 * 
 * Regras:
 * - Deve ser um número inteiro positivo
 * - Campo obrigatório
 */
export const personIdSchema = Joi.object({
    id: Joi.number()
        .integer()              // Deve ser inteiro
        .positive()             // Deve ser > 0
        .required()             // Campo obrigatório
});
