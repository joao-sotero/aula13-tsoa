# 📘 Guia Completo: TSOA - TypeScript para Express APIs

> **Para iniciantes**: Este guia foi criado para ajudá-lo a entender e usar o TSOA passo a passo, mesmo sem conhecimento prévio da biblioteca.

## � Documentação

- **[QUICKSTART.md](QUICKSTART.md)** - Comece aqui! Guia rápido de 3 passos
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Visão geral da estrutura do projeto
- **[tsconfig.guide.md](tsconfig.guide.md)** - Guia completo do tsconfig.json
- **[tsoa.config.md](tsoa.config.md)** - Guia completo do tsoa.json
- **[TIPS.md](TIPS.md)** - Dicas, boas práticas e erros comuns
- **README.md** (este arquivo) - Guia completo e detalhado

## �📑 Índice

- [O que é TSOA?](#o-que-é-tsoa)
- [Por que usar TSOA?](#por-que-usar-tsoa)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Criar Controllers](#como-criar-controllers)
- [Validação de Dados](#validação-de-dados)
- [Rotas Automáticas](#rotas-automáticas)
- [Swagger Automático](#swagger-automático)
- [Build e Execução](#build-e-execução)
- [Exemplos Práticos](#exemplos-práticos)
- [Troubleshooting](#troubleshooting)

---

## 🤔 O que é TSOA?

**TSOA** (TypeScript OpenAPI) é uma biblioteca que gera automaticamente:
- ✅ **Rotas** do Express baseadas em seus controllers
- ✅ **Documentação Swagger/OpenAPI** completa
- ✅ **Validação** de tipos em runtime

Em vez de escrever rotas manualmente, você decora suas classes TypeScript e o TSOA cuida do resto!

## 🎯 Por que usar TSOA?

### Vantagens:
- **Menos código**: Não precisa escrever rotas manualmente
- **Documentação automática**: Swagger atualizado sempre que você altera o código
- **Type-safe**: TypeScript garante tipos corretos em tempo de desenvolvimento
- **Validação automática**: Valida requisições automaticamente
- **Padronização**: Força boas práticas de API REST

### Comparação:

**Sem TSOA (tradicional):**
```typescript
// Rota manual
app.get('/api/people/:id', async (req, res) => {
  // Validar params manualmente
  // Buscar pessoa
  // Retornar JSON
});

// Documentação separada (Swagger escrito à mão)
```

**Com TSOA:**
```typescript
// Controller com decorators
@Get('{id}')
public async getPerson(@Path() id: number): Promise<Person> {
  return this.findPerson(id);
}
// Rota E documentação criadas automaticamente!
```

---

## 📦 Instalação

### 1. Dependências Necessárias

Execute o comando abaixo para instalar todas as bibliotecas necessárias:

```bash
npm install express tsoa reflect-metadata joi swagger-ui-express morgan
```

#### O que cada biblioteca faz:

| Biblioteca | Descrição |
|-----------|-----------|
| `express` | Framework web para Node.js |
| `tsoa` | Gera rotas e Swagger automaticamente |
| `reflect-metadata` | **OBRIGATÓRIO** - Permite que decorators funcionem |
| `joi` | Validação de dados com regras complexas |
| `swagger-ui-express` | Interface visual do Swagger |
| `morgan` | Logger de requisições HTTP |

### 2. Dependências de Desenvolvimento

```bash
npm install -D typescript @types/express @types/node @types/morgan @types/swagger-ui-express ts-node-dev
```

| Biblioteca | Descrição |
|-----------|-----------|
| `typescript` | Compilador TypeScript |
| `@types/*` | Definições de tipos para as bibliotecas |
| `ts-node-dev` | Executa TypeScript em desenvolvimento com hot-reload |

---

## ⚙️ Configuração

### 1. TypeScript (`tsconfig.json`)

O TSOA **requer** duas configurações obrigatórias:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,     // ✅ OBRIGATÓRIO
    "emitDecoratorMetadata": true,       // ✅ OBRIGATÓRIO
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### 2. TSOA (`tsoa.json`)

Arquivo de configuração do TSOA:

```json
{
  "entryFile": "src/app.ts",                    // Arquivo principal da aplicação
  "noImplicitAdditionalProperties": "throw-on-extras",  // Rejeita campos extras
  "controllerPathGlobs": ["src/controllers/**/*.ts"],   // Onde estão os controllers
  "spec": {
    "outputDirectory": "src/swagger",           // Onde salvar o swagger.json
    "specVersion": 3,                           // Versão OpenAPI
    "name": "Express People API",               // Nome da API
    "description": "API para gerenciamento de pessoas",
    "version": "1.0.0"
  },
  "routes": {
    "routesDir": "src/routes",                  // Onde salvar routes.ts
    "middleware": "express"                     // Tipo de middleware
  }
}
```

#### Opções importantes:

- **`noImplicitAdditionalProperties`**: 
  - `"throw-on-extras"`: Rejeita campos não definidos na interface
  - `"ignore"`: Ignora campos extras
  - `"silently-remove-extras"`: Remove campos extras silenciosamente

- **`controllerPathGlobs`**: Padrão glob para encontrar controllers. Aceita múltiplos padrões.

### 3. Package.json Scripts

Adicione os scripts necessários:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "npm run tsoa:spec && npm run tsoa:routes && tsc",
    "start": "node dist/server.js",
    "tsoa:spec": "tsoa spec",      // Gera swagger.json
    "tsoa:routes": "tsoa routes"   // Gera routes.ts
  }
}
```

#### O que cada script faz:

- **`dev`**: Roda em modo desenvolvimento com auto-reload
- **`build`**: 
  1. Gera `swagger.json`
  2. Gera `routes.ts`
  3. Compila TypeScript para JavaScript
- **`start`**: Executa a versão compilada (produção)
- **`tsoa:spec`**: Gera apenas o Swagger
- **`tsoa:routes`**: Gera apenas as rotas

---

## 📁 Estrutura do Projeto

```
express/
├── src/
│   ├── app.ts                          # Configuração do Express
│   ├── server.ts                       # Inicia o servidor
│   ├── controllers/                    # Controllers da API
│   │   └── personController.ts
│   ├── middleware/                     # Middlewares customizados
│   │   └── joiValidation.ts
│   ├── schemas/                        # Schemas de validação Joi
│   │   └── personSchemas.ts
│   ├── types/                          # Interfaces TypeScript
│   │   ├── person.ts                   # Modelo de dados
│   │   └── dtos.ts                     # Data Transfer Objects
│   ├── routes/                         # 🤖 Gerado automaticamente
│   │   └── routes.ts
│   └── swagger/                        # 🤖 Gerado automaticamente
│       └── swagger.json
├── tsconfig.json                       # Configuração TypeScript
├── tsoa.json                           # Configuração TSOA
└── package.json
```

### ⚠️ Arquivos Gerados Automaticamente

**NÃO edite manualmente:**
- `src/routes/routes.ts` - Gerado pelo comando `tsoa routes`
- `src/swagger/swagger.json` - Gerado pelo comando `tsoa spec`

Estes arquivos são recriados toda vez que você roda `npm run build`.

---

## 🎮 Como Criar Controllers

### Estrutura Básica

```typescript
import { Controller, Get, Post, Put, Delete, Route, Tags, Body, Path } from 'tsoa';

@Route('api/recurso')        // Define a rota base
@Tags('Nome do Recurso')     // Agrupa no Swagger
export class MeuController extends Controller {
  
  @Get()                     // GET /api/recurso
  public async listar() {
    return [];
  }
  
  @Post()                    // POST /api/recurso
  public async criar(@Body() body: any) {
    return {};
  }
}
```

### Decorators Principais

#### 1. **@Route(path)** - Define o caminho base
```typescript
@Route('api/people')  // Todas as rotas começam com /api/people
export class PersonController extends Controller { }
```

#### 2. **@Tags(name)** - Agrupa rotas no Swagger
```typescript
@Tags('People')  // Aparece como "People" no Swagger
export class PersonController extends Controller { }
```

#### 3. **Métodos HTTP**
```typescript
@Get()           // GET
@Post()          // POST
@Put()           // PUT
@Delete()        // DELETE
@Patch()         // PATCH
```

#### 4. **@Path() - Parâmetros de URL**
```typescript
@Get('{id}')  // GET /api/people/123
public async getPerson(@Path() id: number) { }

@Get('{id}/orders/{orderId}')  // Múltiplos parâmetros
public async getOrder(
  @Path() id: number,
  @Path() orderId: number
) { }
```

#### 5. **@Body() - Corpo da requisição**
```typescript
@Post()
public async criar(@Body() data: CreateDTO) { }
```

#### 6. **@Query() - Query parameters**
```typescript
@Get('search')  // GET /api/people/search?name=John&age=30
public async search(
  @Query() name?: string,
  @Query() age?: number
) { }
```

#### 7. **@Header() - Headers da requisição**
```typescript
@Get()
public async listar(@Header() authorization: string) { }
```

#### 8. **@SuccessResponse() - Documenta respostas**
```typescript
@SuccessResponse('201', 'Criado com sucesso')
@Post()
public async criar() { 
  this.setStatus(201);  // Define status code
  return {};
}
```

#### 9. **@Response() - Documenta erros**
```typescript
@Response<ErrorResponse>('404', 'Não encontrado')
@Response<ErrorResponse>('400', 'Dados inválidos')
@Get('{id}')
public async get(@Path() id: number) { }
```

### Exemplo Completo: PersonController

```typescript
import {
  Controller, Get, Post, Put, Delete,
  Route, Tags, Body, Path,
  SuccessResponse, Response
} from 'tsoa';

// Interface da entidade
interface Person {
  id: number;
  name: string;
  email: string;
  age?: number;
}

// DTO de criação
interface CreatePersonDTO {
  name: string;
  email: string;
  age?: number;
}

@Route('api/people')
@Tags('People')
export class PersonController extends Controller {
  
  private static people: Person[] = [];
  private static currentId = 1;

  /**
   * Lista todas as pessoas
   */
  @Get()
  @SuccessResponse('200', 'Lista retornada')
  public async listAll(): Promise<Person[]> {
    return PersonController.people;
  }

  /**
   * Busca pessoa por ID
   */
  @Get('{id}')
  @SuccessResponse('200', 'Pessoa encontrada')
  @Response<{message: string}>('404', 'Não encontrada')
  public async getById(@Path() id: number): Promise<Person> {
    const person = PersonController.people.find(p => p.id === id);
    
    if (!person) {
      this.setStatus(404);
      throw new Error('Person not found');
    }
    
    return person;
  }

  /**
   * Cria nova pessoa
   */
  @Post()
  @SuccessResponse('201', 'Pessoa criada')
  public async create(@Body() body: CreatePersonDTO): Promise<Person> {
    const newPerson: Person = {
      id: PersonController.currentId++,
      ...body
    };
    
    PersonController.people.push(newPerson);
    this.setStatus(201);
    
    return newPerson;
  }

  /**
   * Atualiza pessoa existente
   */
  @Put('{id}')
  @SuccessResponse('200', 'Pessoa atualizada')
  @Response('404', 'Não encontrada')
  public async update(
    @Path() id: number,
    @Body() body: Partial<CreatePersonDTO>
  ): Promise<Person> {
    const index = PersonController.people.findIndex(p => p.id === id);
    
    if (index === -1) {
      this.setStatus(404);
      throw new Error('Person not found');
    }
    
    PersonController.people[index] = {
      ...PersonController.people[index],
      ...body
    };
    
    return PersonController.people[index];
  }

  /**
   * Remove pessoa
   */
  @Delete('{id}')
  @SuccessResponse('204', 'Pessoa removida')
  @Response('404', 'Não encontrada')
  public async delete(@Path() id: number): Promise<void> {
    const index = PersonController.people.findIndex(p => p.id === id);
    
    if (index === -1) {
      this.setStatus(404);
      throw new Error('Person not found');
    }
    
    PersonController.people.splice(index, 1);
    this.setStatus(204);
  }
}
```

---

## ✅ Validação de Dados

O TSOA oferece **dois níveis de validação**:

### 1. Validação TypeScript (Automática)

Usando **JSDoc tags** nas interfaces:

```typescript
export interface CreatePersonDTO {
  /** 
   * Nome da pessoa
   * @minLength 3      // Mínimo 3 caracteres
   * @maxLength 120    // Máximo 120 caracteres
   */
  name: string;
  
  /** 
   * Email da pessoa
   * @format email     // Valida formato de email
   */
  email: string;
  
  /** 
   * Idade da pessoa
   * @minimum 0        // Mínimo 0
   * @maximum 130      // Máximo 130
   * @isInt           // Deve ser inteiro
   */
  age?: number;
}
```

#### Tags de validação disponíveis:

| Tag | Descrição | Exemplo |
|-----|-----------|---------|
| `@minLength` | Tamanho mínimo (string) | `@minLength 3` |
| `@maxLength` | Tamanho máximo (string) | `@maxLength 100` |
| `@minimum` | Valor mínimo (número) | `@minimum 0` |
| `@maximum` | Valor máximo (número) | `@maximum 999` |
| `@isInt` | Deve ser inteiro | `@isInt` |
| `@isFloat` | Deve ser decimal | `@isFloat` |
| `@format` | Formato específico | `@format email`, `@format date-time`, `@format uuid` |
| `@pattern` | Regex pattern | `@pattern ^[A-Z]{3}$` |

### 2. Validação Joi (Customizada)

Para regras mais complexas, use **Joi** em conjunto:

#### Criar Schema Joi:

```typescript
// src/schemas/personSchemas.ts
import Joi from 'joi';

export const createPersonSchema = Joi.object({
  name: Joi.string()
    .trim()                    // Remove espaços
    .min(3)
    .max(120)
    .required(),
  
  email: Joi.string()
    .trim()
    .email()                   // Valida email
    .required(),
  
  age: Joi.number()
    .integer()
    .min(0)
    .max(130)
    .optional()
});

export const updatePersonSchema = Joi.object({
  name: Joi.string().trim().min(3).max(120),
  email: Joi.string().trim().email(),
  age: Joi.number().integer().min(0).max(130)
}).min(1);  // Pelo menos 1 campo obrigatório

export const personIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});
```

#### Criar Middleware de Validação:

```typescript
// src/middleware/joiValidation.ts
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

type RequestSegment = 'body' | 'params' | 'query';

export const validateWithJoi = (
  schema: ObjectSchema,
  segment: RequestSegment = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[segment];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,      // Retorna todos os erros
      stripUnknown: true      // Remove campos desconhecidos
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      res.status(400).json({
        message: 'Validation failed',
        errors: errors
      });
      return;
    }

    req[segment] = value;  // Substitui com dados validados
    next();
  };
};
```

#### Usar no Controller:

```typescript
import { Middlewares } from 'tsoa';
import { validateWithJoi } from '../middleware/joiValidation';
import { createPersonSchema, personIdSchema } from '../schemas/personSchemas';

@Route('api/people')
export class PersonController extends Controller {
  
  // Valida corpo da requisição
  @Post()
  @Middlewares(validateWithJoi(createPersonSchema, 'body'))
  public async create(@Body() body: CreatePersonDTO) {
    // Dados já foram validados pelo middleware
  }
  
  // Valida parâmetros da URL
  @Get('{id}')
  @Middlewares(validateWithJoi(personIdSchema, 'params'))
  public async getById(@Path() id: number) {
    // ID já foi validado
  }
  
  // Múltiplos middlewares
  @Put('{id}')
  @Middlewares(
    validateWithJoi(personIdSchema, 'params'),
    validateWithJoi(updatePersonSchema, 'body')
  )
  public async update(@Path() id: number, @Body() body: UpdatePersonDTO) {
    // Params e body validados
  }
}
```

### Quando usar cada tipo?

| Cenário | Solução |
|---------|---------|
| Validações simples (tipo, min, max) | JSDoc tags (TSOA) |
| Validações complexas (regex, custom) | Joi |
| Transformações de dados | Joi (trim, lowercase, etc) |
| Validações condicionais | Joi |
| Documentação automática | JSDoc tags |

---

## 🛣️ Rotas Automáticas

### Como Funciona?

1. Você cria controllers com decorators
2. Roda `npm run tsoa:routes`
3. TSOA gera `src/routes/routes.ts`
4. Você registra as rotas no Express

### Arquivo Gerado (routes.ts)

```typescript
// 🤖 GERADO AUTOMATICAMENTE - NÃO EDITAR
import { Express, Request, Response, NextFunction } from 'express';
import { PersonController } from '../controllers/personController';

export function RegisterRoutes(app: Express) {
  app.get('/api/people', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const controller = new PersonController();
      const result = await controller.listAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });
  
  // ... outras rotas
}
```

### Registrar no Express (app.ts)

```typescript
import 'reflect-metadata';  // ⚠️ SEMPRE PRIMEIRO
import express from 'express';
import { RegisterRoutes } from './routes/routes';

const app = express();

app.use(express.json());

// Registra todas as rotas
RegisterRoutes(app);

// Rota 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((error: Error, req, res, next) => {
  res.status(500).json({
    message: 'Internal error',
    detail: error.message
  });
});

export default app;
```

### ⚠️ IMPORTANTE: reflect-metadata

**SEMPRE** importe `reflect-metadata` como primeira linha do arquivo de entrada:

```typescript
import 'reflect-metadata';  // ✅ DEVE ser a PRIMEIRA linha
import express from 'express';
```

Sem isso, os decorators não funcionam!

---

## 📖 Swagger Automático

### Como Funciona?

1. TSOA lê seus controllers e decorators
2. Gera `swagger.json` automaticamente
3. Você exibe com `swagger-ui-express`

### Configurar Swagger UI

```typescript
// src/app.ts
import swaggerUi from 'swagger-ui-express';

// Rota para documentação
app.use('/api-docs', swaggerUi.serve, async (req, res, next) => {
  const swaggerDocument = await import('./swagger/swagger.json');
  return swaggerUi.setup(swaggerDocument)(req, res, next);
});
```

### Acessar Swagger

1. Rode o servidor: `npm run dev`
2. Acesse: http://localhost:3333/api-docs

### Personalizar Documentação

#### No Controller (JSDoc):

```typescript
@Route('api/people')
@Tags('People')
export class PersonController extends Controller {
  
  /**
   * Busca pessoa por ID
   * 
   * Esta rota retorna os dados completos de uma pessoa
   * baseado no ID fornecido
   * 
   * @param id - ID único da pessoa
   * @returns Dados da pessoa
   */
  @Get('{id}')
  @SuccessResponse('200', 'Pessoa encontrada com sucesso')
  @Response<ErrorResponse>('404', 'Pessoa não encontrada')
  @Response<ErrorResponse>('400', 'ID inválido')
  public async getById(@Path() id: number): Promise<Person> {
    // ...
  }
}
```

#### No tsoa.json:

```json
{
  "spec": {
    "name": "Minha API",
    "description": "Descrição completa da API",
    "version": "1.0.0",
    "license": "MIT",
    "contact": {
      "name": "Suporte",
      "email": "suporte@exemplo.com"
    }
  }
}
```

### Exemplo de Swagger Gerado

O Swagger mostra automaticamente:
- ✅ Todas as rotas
- ✅ Parâmetros esperados
- ✅ Tipos de dados
- ✅ Códigos de resposta
- ✅ Modelos de dados
- ✅ Exemplos de requisição
- ✅ Possibilidade de testar direto na interface

---

## 🔨 Build e Execução

### Desenvolvimento

```bash
npm run dev
```

- Roda com `ts-node-dev`
- Auto-reload quando salva arquivos
- Não precisa compilar
- **Perfeito para desenvolvimento**

### Build para Produção

```bash
npm run build
```

Este comando executa **3 etapas**:

1. **`tsoa spec`**: Gera `swagger.json`
2. **`tsoa routes`**: Gera `routes.ts`
3. **`tsc`**: Compila TypeScript → JavaScript

Resultado em `dist/`:
```
dist/
├── app.js
├── server.js
├── controllers/
├── middleware/
├── routes/
└── swagger/
```

### Executar em Produção

```bash
npm start
```

- Executa `dist/server.js` (JavaScript compilado)
- Mais rápido que desenvolvimento
- Não recompila automaticamente

### Fluxo Completo

```bash
# 1. Desenvolver
npm run dev

# 2. Fazer mudanças nos controllers

# 3. Rebuild (quando necessário)
npm run build

# 4. Testar produção
npm start
```

### Quando rodar `npm run build`?

- ✅ Antes de fazer deploy
- ✅ Após adicionar/modificar controllers
- ✅ Após mudar DTOs ou interfaces
- ✅ Após alterar `tsoa.json`
- ❌ **NÃO** precisa durante desenvolvimento com `npm run dev`

---

## 💡 Exemplos Práticos

### Exemplo 1: CRUD Completo de Produtos

```typescript
// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface CreateProductDTO {
  /** @minLength 3 @maxLength 100 */
  name: string;
  
  /** @minimum 0.01 */
  price: number;
  
  /** @minLength 3 */
  category: string;
  
  inStock?: boolean;
}
```

```typescript
// src/controllers/productController.ts
import { Controller, Get, Post, Put, Delete, Route, Tags, Body, Path, Query } from 'tsoa';

@Route('api/products')
@Tags('Products')
export class ProductController extends Controller {
  private static products: Product[] = [
    { id: 1, name: 'Notebook', price: 3000, category: 'Electronics', inStock: true }
  ];
  private static currentId = 2;

  @Get()
  public async listAll(
    @Query() category?: string,
    @Query() minPrice?: number,
    @Query() maxPrice?: number
  ): Promise<Product[]> {
    let filtered = ProductController.products;
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    
    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }
    
    return filtered;
  }

  @Get('{id}')
  @Response('404', 'Product not found')
  public async getById(@Path() id: number): Promise<Product> {
    const product = ProductController.products.find(p => p.id === id);
    if (!product) {
      this.setStatus(404);
      throw new Error('Product not found');
    }
    return product;
  }

  @Post()
  @SuccessResponse('201', 'Created')
  public async create(@Body() body: CreateProductDTO): Promise<Product> {
    const newProduct: Product = {
      id: ProductController.currentId++,
      inStock: body.inStock ?? true,
      ...body
    };
    
    ProductController.products.push(newProduct);
    this.setStatus(201);
    return newProduct;
  }

  @Put('{id}')
  public async update(
    @Path() id: number,
    @Body() body: Partial<CreateProductDTO>
  ): Promise<Product> {
    const index = ProductController.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      this.setStatus(404);
      throw new Error('Product not found');
    }
    
    ProductController.products[index] = {
      ...ProductController.products[index],
      ...body
    };
    
    return ProductController.products[index];
  }

  @Delete('{id}')
  @SuccessResponse('204', 'Deleted')
  public async delete(@Path() id: number): Promise<void> {
    const index = ProductController.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      this.setStatus(404);
      throw new Error('Product not found');
    }
    
    ProductController.products.splice(index, 1);
    this.setStatus(204);
  }
}
```

### Exemplo 2: Autenticação com Header

```typescript
interface User {
  id: number;
  username: string;
  role: string;
}

@Route('api/users')
@Tags('Users')
export class UserController extends Controller {
  
  /**
   * Requer token de autenticação no header
   */
  @Get('profile')
  @SuccessResponse('200', 'Profile retrieved')
  @Response('401', 'Unauthorized')
  public async getProfile(
    @Header('Authorization') authorization: string
  ): Promise<User> {
    // Validar token
    if (!authorization || !authorization.startsWith('Bearer ')) {
      this.setStatus(401);
      throw new Error('Invalid token');
    }
    
    const token = authorization.replace('Bearer ', '');
    
    // Aqui você validaria o token de verdade
    // Exemplo simplificado:
    if (token !== 'valid-token-123') {
      this.setStatus(401);
      throw new Error('Invalid token');
    }
    
    return {
      id: 1,
      username: 'john',
      role: 'admin'
    };
  }
}
```

### Exemplo 3: Paginação

```typescript
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

@Route('api/posts')
@Tags('Posts')
export class PostController extends Controller {
  
  @Get()
  public async listPaginated(
    @Query() page: number = 1,
    @Query() pageSize: number = 10
  ): Promise<PaginatedResponse<Post>> {
    const allPosts = this.getAllPosts();  // Busca todos
    
    const total = allPosts.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const data = allPosts.slice(start, end);
    
    return {
      data,
      page,
      pageSize,
      total,
      totalPages
    };
  }
}
```

### Exemplo 4: Upload de Arquivo (conceitual)

```typescript
import { UploadedFile } from 'tsoa';

@Route('api/files')
@Tags('Files')
export class FileController extends Controller {
  
  @Post('upload')
  @SuccessResponse('201', 'File uploaded')
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ filename: string; size: number }> {
    // Processar arquivo
    return {
      filename: file.originalname,
      size: file.size
    };
  }
}
```

---

## 🐛 Troubleshooting

### Problema 1: "Reflect.getOwnMetadata is not a function"

**Causa**: Falta importar `reflect-metadata`

**Solução**:
```typescript
// PRIMEIRA linha do app.ts
import 'reflect-metadata';
```

### Problema 2: Rotas não funcionam após mudanças

**Causa**: `routes.ts` desatualizado

**Solução**:
```bash
npm run build  # Regenera routes.ts
```

### Problema 3: Swagger não atualiza

**Causa**: `swagger.json` desatualizado

**Solução**:
```bash
npm run tsoa:spec  # Regenera swagger.json
```

### Problema 4: "experimentalDecorators" warning

**Causa**: Falta configuração no `tsconfig.json`

**Solução**:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Problema 5: Validação não funciona

**Causa**: JSDoc tags incorretas ou falta `noImplicitAdditionalProperties`

**Solução**:
```json
// tsoa.json
{
  "noImplicitAdditionalProperties": "throw-on-extras"
}
```

### Problema 6: Status code sempre 200

**Causa**: Esqueceu de chamar `this.setStatus()`

**Solução**:
```typescript
@Post()
public async create() {
  this.setStatus(201);  // ✅ Define status
  return result;
}
```

### Problema 7: Erro ao importar swagger.json

**Causa**: `resolveJsonModule` não habilitado

**Solução**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### Problema 8: Middleware não executa

**Causa**: Ordem incorreta ou middleware mal configurado

**Solução**:
```typescript
// Ordem importa!
@Middlewares(middleware1, middleware2)  // 1 executa antes de 2
@Post()
public async create() { }
```

---

## 📚 Recursos Adicionais

### Documentação Oficial
- **TSOA**: https://tsoa-community.github.io/docs/
- **Express**: https://expressjs.com/
- **Joi**: https://joi.dev/api/
- **Swagger**: https://swagger.io/docs/

### Decorators Disponíveis

| Decorator | Uso |
|-----------|-----|
| `@Route()` | Define rota base |
| `@Tags()` | Agrupa no Swagger |
| `@Get()`, `@Post()`, etc | Métodos HTTP |
| `@Body()` | Corpo da requisição |
| `@Path()` | Parâmetro da URL |
| `@Query()` | Query parameter |
| `@Header()` | Header HTTP |
| `@SuccessResponse()` | Documenta sucesso |
| `@Response()` | Documenta erro |
| `@Middlewares()` | Adiciona middlewares |
| `@Security()` | Autenticação |
| `@Example()` | Exemplo no Swagger |

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build completo
npm run build

# Só swagger
npm run tsoa:spec

# Só rotas
npm run tsoa:routes

# Produção
npm start
```

---

## 🎓 Resumo para Iniciantes

### Passo a Passo Rápido:

1. **Instalar dependências**
   ```bash
   npm install express tsoa reflect-metadata joi swagger-ui-express
   npm install -D typescript @types/express @types/node ts-node-dev
   ```

2. **Configurar `tsconfig.json`**
   ```json
   {
     "compilerOptions": {
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true
     }
   }
   ```

3. **Configurar `tsoa.json`**
   ```json
   {
     "entryFile": "src/app.ts",
     "controllerPathGlobs": ["src/controllers/**/*.ts"]
   }
   ```

4. **Criar controller com decorators**
   ```typescript
   @Route('api/items')
   @Tags('Items')
   export class ItemController extends Controller {
     @Get()
     public async list() {
       return [];
     }
   }
   ```

5. **Configurar Express**
   ```typescript
   import 'reflect-metadata';
   import { RegisterRoutes } from './routes/routes';
   
   RegisterRoutes(app);
   ```

6. **Build e executar**
   ```bash
   npm run build
   npm run dev
   ```

7. **Acessar Swagger**: http://localhost:3333/api-docs

---

## 🚀 Próximos Passos

Após dominar o básico:

1. ✅ Adicione autenticação com JWT
2. ✅ Conecte com banco de dados (MongoDB, PostgreSQL)
3. ✅ Implemente testes automatizados
4. ✅ Configure CI/CD
5. ✅ Adicione cache com Redis
6. ✅ Implemente rate limiting
7. ✅ Configure logs estruturados

---

## 💬 Dúvidas?

### FAQ:

**P: Preciso criar as rotas manualmente?**  
R: Não! TSOA gera automaticamente com `npm run tsoa:routes`.

**P: O Swagger é atualizado automaticamente?**  
R: Sim, sempre que você roda `npm run build` ou `npm run tsoa:spec`.

**P: Posso usar JavaScript em vez de TypeScript?**  
R: Não. TSOA depende de TypeScript e seus decorators.

**P: Funciona com outros frameworks além do Express?**  
R: Sim! Suporta Koa, Hapi e outros (configure em `tsoa.json`).

**P: Como adicionar autenticação?**  
R: Use `@Security()` decorator (veja documentação oficial).

---

**Criado com 💙 para desenvolvedores iniciantes**

Se este guia ajudou você, considere dar uma ⭐ no repositório!
