import request from "supertest";
import { app } from "../../../../app";
import { AppSource, InitializeConnection } from "../../../../database";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

describe("Create statement controller", () => {
  beforeAll(async () => {
    await InitializeConnection();
    await AppSource.runMigrations();
  });

  afterAll(async () => {
    await AppSource.dropDatabase();
    await AppSource.destroy();
  });

  it("Should be able to create a new statement", async () => {
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

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 162,
        description: "salário",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseWithdraw = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "contas",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseDeposit.status).toBe(201);
    expect(responseWithdraw.status).toBe(201);
  });
});
