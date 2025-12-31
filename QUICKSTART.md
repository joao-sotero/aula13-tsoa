# 🚀 Quick Start - Guia Rápido

Este guia mostra como rodar o projeto em **3 passos simples**.

## Pré-requisitos

- Node.js instalado (versão 16 ou superior)
- npm (vem com o Node.js)

## Passo 1: Instalar Dependências

```bash
npm install
```

Este comando instala todas as bibliotecas necessárias (express, tsoa, joi, etc).

## Passo 2: Build

```bash
npm run build
```

Este comando:
1. Gera `src/swagger/swagger.json` (documentação)
2. Gera `src/routes/routes.ts` (rotas automáticas)
3. Compila TypeScript → JavaScript

## Passo 3: Rodar

```bash
npm run dev
```

O servidor será iniciado em: **http://localhost:3333**

## 📖 Acessar Documentação

Abra no navegador: **http://localhost:3333/api-docs**

Você verá a interface do Swagger onde pode:
- ✅ Ver todas as rotas disponíveis
- ✅ Testar as rotas diretamente no navegador
- ✅ Ver exemplos de requisição e resposta

## 🧪 Testar a API

### Listar todas as pessoas (inicialmente vazio)
```bash
GET http://localhost:3333/api/people
```

### Criar uma pessoa
```bash
POST http://localhost:3333/api/people
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "age": 25
}
```

### Buscar pessoa por ID
```bash
GET http://localhost:3333/api/people/1
```

### Atualizar pessoa
```bash
PUT http://localhost:3333/api/people/1
Content-Type: application/json

{
  "name": "João Pedro Silva"
}
```

### Deletar pessoa
```bash
DELETE http://localhost:3333/api/people/1
```

## 📝 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Roda em modo desenvolvimento (auto-reload) |
| `npm run build` | Gera rotas, Swagger e compila |
| `npm start` | Roda versão compilada (produção) |
| `npm run tsoa:spec` | Gera apenas swagger.json |
| `npm run tsoa:routes` | Gera apenas routes.ts |

## ❓ Problemas Comuns

### "Cannot find module 'routes'"
**Solução**: Execute `npm run build` primeiro

### "Reflect.getOwnMetadata is not a function"
**Solução**: Certifique-se que `import 'reflect-metadata'` está no topo do [src/app.ts](src/app.ts)

### Swagger não atualiza
**Solução**: Execute `npm run build` novamente

## 📚 Próximos Passos

1. Leia o [README.md](README.md) completo para entender TSOA em detalhes
2. Explore os arquivos comentados em [src/controllers/](src/controllers/)
3. Teste criar seu próprio controller

## 💡 Dica

Use a coleção Postman em [postman/](postman/) para testar a API de forma mais prática!
