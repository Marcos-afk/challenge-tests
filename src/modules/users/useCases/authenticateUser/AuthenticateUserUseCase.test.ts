import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to create a new session", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    await createUserUseCase.execute({ ...user });

    const session = await authenticateUserUseCase.execute({
      ...user,
    });

    expect(session).toHaveProperty("token");
  });

  it("Should be not able to create a new session, invalid email", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    expect(
      authenticateUserUseCase.execute({
        ...user,
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should be not able to create a new session, invalid password", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    await createUserUseCase.execute({ ...user });

    expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "teste",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
