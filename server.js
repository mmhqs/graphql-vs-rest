import express from 'express';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import cors from 'cors';

// ==========================================
// 1. BASE DE DADOS EM MEMÓRIA (COMPARTILHADA)
// ==========================================
const mockPosts = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i + 1),
  title: `Post Título Exemplo Número ${i + 1}`,
  content: `Este é o conteúdo detalhado do post número ${i + 1}. Ele foi criado propositalmente com um texto longo para gerar volume de dados e testar a eficiência da rede de forma justa.`,
  author: {
    name: `Autor Nome Sobrenome ${i + 1}`,
    email: `autor.usuario.${i + 1}@provedordeteste.com`,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=Autor${i + 1}`
  },
  comments: [
    { id: "c1", text: "Excelente artigo, me ajudou bastante no trabalho!", user: "Leitor Beta" },
    { id: "c2", text: "Gostei muito da comparação feita pelo autor.", user: "Leitor Alpha" },
    { id: "c3", text: "Tem previsão de novos posts sobre esse assunto?", user: "Leitor Gamma" }
  ]
}));

// ==========================================
// 2. SERVIDOR REST (Express - Porta 4000)
// ==========================================
const restApp = express();
restApp.use(express.json());
restApp.use(cors());

restApp.get('/api/posts', (req, res) => {
  res.json(mockPosts);
});

restApp.listen(4000, () => {
  console.log(`📝 REST rodando em: http://localhost:4000/api/posts`);
});

// ==========================================
// 3. SERVIDOR GRAPHQL (Standalone - Porta 4001)
// ==========================================
const typeDefs = `#graphql
  type Author {
    name: String
    email: String
    avatar: String
  }

  type Comment {
    id: ID
    text: String
    user: String
  }

  type Post {
    id: ID
    title: String
    content: String
    author: Author
    comments: [Comment]
  }

  type Query {
    posts: [Post]
  }
`;

const resolvers = {
  Query: {
    posts: () => mockPosts,
  },
};

const gqServer = new ApolloServer({ typeDefs, resolvers });

// Inicializa o GraphQL de forma totalmente independente na porta 4001
const { url } = await startStandaloneServer(gqServer, {
  listen: { port: 4001 },
});

console.log(`📊 GraphQL rodando em: ${url}`);