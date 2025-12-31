// ========================
// Modelo de Dados: Person
// ========================
/**
 * Interface que representa uma Pessoa no sistema
 * 
 * Esta é a entidade principal que:
 * - É armazenada no "banco de dados" (array em memória)
 * - É retornada pelas rotas da API
 * - Inclui o ID (gerado automaticamente)
 * 
 * Diferença entre Person e CreatePersonDTO:
 * - Person TEM id (gerado pelo backend)
 * - CreatePersonDTO NÃO TEM id (cliente não envia)
 * 
 * @example
 * const person: Person = {
 *   id: 1,
 *   name: "João Silva",
 *   email: "joao@example.com",
 *   age: 25
 * }
 */
export interface Person {
    id: number;         // ID único da pessoa (auto-incrementado)
    name: string;       // Nome completo
    email: string;      // Email válido
    age?: number;       // Idade (opcional)
}
