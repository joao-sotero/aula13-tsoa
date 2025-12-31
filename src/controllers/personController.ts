// ========================
// Importações do TSOA
// ========================
// Decorators do TSOA que permitem criar rotas e documentação automaticamente
import {
    Body,           // Decorator para receber dados do corpo da requisição
    Controller,     // Classe base para controllers
    Delete,         // Decorator para método HTTP DELETE
    Get,            // Decorator para método HTTP GET
    Middlewares,    // Decorator para adicionar middlewares customizados
    Path,           // Decorator para receber parâmetros da URL
    Post,           // Decorator para método HTTP POST
    Put,            // Decorator para método HTTP PUT
    Response,       // Decorator para documentar respostas de erro
    Route,          // Decorator para definir o caminho base das rotas
    SuccessResponse,// Decorator para documentar respostas de sucesso
    Tags            // Decorator para agrupar rotas no Swagger
} from 'tsoa';

// ========================
// Importações do Projeto
// ========================
import { Person } from '../types/person';
import { CreatePersonDTO, UpdatePersonDTO } from '../types/dtos';
import { validateWithJoi } from '../middleware/joiValidation';
import { createPersonSchema, updatePersonSchema, personIdSchema } from '../schemas/personSchemas';

// ========================
// Banco de Dados em Memória
// ========================
// ATENÇÃO: Em produção, use um banco de dados real (MongoDB, PostgreSQL, etc)
let people: Person[] = [];
let currentId = 1;

// ========================
// Controller de Pessoas
// ========================
/**
 * Controller para gerenciamento de pessoas
 * 
 * Este controller implementa um CRUD completo:
 * - GET /api/people - Lista todas as pessoas
 * - GET /api/people/:id - Busca pessoa por ID
 * - POST /api/people - Cria nova pessoa
 * - PUT /api/people/:id - Atualiza pessoa existente
 * - DELETE /api/people/:id - Remove pessoa
 * 
 * As rotas são geradas automaticamente pelo TSOA baseado nos decorators
 */
@Route('api/people')    // Define que todas as rotas começam com /api/people
@Tags('People')         // Agrupa estas rotas sob "People" no Swagger
export class PersonController extends Controller {
    
    /**
     * Lista todas as pessoas cadastradas
     * 
     * Endpoint: GET /api/people
     * 
     * @returns Array com todas as pessoas
     */
    @Get()  // Define que este método responde a requisições GET
    @SuccessResponse('200', 'Lista de pessoas retornada com sucesso')
    public async listPeople(): Promise<Person[]> {
        return people;
    }

    /**
     * Busca uma pessoa específica pelo ID
     * 
     * Endpoint: GET /api/people/:id
     * 
     * @param id - ID da pessoa (recebido via URL)
     * @returns Pessoa encontrada ou erro 404
     */
    @Get('{id}')    // {id} indica um parâmetro dinâmico na URL
    @Middlewares(validateWithJoi(personIdSchema, 'params'))  // Valida o ID antes de executar
    @SuccessResponse('200', 'Pessoa encontrada')
    @Response<{ message: string }>('404', 'Pessoa não encontrada')
    public async getPerson(@Path() id: number): Promise<Person> {
        // Busca pessoa no array
        const person = people.find(item => item.id === id);
        
        // Se não encontrar, retorna erro 404
        if (!person) {
            this.setStatus(404);  // Define status HTTP 404
            throw new Error(`Person ${id} not found.`);
        }

        return person;
    }

    /**
     * Cria uma nova pessoa
     * 
     * Endpoint: POST /api/people
     * Body: { name, email, age? }
     * 
     * @param requestBody - Dados da pessoa a ser criada (recebidos no corpo da requisição)
     * @returns Pessoa criada com ID gerado
     */
    @Post()     // Define que este método responde a requisições POST
    @Middlewares(validateWithJoi(createPersonSchema, 'body'))  // Valida dados antes de criar
    @SuccessResponse('201', 'Pessoa criada com sucesso')
    public async createPerson(@Body() requestBody: CreatePersonDTO): Promise<Person> {
        // Cria nova pessoa com ID auto-incrementado
        const newPerson: Person = {
            id: currentId,
            name: requestBody.name,
            email: requestBody.email,
            age: requestBody.age
        };

        currentId += 1;  // Incrementa ID para próxima pessoa
        people = [...people, newPerson];  // Adiciona ao array
        
        this.setStatus(201);  // Status 201 = Created
        return newPerson;
    }

    /**
     * Atualiza dados de uma pessoa existente
     * 
     * Endpoint: PUT /api/people/:id
     * Body: { name?, email?, age? } - Todos os campos são opcionais
     * 
     * @param id - ID da pessoa a ser atualizada
     * @param requestBody - Dados a serem atualizados (parciais)
     * @returns Pessoa atualizada
     */
    @Put('{id}')    // Define que este método responde a requisições PUT
    @Middlewares(
        validateWithJoi(personIdSchema, 'params'),      // Valida o ID
        validateWithJoi(updatePersonSchema, 'body')     // Valida os dados
    )
    @SuccessResponse('200', 'Pessoa atualizada com sucesso')
    @Response<{ message: string }>('404', 'Pessoa não encontrada')
    public async updatePerson(
        @Path() id: number,
        @Body() requestBody: UpdatePersonDTO
    ): Promise<Person> {
        // Busca índice da pessoa no array
        const personIndex = people.findIndex(item => item.id === id);

        // Se não encontrar, retorna erro 404
        if (personIndex === -1) {
            this.setStatus(404);
            throw new Error(`Person ${id} not found.`);
        }

        // Mescla dados existentes com novos dados (spread operator)
        const updatedPerson = { ...people[personIndex], ...requestBody };
        people[personIndex] = updatedPerson;

        return updatedPerson;
    }

    /**
     * Remove uma pessoa do cadastro
     * 
     * Endpoint: DELETE /api/people/:id
     * 
     * @param id - ID da pessoa a ser removida
     * @returns void (sem conteúdo, apenas status 204)
     */
    @Delete('{id}')     // Define que este método responde a requisições DELETE
    @Middlewares(validateWithJoi(personIdSchema, 'params'))
    @SuccessResponse('204', 'Pessoa removida com sucesso')
    @Response<{ message: string }>('404', 'Pessoa não encontrada')
    public async deletePerson(@Path() id: number): Promise<void> {
        // Verifica se a pessoa existe
        const exists = people.some(item => item.id === id);

        if (!exists) {
            this.setStatus(404);
            throw new Error(`Person ${id} not found.`);
        }

        // Remove pessoa do array
        people = people.filter(item => item.id !== id);
        this.setStatus(204);  // Status 204 = No Content (sucesso sem retorno)
    }
}
