# 📘 Guia de Configuração do tsconfig.json

> **Nota**: Embora o TypeScript aceite comentários em tsconfig.json (formato JSONC), é melhor manter as explicações em arquivo separado para evitar problemas com parsers.

## 📄 Estrutura do tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "rootDir": "src",
        "outDir": "dist",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    },
    "include": ["src"]
}
```

---

## 🔧 Configurações de Compilação

### `target`
**Valor**: `"ES2020"`

Define a versão do JavaScript gerada após compilação.

**O que muda**:
- `ES5` - Suporte máximo (IE11+)
- `ES2015` - Básico (let, const, arrow functions)
- `ES2020` - **Recomendado** (optional chaining `?.`, nullish coalescing `??`)
- `ESNext` - Recursos mais recentes

**Exemplo**:
```typescript
// TypeScript
const name = person?.name ?? 'Unknown';

// Compilado para ES2020 (mantém sintaxe)
const name = person?.name ?? 'Unknown';

// Compilado para ES5 (transpila)
var name = (person === null || person === void 0 ? void 0 : person.name) !== null && name !== void 0 ? name : 'Unknown';
```

---

### `module`
**Valor**: `"CommonJS"`

Define o sistema de módulos no código gerado.

**Opções**:

| Valor | Uso | Sintaxe de Import/Export |
|-------|-----|--------------------------|
| `CommonJS` | **Node.js** (recomendado) | `require()` / `module.exports` |
| `ES6` / `ES2015` | Navegadores modernos | `import` / `export` |
| `UMD` | Universal (Node + Browser) | Ambos |

**Exemplo**:
```typescript
// TypeScript
import express from 'express';

// Compilado para CommonJS
const express = require('express');

// Compilado para ES6
import express from 'express';
```

---

### `rootDir`
**Valor**: `"src"`

Diretório raiz dos arquivos TypeScript de origem.

**Por que usar**: Mantém estrutura de pastas ao compilar.

**Exemplo**:
```
src/
  controllers/
    personController.ts
  types/
    person.ts

↓ Compilado para ↓

dist/
  controllers/
    personController.js
  types/
    person.js
```

---

### `outDir`
**Valor**: `"dist"`

Diretório onde os arquivos JavaScript compilados serão salvos.

**Resultado**: Arquivos `.js` ficam em `dist/` mantendo estrutura de `src/`

---

## 🔄 Interoperabilidade

### `esModuleInterop`
**Valor**: `true` ✅

Permite importar módulos CommonJS como se fossem ES6.

**Sem esta opção**:
```typescript
import * as express from 'express';  // ❌ Desconfortável
```

**Com esta opção**:
```typescript
import express from 'express';  // ✅ Limpo e natural
```

---

### `forceConsistentCasingInFileNames`
**Valor**: `true` ✅

Garante consistência de capitalização nos nomes de arquivos.

**Por que importante**: Evita bugs entre Windows (case-insensitive) e Linux (case-sensitive).

**Exemplo**:
```typescript
// No Windows funciona, no Linux quebra:
import { Person } from './types/Person';  // Arquivo: person.ts

// Com esta opção: TypeScript dá erro em ambos
// Correto:
import { Person } from './types/person';  // ✅
```

---

## 🛡️ Validações Estritas

### `strict`
**Valor**: `true` ✅ **Altamente recomendado**

Ativa **TODAS** as verificações de tipo estritas.

**Inclui automaticamente**:
- `strictNullChecks` - Trata `null` e `undefined` como tipos distintos
- `noImplicitAny` - Proíbe `any` implícito
- `strictFunctionTypes` - Validação estrita de funções
- `strictBindCallApply` - Valida bind/call/apply
- `strictPropertyInitialization` - Propriedades devem ser inicializadas
- `noImplicitThis` - `this` deve ter tipo explícito
- `alwaysStrict` - Usa `"use strict"` em todos os arquivos

**Exemplo sem `strict`**:
```typescript
let name;  // any implícito - compila
name = 123;
name = "text";  // Sem erro!
```

**Exemplo com `strict`**:
```typescript
let name;  // ❌ Erro: Variable 'name' implicitly has an 'any' type
let name: string;  // ✅ Correto
```

---

## ⚡ Otimizações

### `skipLibCheck`
**Valor**: `true` ✅

Pula verificação de tipos em arquivos `.d.ts` de bibliotecas.

**Benefício**: Acelera compilação **significativamente** sem perder type-safety no seu código.

**Por que é seguro**: Bibliotecas já foram validadas pelos autores.

---

### `resolveJsonModule`
**Valor**: `true` ✅

Permite importar arquivos JSON como módulos.

**Exemplo**:
```typescript
// Sem esta opção: ❌ Erro
import swaggerDoc from './swagger/swagger.json';

// Com esta opção: ✅ Funciona
import swaggerDoc from './swagger/swagger.json';
console.log(swaggerDoc.info.title);
```

---

## ⚠️ Decorators (OBRIGATÓRIO PARA TSOA)

### `experimentalDecorators`
**Valor**: `true` ✅ **OBRIGATÓRIO**

Habilita decorators experimentais do TypeScript.

**Sem esta opção**: TSOA não funciona!

**Exemplo de decorators**:
```typescript
@Route('api/people')  // ❌ Erro sem experimentalDecorators
@Tags('People')       // ❌ Erro sem experimentalDecorators
export class PersonController extends Controller {
  @Get()              // ❌ Erro sem experimentalDecorators
  public async list() {}
}
```

---

### `emitDecoratorMetadata`
**Valor**: `true` ✅ **OBRIGATÓRIO**

Emite metadados de tipo para decorators em runtime.

**O que faz**: Permite que o TSOA leia tipos em tempo de execução.

**Sem esta opção**: TSOA não consegue validar tipos automaticamente.

**Exemplo**:
```typescript
@Get('{id}')
public async getPerson(@Path() id: number) { }
//                              ^^^^^^
// TSOA sabe que é number em runtime graças a emitDecoratorMetadata
```

---

## 📂 Include

### `include`
**Valor**: `["src"]`

Array de padrões de arquivos/diretórios a serem compilados.

**Exemplos**:
```json
// Apenas src/
"include": ["src"]

// src/ e tests/
"include": ["src", "tests"]

// Padrões específicos
"include": [
  "src/**/*.ts",
  "src/**/*.tsx"
]
```

---

## 🔍 Outras Opções Úteis (Não Usadas Neste Projeto)

### Para Código Mais Seguro

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,        // Erro em variáveis não usadas
    "noUnusedParameters": true,    // Erro em parâmetros não usados
    "noImplicitReturns": true,     // Função deve retornar em todos os caminhos
    "noFallthroughCasesInSwitch": true  // Erro em switch sem break
  }
}
```

### Para Projetos Maiores

```json
{
  "compilerOptions": {
    "incremental": true,           // Compilação incremental (mais rápido)
    "tsBuildInfoFile": ".tsbuildinfo",  // Onde salvar cache
    "sourceMap": true,             // Gera source maps para debug
    "declaration": true,           // Gera arquivos .d.ts
    "declarationMap": true         // Source maps para .d.ts
  }
}
```

### Para React

```json
{
  "compilerOptions": {
    "jsx": "react",                // Suporte a JSX
    "lib": ["ES2020", "DOM"]       // Inclui tipos do DOM
  }
}
```

---

## 📋 Configuração Completa Recomendada

Para um projeto Node.js com TSOA:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "rootDir": "src",
        "outDir": "dist",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "sourceMap": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
}
```

---

## ⚠️ Erros Comuns

### ❌ "Experimental support for decorators is a feature that is subject to change"
**Causa**: Falta `"experimentalDecorators": true`

**Solução**: Adicione no `compilerOptions`

### ❌ "Cannot find module './swagger.json'"
**Causa**: Falta `"resolveJsonModule": true`

**Solução**: Adicione no `compilerOptions`

### ❌ Tipos não são validados em runtime
**Causa**: Falta `"emitDecoratorMetadata": true`

**Solução**: Adicione no `compilerOptions`

### ❌ Imports não funcionam corretamente
**Causa**: `esModuleInterop` desabilitado

**Solução**: Defina `"esModuleInterop": true`

---

## 🎯 Quando Modificar tsconfig.json

Você deve modificar quando:

- ✅ Adicionar novos diretórios ao projeto
- ✅ Mudar para outro sistema de módulos
- ✅ Adicionar suporte a React/JSX
- ✅ Habilitar source maps para debug
- ✅ Ajustar rigor das validações

**Após modificar**: Execute `npm run build` para recompilar.

---

## 📚 Referências

- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [TSOA Documentation](https://tsoa-community.github.io/docs/)
- [TSConfig Bases](https://github.com/tsconfig/bases)

---

**Última atualização**: Dezembro 2025
