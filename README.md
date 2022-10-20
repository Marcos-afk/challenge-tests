# Tests challenge

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

// Concluindo a instalação rode

yarn test(rodar testes)
yarn dev(iniciar o servidor)
```

### :heavy_check_mark: Testes da aplicação

Users

- [x] Should be able to create a new user
- [x] Should be not able to create a new user, email already exists
- [x] should be able to create a new session
- [x] Should be not able to create a new session, invalid email
- [x] Should be not able to create a new session, invalid password
- [x] Should be able to return a user
- [x] Should be not able to return a user, user not found

Statements

- [x] Should be able to create a new statement
- [x] Should be not able to create a new statement, user not found
- [x] Should be not able to create a new statement, Insufficient funds
- [x] Should be able to return a balance to a user
- [x] Should be not able to return a balance to a user, user not found
- [x] Should be able to return a statement operation
- [x] Should be not able to return a statement operation, user not found
- [x] Should be not able to return a statement operation, statement operation not found
