# 📋 Estrutura do Projeto - Visão Geral

Esta é a estrutura completa do projeto TSOA com todos os arquivos documentados.

## 📁 Estrutura de Diretórios

```
express/
│
├── 📄 README.md              ⭐ Guia completo TSOA (LEIA PRIMEIRO)
├── 📄 QUICKSTART.md          🚀 Guia rápido de 3 passos
├── 📄 TIPS.md                💡 Dicas e boas práticas
│
├── ⚙️ tsconfig.json           Configuração TypeScript (COM comentários)
├── ⚙️ tsoa.json               Configuração TSOA (COM comentários)
├── 📦 package.json           Dependências e scripts
│
├── 📂 src/                   Código-fonte
│   │
│   ├── 🚀 server.ts          Inicia o servidor (COM comentários)
│   ├── 🔧 app.ts             Configuração Express (COM comentários)
│   │
│   ├── 📂 controllers/       Controllers da API
│   │   └── personController.ts  ⭐ CRUD completo (MUITO comentado)
│   │
│   ├── 📂 types/             Interfaces TypeScript
│   │   ├── person.ts         Modelo Person (COM comentários)
│   │   └── dtos.ts           DTOs (MUITO comentado)
│   │
│   ├── 📂 schemas/           Validação Joi
│   │   └── personSchemas.ts  Schemas (MUITO comentado)
│   │
│   ├── 📂 middleware/        Middlewares customizados
│   │   └── joiValidation.ts  Validação (MUITO comentado)
│   │
│   ├── 📂 routes/            🤖 GERADO AUTOMATICAMENTE
│   │   └── routes.ts         NÃO EDITAR (gerado por tsoa routes)
│   │
│   └── 📂 swagger/           🤖 GERADO AUTOMATICAMENTE
│       └── swagger.json      NÃO EDITAR (gerado por tsoa spec)
│
├── 📂 dist/                  Código compilado (gerado por tsc)
│   └── ...                   JavaScript gerado automaticamente
│
└── 📂 postman/               Coleção Postman para testes
    └── express-people-api.postman_collection.json
```

## 🔍 Arquivos Principais

### Documentação (⭐ Comece Aqui)

| Arquivo | Descrição | Quando Ler |
|---------|-----------|------------|
| **QUICKSTART.md** | Guia rápido de 3 passos | **PRIMEIRO** - Para iniciar rápido |
| **README.md** | Guia completo TSOA | **SEGUNDO** - Para entender tudo |
| **TIPS.md** | Dicas e boas práticas | **TERCEIRO** - Para melhorar |

### Configuração

| Arquivo | Descrição | O que Configura |
|---------|-----------|-----------------|
| **tsconfig.json** | TypeScript | Compilação, decorators, módulos |
| **tsoa.json** | TSOA | Rotas, Swagger, validação |
| **package.json** | npm | Dependências e scripts |

### Código-fonte (src/)

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| **server.ts** | Entrada | Inicia servidor HTTP |
| **app.ts** | Config | Configura Express, Swagger, rotas |
| **controllers/personController.ts** | Controller | CRUD de pessoas (EXEMPLO COMPLETO) |
| **types/person.ts** | Model | Interface Person |
| **types/dtos.ts** | DTOs | CreatePersonDTO, UpdatePersonDTO |
| **schemas/personSchemas.ts** | Validação | Schemas Joi |
| **middleware/joiValidation.ts** | Middleware | Validador Joi |

### Arquivos Gerados (NÃO EDITAR)

| Arquivo | Como é Gerado | Quando Regenerar |
|---------|---------------|------------------|
| **src/routes/routes.ts** | `npm run tsoa:routes` | Após mudar controllers |
| **src/swagger/swagger.json** | `npm run tsoa:spec` | Após mudar DTOs/controllers |
| **dist/** | `npm run build` ou `tsc` | Antes de deploy |

## 🎯 Fluxo de Trabalho

### 1️⃣ Desenvolvimento

```
Criar/Editar Controller
    ↓
Definir DTOs com validações
    ↓
Criar Schemas Joi (se necessário)
    ↓
npm run build
    ↓
npm run dev
    ↓
Testar em http://localhost:3333/api-docs
```

### 2️⃣ Build para Produção

```bash
npm run build    # Gera routes.ts + swagger.json + compila
npm start        # Roda versão compilada
```

### 3️⃣ Apenas Atualizar Documentação

```bash
npm run tsoa:spec    # Regenera apenas swagger.json
```

## 📖 Como Usar Este Projeto para Aprender

### Fase 1: Entendimento (1-2 horas)
1. ✅ Leia [QUICKSTART.md](QUICKSTART.md)
2. ✅ Rode o projeto (`npm install && npm run build && npm run dev`)
3. ✅ Teste no Swagger (http://localhost:3333/api-docs)
4. ✅ Leia os comentários em [src/controllers/personController.ts](src/controllers/personController.ts)

### Fase 2: Aprofundamento (2-4 horas)
1. ✅ Leia [README.md](README.md) completo
2. ✅ Estude [src/types/dtos.ts](src/types/dtos.ts) (validações com JSDoc)
3. ✅ Estude [src/schemas/personSchemas.ts](src/schemas/personSchemas.ts) (Joi)
4. ✅ Entenda [src/middleware/joiValidation.ts](src/middleware/joiValidation.ts)
5. ✅ Leia [TIPS.md](TIPS.md)

### Fase 3: Prática (4-8 horas)
1. ✅ Crie um novo controller (ex: ProductController)
2. ✅ Defina DTOs com validações
3. ✅ Crie schemas Joi customizados
4. ✅ Teste tudo no Swagger
5. ✅ Compare com PersonController

## 🛠️ Scripts npm Disponíveis

| Comando | O Que Faz | Quando Usar |
|---------|-----------|-------------|
| `npm install` | Instala dependências | **Uma vez** no início |
| `npm run dev` | Modo desenvolvimento | **Sempre** durante desenvolvimento |
| `npm run build` | Build completo | Após mudar controllers/DTOs |
| `npm start` | Roda produção | Para testar versão final |
| `npm run tsoa:spec` | Gera Swagger | Apenas atualizar documentação |
| `npm run tsoa:routes` | Gera rotas | Apenas atualizar rotas |

## 📝 Exemplo de Uso Completo

### 1. Criar novo Controller

```typescript
// src/controllers/productController.ts
import { Controller, Get, Post, Route, Tags, Body } from 'tsoa';

@Route('api/products')
@Tags('Products')
export class ProductController extends Controller {
  @Get()
  public async list() {
    return [];
  }
  
  @Post()
  public async create(@Body() body: CreateProductDTO) {
    return { id: 1, ...body };
  }
}
```

### 2. Criar DTO

```typescript
// src/types/product.ts
export interface CreateProductDTO {
  /** @minLength 3 */
  name: string;
  
  /** @minimum 0 */
  price: number;
}
```

### 3. Build e Testar

```bash
npm run build
npm run dev
# Acesse http://localhost:3333/api-docs
```

## ❓ Perguntas Frequentes

**P: Preciso editar routes.ts manualmente?**  
R: ❌ NÃO! Ele é gerado automaticamente.

**P: Como adiciono uma nova rota?**  
R: Crie um método com decorator no controller e rode `npm run build`.

**P: O Swagger não atualizou**  
R: Execute `npm run build` novamente.

**P: Posso adicionar comentários no código?**  
R: ✅ SIM! Todos os arquivos em `src/` já têm comentários didáticos.

## 🎓 Próximos Passos

Após dominar este projeto:

1. ✅ Adicione autenticação (JWT)
2. ✅ Conecte banco de dados (MongoDB/PostgreSQL)
3. ✅ Implemente testes (Jest)
4. ✅ Configure Docker
5. ✅ Deploy (Heroku/AWS/Azure)

---

**Bons estudos! 🚀**

Se tiver dúvidas, revise:
- [QUICKSTART.md](QUICKSTART.md) - Setup rápido
- [README.md](README.md) - Guia completo
- [TIPS.md](TIPS.md) - Dicas e truques
