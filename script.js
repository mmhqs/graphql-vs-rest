import http from 'k6/http';

// Captura o cenário enviado pelo terminal. Se não enviar nada, o padrão será 'rest'
const cenarioEscolhido = __ENV.ALVO || 'rest';

// Mapeamento das funções de execução atualizado
const mapeamentoFuncoes = {
  'rest': 'testarREST',
  'gq1':  'testarGraphQLCenario1', // Leve
  'gq2':  'testarGraphQLCenario2', // Intermediário (Antigo Cênario 3)
  'gq3':  'testarGraphQLCenario3'  // Crítico/Completo (Antigo Cenário 2)
};

export const options = {
  scenarios: {
    // 1. Fase de Aquecimento (Sempre roda primeiro)
    aquecimento: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 50,
      exec: mapeamentoFuncoes[cenarioEscolhido],
      startTime: '0s',
    },
    // 2. Fase do Teste Oficial (Começa logo após o aquecimento)
    teste_oficial: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1000,
      exec: mapeamentoFuncoes[cenarioEscolhido],
      startTime: '5s',
    },
  },
};

// ==========================================
// FUNÇÕES DE REQUISIÇÃO (ORDEM REORGANIZADA)
// ==========================================

// ---- REST (Sempre busca tudo) ----
export function testarREST() {
  http.get('http://localhost:4000/api/posts', {
    tags: { name: 'REST_Completo' },
  });
}

// ---- GRAPHQL 1: LEVE (Feed Reduzido) ----
export function testarGraphQLCenario1() {
  const payload = JSON.stringify({ query: 'query { posts { id title } }' });
  http.post('http://localhost:4001/', payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'GraphQL_Cenario_1_Leve' },
  });
}

// ---- GRAPHQL 2: INTERMEDIÁRIO (Painel Híbrido) ----
export function testarGraphQLCenario2() {
  const payload = JSON.stringify({
    query: 'query { posts { title author { name } } }' // Dados parciais e uma relação
  });
  http.post('http://localhost:4001/', payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'GraphQL_Cenario_2_Intermediario' },
  });
}

// ---- GRAPHQL 3: CRÍTICO (Feed Detalhado/Tudo) ----
export function testarGraphQLCenario3() {
  const payload = JSON.stringify({
    query: 'query { posts { id title content author { name email avatar } comments { id text user } } }' // Equivalente ao REST
  });
  http.post('http://localhost:4001/', payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'GraphQL_Cenario_3_Critico' },
  });
}