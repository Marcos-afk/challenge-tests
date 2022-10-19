# Database queries challenge

Desafio 04 do conteúdo estudado nas aulas do Chapter IV da trilha de NodeJS do Bootcamp Ignite da Rocketseat

## :hammer_and_wrench: Ferramentas

- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cors](https://www.npmjs.com/package/cors)
- [docker](https://docs.docker.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-async-errors](https://www.npmjs.com/package/express-async-errors)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodejs](https://nodejs.org/en/docs/)
- [typescript](https://www.typescriptlang.org/)
- [ts-jest](https://www.npmjs.com/package/ts-jest)
- [tsyringe](https://www.npmjs.com/package/tsyringe)
- [typeorm](https://www.npmjs.com/package/typeorm)
- [jest](https://jestjs.io/pt-BR/)
- [uuid](https://www.npmjs.com/package/uuid)

## :desktop_computer: Padronização de código

- [editorconfig](https://EditorConfig.org)

## :rocket: Executando o projeto

```bash
// Instale as dependências

yarn install

// Se você não possui um container do Docker rodando o Postgres, é possível criá-lo com seguinte comando:

docker run --name ignite-challenge-database -e POSTGRES_DB=queries_challenge -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

// Concluindo a instalação rode

yarn test(rodar testes)
yarn dev(iniciar o servidor)
```

### :heavy_check_mark: Testes da aplicação

Users

- [x] Should be able to create a new user
- [o] Should be not able to create a new user, email already exists
- [o] should be able to create a new session
- [o] Should be not able to create a new session, invalid email
- [o] Should be not able to create a new session, invalid password
- [x] Should be able to return a user
- [x] Should be not able to return a user, user not found

Statements

- [o] Should be able to create a new statement
- [o] Should be not able to create a new statement, user not found
- [o] Should be not able to create a new statement, Insufficient funds
- [o] Should be able to return a balance to a user
- [o] Should be not able to return a balance to a user, user not found
- [o] Should be able to return a statement operation
- [o] Should be not able to return a statement operation, user not found
- [o] Should be not able to return a statement operation, statement operation not found
