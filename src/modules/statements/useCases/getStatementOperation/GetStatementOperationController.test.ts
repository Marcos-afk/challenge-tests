import request from "supertest";
import { app } from "../../../../app";
import { AppSource, InitializeConnection } from "../../../../database";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

describe("Get statement operation controller", () => {
  beforeAll(async () => {
    await InitializeConnection();
    await AppSource.runMigrations();
  });

  afterAll(async () => {
    await AppSource.dropDatabase();
    await AppSource.destroy();
  });

  it("Should be able to return a statement operation", async () => {
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

    const response = await request(app)
      .get(`/api/v1/statements/${responseDeposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });
});
