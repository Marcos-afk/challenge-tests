import { AppSource, InitializeConnection } from "../../../../database";
import request from "supertest";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

describe("Authenticate user controller", () => {
  beforeAll(async () => {
    await InitializeConnection();
    await AppSource.runMigrations();
  });

  afterAll(async () => {
    await AppSource.dropDatabase();
    await AppSource.destroy();
  });

  it("Should be able to create a new session", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "test@email.test",
      password: "12345678",
    };

    await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
  });
});
