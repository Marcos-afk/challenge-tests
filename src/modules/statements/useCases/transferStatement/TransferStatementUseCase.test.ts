import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { TransferStatementError } from "./CreateStatementError";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

let transferStatementUseCase: TransferStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Transfer Statement", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    transferStatementUseCase = new TransferStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able to transfer a statement", async () => {
    const sender: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const receiver: ICreateUserDTO = {
      name: "user test 2",
      email: "user2@email.test",
      password: "12345678",
    };

    const senderCreated = await usersRepositoryInMemory.create({ ...sender });
    const receiverCreated = await usersRepositoryInMemory.create({
      ...receiver,
    });

    const senderStatement: ICreateStatementDTO = {
      user_id: senderCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: "salário do mês",
    };

    const receiverStatement: ICreateStatementDTO = {
      user_id: receiverCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "salário do mês",
    };

    await statementsRepositoryInMemory.create({
      ...senderStatement,
    });

    await statementsRepositoryInMemory.create({
      ...receiverStatement,
    });

    const { transferStatement, recipientStatement } =
      await transferStatementUseCase.execute({
        id: senderCreated.id as string,
        user_id: receiverCreated.id as string,
        amount: 4000,
        description: "aluguel",
      });

    const senderBalancer = await getBalanceUseCase.execute({
      user_id: senderCreated.id as string,
    });

    const receiverBalancer = await getBalanceUseCase.execute({
      user_id: receiverCreated.id as string,
    });

    expect(senderBalancer.balance).toBe(senderStatement.amount - 4000);
    expect(receiverBalancer.balance).toBe(receiverStatement.amount + 4000);
  });

  it("Should be not able to transfer a statement, sender not found", async () => {
    expect(
      transferStatementUseCase.execute({
        id: "test",
        user_id: "test",
        amount: 4000,
        description: "aluguel",
      })
    ).rejects.toBeInstanceOf(TransferStatementError.UserNotFound);
  });

  it("Should be not able to transfer a statement, receiver not found", async () => {
    const sender: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const senderCreated = await usersRepositoryInMemory.create({ ...sender });

    const statement: ICreateStatementDTO = {
      user_id: senderCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: "salário do mês",
    };

    await statementsRepositoryInMemory.create({
      ...statement,
    });

    expect(
      transferStatementUseCase.execute({
        id: senderCreated.id as string,
        user_id: "test",
        amount: 4000,
        description: "aluguel",
      })
    ).rejects.toBeInstanceOf(TransferStatementError.UserNotFound);
  });

  it("Should be not able to transfer a statement, insufficient founds", async () => {
    const sender: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const receiver: ICreateUserDTO = {
      name: "user test 2",
      email: "user2@email.test",
      password: "12345678",
    };

    const senderCreated = await usersRepositoryInMemory.create({ ...sender });
    const receiverCreated = await usersRepositoryInMemory.create({
      ...receiver,
    });

    const statement: ICreateStatementDTO = {
      user_id: senderCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: "salário do mês",
    };

    await statementsRepositoryInMemory.create({
      ...statement,
    });

    expect(
      transferStatementUseCase.execute({
        id: senderCreated.id as string,
        user_id: receiverCreated.id as string,
        amount: 6000,
        description: "aluguel",
      })
    ).rejects.toBeInstanceOf(TransferStatementError.InsufficientFunds);
  });
});
