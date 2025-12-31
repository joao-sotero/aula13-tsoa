// Importa a aplicação Express configurada
import app from './app';

// Define a porta do servidor
// Usa a variável de ambiente PORT ou 3333 como padrão
const port = Number(process.env.PORT ?? 3333);

// Inicia o servidor HTTP
app.listen(port, () => {
    console.log(`🚀 Server ready on port ${port}`);
    console.log(`📖 Swagger docs: http://localhost:${port}/api-docs`);
});
