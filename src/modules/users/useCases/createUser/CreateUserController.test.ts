import { AppSource, InitializeConnection } from "../../../../database";
import { ICreateUserDTO } from "./ICreateUserDTO";
import request from "supertest";
import { app } from "../../../../app";

describe("Create user controller", () => {
  beforeAll(async () => {
    await InitializeConnection();
    await AppSource.runMigrations();
  });

  afterAll(async () => {
    await AppSource.dropDatabase();
    await AppSource.destroy();
  });

  it("Should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "user test",
      email: "user@email.test",
      password: "12345678",
    };

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        ...user,
      });

    expect(response.status).toBe(201);
  });
});
