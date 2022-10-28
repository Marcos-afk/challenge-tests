import request from "supertest";
import { app } from "../../../../app";
import { AppSource, InitializeConnection } from "../../../../database";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

describe("Create transfer statement controller", () => {
  beforeAll(async () => {
    await InitializeConnection();
    await AppSource.runMigrations();
  });

  afterAll(async () => {
    await AppSource.dropDatabase();
    await AppSource.destroy();
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

    const senderCreated = await request(app).post("/api/v1/users").send({
      name: sender.name,
      email: sender.email,
      password: sender.password,
    });

    const receiverCreated = await request(app).post("/api/v1/users").send({
      name: receiver.name,
      email: receiver.email,
      password: receiver.password,
    });

    const senderToken = await request(app).post("/api/v1/sessions").send({
      email: sender.email,
      password: sender.password,
    });

    const receiverToken = await request(app).post("/api/v1/sessions").send({
      email: receiver.email,
      password: receiver.password,
    });

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "salário",
      })
      .set({
        Authorization: `Bearer ${senderToken.body.token}`,
      });

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "salário",
      })
      .set({
        Authorization: `Bearer ${receiverToken.body.token}`,
      });

    const test = await request(app)
      .post(`/api/v1/statements/transfer/${receiverCreated.body.id}`)
      .send({
        amount: 400,
        description: "aluguel",
      })
      .set({
        Authorization: `Bearer ${senderToken.body.token}`,
      });

    const senderBalance = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${senderToken.body.token}`,
      });

    const receiverBalance = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${receiverToken.body.token}`,
      });

    expect(senderBalance.body.balance).toBe(100);
    expect(receiverBalance.body.balance).toBe(900);
  });
});
