import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create statement", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("Should be able to create a new statement", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const userCreated = await usersRepositoryInMemory.create({ ...user });

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: "salário do mês",
    };

    const statementCreated = await createStatementUseCase.execute({
      ...statement,
    });

    expect(statementCreated).toHaveProperty("id");
  });

  it("Should be not able to create a new statement, user not found", async () => {
    const statement: ICreateStatementDTO = {
      user_id: "user",
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: "salário do mês",
    };

    expect(
      createStatementUseCase.execute({
        ...statement,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should be able to create a new statement", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const userCreated = await usersRepositoryInMemory.create({ ...user });

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      type: OperationType.WITHDRAW,
      amount: 5000,
      description: "contas do mês",
    };

    expect(
      createStatementUseCase.execute({
        ...statement,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
