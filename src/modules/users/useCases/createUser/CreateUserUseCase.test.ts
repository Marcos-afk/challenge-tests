import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const userCreated = await createUserUseCase.execute({ ...user });
    expect(userCreated).toHaveProperty("id");
  });

  it("Should be not able to create a new user, email already exists", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const userCreated = await createUserUseCase.execute({ ...user });
    expect(createUserUseCase.execute({ ...user })).rejects.toBeInstanceOf(
      CreateUserError
    );
  });
});
