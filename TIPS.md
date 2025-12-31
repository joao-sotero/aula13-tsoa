# 💡 Dicas e Boas Práticas - TSOA

## 📌 Dicas Importantes

### 1. Sempre rode `npm run build` após mudanças

Sempre que você:
- ✅ Criar/modificar um controller
- ✅ Alterar interfaces ou DTOs
- ✅ Modificar decorators
- ✅ Alterar `tsoa.json`

Execute:
```bash
npm run build
```

Isso regenera `routes.ts` e `swagger.json`.

### 2. reflect-metadata SEMPRE em primeiro

```typescript
// ✅ CORRETO
import 'reflect-metadata';
import express from 'express';

// ❌ ERRADO
import express from 'express';
import 'reflect-metadata';
```

### 3. Use `this.setStatus()` para status codes customizados

```typescript
// ✅ CORRETO
@Post()
public async create() {
  this.setStatus(201);
  return newItem;
}

// ❌ ERRADO (sempre retorna 200)
@Post()
public async create() {
  return newItem;
}
```

### 4. Documentação ajuda você e outros desenvolvedores

```typescript
// ✅ BOM - Com documentação
/**
 * Busca produto por ID
 * @param id - ID único do produto
 */
@Get('{id}')
public async get(@Path() id: number) { }

// ⚠️ FUNCIONA - Mas sem documentação
@Get('{id}')
public async get(@Path() id: number) { }
```

## 🎯 Boas Práticas

### Organize DTOs Separados

```typescript
// ✅ BOM - DTOs separados para entrada e saída
interface CreateProductDTO {
  name: string;
  price: number;
}

interface ProductResponse {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
}

// ❌ EVITE - Reusar mesma interface
interface Product {
  id?: number;  // Confuso: tem ou não tem ID?
  name: string;
  price: number;
}
```

### Use Validação em Camadas

```typescript
// Camada 1: Validação TSOA (tipos básicos)
interface CreateDTO {
  /** @minLength 3 */
  name: string;
}

// Camada 2: Validação Joi (regras complexas)
const schema = Joi.object({
  name: Joi.string().trim().min(3),
  cpf: Joi.string().custom(validarCPF)  // Validação customizada
});

@Post()
@Middlewares(validateWithJoi(schema, 'body'))
public async create(@Body() body: CreateDTO) { }
```

### Retorne Tipos Específicos

```typescript
// ✅ BOM - Tipo específico
@Get('{id}')
public async get(@Path() id: number): Promise<Product> {
  return product;
}

// ❌ EVITE - Tipo genérico
@Get('{id}')
public async get(@Path() id: number): Promise<any> {
  return product;
}
```

### Trate Erros Adequadamente

```typescript
// ✅ BOM - Define status e lança erro
@Get('{id}')
public async get(@Path() id: number): Promise<Product> {
  const product = await this.repository.find(id);
  
  if (!product) {
    this.setStatus(404);
    throw new Error('Product not found');
  }
  
  return product;
}

// ❌ EVITE - Retorna null
@Get('{id}')
public async get(@Path() id: number): Promise<Product | null> {
  return await this.repository.find(id);  // Cliente não sabe se é erro
}
```

### Documente Todos os Status Codes

```typescript
// ✅ BOM - Documenta sucesso E erros
@Get('{id}')
@SuccessResponse('200', 'Produto encontrado')
@Response<ErrorResponse>('404', 'Produto não encontrado')
@Response<ErrorResponse>('400', 'ID inválido')
public async get(@Path() id: number): Promise<Product> { }

// ⚠️ FUNCIONA - Mas incompleto
@Get('{id}')
public async get(@Path() id: number): Promise<Product> { }
```

## 🚫 Erros Comuns

### 1. Esquecer de estender Controller

```typescript
// ❌ ERRADO
@Route('api/products')
export class ProductController {  // Falta estender Controller
  @Get()
  public async list() { }
}

// ✅ CORRETO
@Route('api/products')
export class ProductController extends Controller {
  @Get()
  public async list() { }
}
```

### 2. Decorators na ordem errada

```typescript
// ❌ ERRADO - @Route depois de @Tags
@Tags('Products')
@Route('api/products')
export class ProductController extends Controller { }

// ✅ CORRETO - @Route antes de @Tags
@Route('api/products')
@Tags('Products')
export class ProductController extends Controller { }
```

### 3. Usar tipos implícitos

```typescript
// ❌ EVITE - Tipo implícito (any)
@Post()
public async create(@Body() body) {  // body: any
  return body;
}

// ✅ BOM - Tipo explícito
@Post()
public async create(@Body() body: CreateDTO) {
  return body;
}
```

### 4. Não validar parâmetros

```typescript
// ❌ PERIGOSO - Sem validação
@Get('{id}')
public async get(@Path() id: number) {
  // id pode ser negativo, 0, ou string convertida
}

// ✅ SEGURO - Com validação
@Get('{id}')
@Middlewares(validateWithJoi(idSchema, 'params'))
public async get(@Path() id: number) {
  // id já foi validado (positivo, inteiro)
}
```

## 🔍 Debugging

### Ver rotas geradas

Abra `src/routes/routes.ts` (gerado automaticamente) para ver como o TSOA interpretou seus decorators.

### Ver Swagger gerado

Abra `src/swagger/swagger.json` para ver a especificação OpenAPI gerada.

### Logs úteis

```typescript
// No controller
console.log('Received:', requestBody);
console.log('Returning:', result);
```

### Validar schema Joi isoladamente

```typescript
const { error, value } = createPersonSchema.validate({
  name: 'Jo',  // Vai falhar (mínimo 3)
  email: 'invalid'  // Vai falhar (email inválido)
});

console.log(error?.details);
```

## 📚 Recursos Úteis

- [Documentação TSOA](https://tsoa-community.github.io/docs/)
- [Joi API](https://joi.dev/api/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎓 Próximos Passos de Aprendizado

1. ✅ Adicione autenticação JWT
2. ✅ Conecte com banco de dados (Prisma/TypeORM)
3. ✅ Implemente paginação e filtros
4. ✅ Adicione testes automatizados (Jest)
5. ✅ Configure Docker
6. ✅ Implemente rate limiting
7. ✅ Adicione logs estruturados (Winston/Pino)

---

**Lembre-se**: A prática leva à perfeição! Experimente, erre, aprenda! 🚀
