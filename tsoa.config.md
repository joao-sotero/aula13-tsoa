# 📘 Guia de Configuração do tsoa.json

> **Atenção**: O arquivo `tsoa.json` é JSON puro e **NÃO aceita comentários**. Este arquivo explica cada configuração.

## 📄 Estrutura do tsoa.json

```json
{
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/controllers/**/*.ts"],
  "spec": {
    "outputDirectory": "src/swagger",
    "specVersion": 3,
    "name": "Express People API",
    "description": "API para gerenciamento de pessoas",
    "version": "1.0.0"
  },
  "routes": {
    "routesDir": "src/routes",
    "middleware": "express"
  }
}
```

---

## 🔧 Configurações Principais

### `entryFile`
**Valor**: `"src/app.ts"`

Arquivo de entrada da aplicação onde o Express é configurado.

**O que faz**: TSOA usa este arquivo para entender a estrutura da aplicação.

---

### `noImplicitAdditionalProperties`
**Valor**: `"throw-on-extras"` (recomendado)

Define como lidar com campos extras não definidos nos DTOs.

**Opções disponíveis**:

| Valor | Comportamento |
|-------|---------------|
| `"throw-on-extras"` | ✅ **Recomendado** - Rejeita requisições com campos não definidos |
| `"ignore"` | Aceita campos extras sem validar |
| `"silently-remove-extras"` | Remove campos extras silenciosamente |

**Exemplo**:
```typescript
// DTO define apenas: name, email, age
interface CreatePersonDTO {
  name: string;
  email: string;
  age?: number;
}

// Requisição com campo extra "phone"
{
  "name": "João",
  "email": "joao@example.com",
  "phone": "123456789"  // ❌ Campo extra!
}

// Com "throw-on-extras": Retorna erro 400
// Com "ignore": Aceita mas ignora "phone"
// Com "silently-remove-extras": Remove "phone" sem erro
```

---

### `controllerPathGlobs`
**Valor**: `["src/controllers/**/*.ts"]`

Padrão glob para localizar os controllers.

**Suporta múltiplos padrões**:
```json
"controllerPathGlobs": [
  "src/controllers/**/*.ts",
  "src/api/**/*.ts",
  "src/modules/**/controllers/*.ts"
]
```

**Exemplos de padrões**:
- `src/controllers/**/*.ts` - Todos os arquivos .ts em controllers/ e subpastas
- `src/controllers/*.ts` - Apenas arquivos .ts diretos em controllers/
- `src/**/controller.ts` - Arquivos chamados controller.ts em qualquer lugar

---

## 📖 Configuração do Swagger (`spec`)

### `outputDirectory`
**Valor**: `"src/swagger"`

Diretório onde o `swagger.json` será gerado.

**Resultado**: Arquivo em `src/swagger/swagger.json`

---

### `specVersion`
**Valor**: `3`

Versão da especificação OpenAPI.

**Opções**:
- `2` - OpenAPI 2.0 (Swagger 2.0)
- `3` - **OpenAPI 3.0** (recomendado)

---

### `name`
**Valor**: `"Express People API"`

Nome da API que aparece no topo da documentação Swagger.

**Onde aparece**: Título principal no http://localhost:3333/api-docs

---

### `description`
**Valor**: `"API para gerenciamento de pessoas..."`

Descrição da API que aparece logo abaixo do nome.

**Dica**: Seja claro e conciso sobre o propósito da API.

---

### `version`
**Valor**: `"1.0.0"`

Versão da sua API (use semantic versioning).

**Formato recomendado**: `MAJOR.MINOR.PATCH`
- `1.0.0` - Versão inicial
- `1.1.0` - Nova funcionalidade (compatível)
- `2.0.0` - Mudança que quebra compatibilidade

---

### Outras Opções Disponíveis para `spec`

Você pode adicionar mais campos ao objeto `spec`:

```json
{
  "spec": {
    "outputDirectory": "src/swagger",
    "specVersion": 3,
    "name": "Minha API",
    "description": "Descrição da API",
    "version": "1.0.0",
    "license": "MIT",
    "contact": {
      "name": "Suporte",
      "email": "suporte@example.com",
      "url": "https://example.com/support"
    },
    "basePath": "/v1",
    "schemes": ["https", "http"],
    "host": "api.example.com"
  }
}
```

**Campos adicionais**:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `license` | Licença da API | `"MIT"`, `"Apache-2.0"` |
| `contact.name` | Nome do contato | `"Equipe de Suporte"` |
| `contact.email` | Email de suporte | `"api@example.com"` |
| `contact.url` | URL de suporte | `"https://example.com/api"` |
| `basePath` | Prefixo para todas as rotas | `"/v1"`, `"/api"` |
| `schemes` | Protocolos aceitos | `["https"]`, `["http", "https"]` |
| `host` | Hostname da API | `"api.example.com"` |

---

## 🛣️ Configuração de Rotas (`routes`)

### `routesDir`
**Valor**: `"src/routes"`

Diretório onde o `routes.ts` será gerado.

**Resultado**: Arquivo em `src/routes/routes.ts`

⚠️ **IMPORTANTE**: Não edite este arquivo manualmente! Ele é regenerado automaticamente.

---

### `middleware`
**Valor**: `"express"`

Tipo de framework web usado.

**Opções disponíveis**:

| Valor | Framework |
|-------|-----------|
| `"express"` | Express.js |
| `"koa"` | Koa.js |
| `"hapi"` | Hapi.js |

---

## 🔄 Quando Alterar tsoa.json

Você deve modificar `tsoa.json` quando:

- ✅ Adicionar novos diretórios de controllers
- ✅ Mudar nome ou descrição da API
- ✅ Alterar estratégia de validação (`noImplicitAdditionalProperties`)
- ✅ Adicionar informações de contato ou licença
- ✅ Mudar de framework (Express → Koa)

**Após modificar**: Execute `npm run build` para regenerar rotas e Swagger.

---

## 📋 Exemplos de Configurações

### Exemplo 1: API com Múltiplos Diretórios

```json
{
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": [
    "src/controllers/**/*.ts",
    "src/modules/**/controllers/*.ts"
  ],
  "spec": {
    "outputDirectory": "src/swagger",
    "specVersion": 3,
    "name": "Multi-Module API",
    "description": "API com múltiplos módulos",
    "version": "1.0.0"
  },
  "routes": {
    "routesDir": "src/routes",
    "middleware": "express"
  }
}
```

### Exemplo 2: API Completa com Metadados

```json
{
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/controllers/**/*.ts"],
  "spec": {
    "outputDirectory": "src/swagger",
    "specVersion": 3,
    "name": "E-commerce API",
    "description": "API REST para sistema de e-commerce",
    "version": "2.1.0",
    "license": "MIT",
    "contact": {
      "name": "Equipe de Desenvolvimento",
      "email": "dev@ecommerce.com",
      "url": "https://ecommerce.com/api-docs"
    },
    "basePath": "/api/v2",
    "host": "api.ecommerce.com",
    "schemes": ["https"]
  },
  "routes": {
    "routesDir": "src/routes",
    "middleware": "express"
  }
}
```

### Exemplo 3: Ambiente de Desenvolvimento

```json
{
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "ignore",
  "controllerPathGlobs": ["src/controllers/**/*.ts"],
  "spec": {
    "outputDirectory": "src/swagger",
    "specVersion": 3,
    "name": "Dev API",
    "description": "Ambiente de desenvolvimento",
    "version": "0.1.0-dev"
  },
  "routes": {
    "routesDir": "src/routes",
    "middleware": "express"
  }
}
```

---

## ⚠️ Erros Comuns

### ❌ Erro: "SyntaxError: Unexpected token '/'"
**Causa**: Comentários no arquivo JSON

**Solução**: JSON não aceita comentários. Remova todos os `//` e `/* */`

### ❌ Erro: "Cannot find module 'src/app.ts'"
**Causa**: `entryFile` aponta para arquivo inexistente

**Solução**: Verifique se o caminho em `entryFile` está correto

### ❌ Erro: "No controllers found"
**Causa**: Padrão em `controllerPathGlobs` não encontra controllers

**Solução**: Verifique se o padrão glob está correto e se os controllers existem

---

## 📚 Referências

- [Documentação oficial TSOA](https://tsoa-community.github.io/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Semantic Versioning](https://semver.org/)

---

**Última atualização**: Dezembro 2025
