import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

export class TransferStatementController {
  async handle(req: Request, res: Response) {
    const { id } = req.user;
    const { user_id } = req.params;
    const { amount, description } = req.body;

    const transferStatementUseCase = container.resolve(
      TransferStatementUseCase
    );

    const { transferStatement, recipientStatement } =
      await transferStatementUseCase.execute({
        id,
        user_id,
        amount,
        description,
      });

    return res.status(200).json({ transferStatement, recipientStatement });
  }
}
