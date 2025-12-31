// ========================
// Data Transfer Objects (DTOs)
// ========================
/**
 * DTOs são interfaces que definem a estrutura dos dados
 * que trafegam entre cliente e servidor.
 * 
 * Benefícios:
 * - Separa modelo de dados interno (Person) da API pública
 * - Permite validação com JSDoc tags (usadas pelo TSOA)
 * - Facilita evolução da API sem quebrar código interno
 */

/**
 * DTO para criação de pessoa
 * 
 * Usado na requisição POST /api/people
 * 
 * IMPORTANTE: As tags @minLength, @maxLength, etc. são usadas pelo TSOA
 * para gerar validação automática no Swagger e nas rotas.
 * 
 * Exemplo de requisição válida:
 * {
 *   "name": "João Silva",
 *   "email": "joao@example.com",
 *   "age": 25
 * }
 */
export interface CreatePersonDTO {
    /** 
     * Nome completo da pessoa
     * @minLength 3      - Mínimo 3 caracteres
     * @maxLength 120    - Máximo 120 caracteres
     */
    name: string;
    
    /** 
     * Email da pessoa (deve ser válido)
     * @format email    - Valida formato: exemplo@dominio.com
     */
    email: string;
    
    /** 
     * Idade da pessoa (campo opcional)
     * @minimum 0       - Idade mínima: 0 anos
     * @maximum 130     - Idade máxima: 130 anos
     * @isInt          - Deve ser número inteiro
     */
    age?: number;  // ? indica que é opcional
}

/**
 * DTO para atualização de pessoa
 * 
 * Usado na requisição PUT /api/people/:id
 * 
 * Diferenças do CreatePersonDTO:
 * - TODOS os campos são opcionais (?)
 * - Permite atualização parcial (apenas name, ou apenas email, etc)
 * - Pelo menos 1 campo deve ser enviado (validado por Joi)
 * 
 * Exemplo de requisição válida:
 * {
 *   "name": "João Pedro Silva"
 * }
 */
export interface UpdatePersonDTO {
    /** 
     * Nome da pessoa (opcional na atualização)
     * @minLength 3
     * @maxLength 120
     */
    name?: string;
    
    /** 
     * Email da pessoa (opcional na atualização)
     * @format email
     */
    email?: string;
    
    /** 
     * Idade da pessoa (opcional na atualização)
     * @minimum 0
     * @maximum 130
     * @isInt
     */
    age?: number;
}

/**
 * Interface para respostas de erro
 * 
 * Usada quando ocorre algum erro na requisição.
 * Garante que todos os erros tenham formato consistente.
 * 
 * Exemplo de resposta de erro:
 * {
 *   "message": "Validation failed",
 *   "details": ["name must be at least 3 characters", "email is invalid"]
 * }
 */
export interface ErrorResponse {
    message: string;        // Mensagem principal do erro
    details?: string[];     // Lista opcional de detalhes do erro
}
