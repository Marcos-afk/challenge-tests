import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able to return a balance to a user", async () => {
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

    const getBalance = await getBalanceUseCase.execute({
      user_id: userCreated.id as string,
    });

    expect(getBalance.statement).toEqual([statementCreated]);
  });

  it("Should be not able to return a balance to a user, user not found", async () => {
    expect(
      getBalanceUseCase.execute({
        user_id: "teste",
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
