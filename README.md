## Run the server
`node server.js`

## URLs
- REST: GET http://localhost:4000/api/posts
- GraphQL: POST http://localhost:4001/

## Run the k6 tests
- REST: `k6 run -e ALVO=rest script.js`
- GraphQL (Scenario 1): `k6 run -e ALVO=gq1 script.js`
- GraphQL (Scenario 2): `k6 run -e ALVO=gq2 script.js`
- GraphQL (Scenario 3): `k6 run -e ALVO=gq3 script.js`