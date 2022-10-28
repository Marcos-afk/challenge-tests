import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferStatementError } from "./CreateStatementError";
import { ITransferStatementDTO } from "./ITransferStatementDTO";
import { OperationType } from "../../entities/Statement";

@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ id, user_id, amount, description }: ITransferStatementDTO) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new TransferStatementError.UserNotFound();
    }

    const transferRecipient = await this.usersRepository.findById(user_id);
    if (!transferRecipient) {
      throw new TransferStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: id,
    });

    if (balance < amount) {
      throw new TransferStatementError.InsufficientFunds();
    }

    const transferStatement = await this.statementsRepository.create({
      user_id: id,
      amount: amount * -1,
      description,
      type: OperationType.TRANSFER,
    });

    const recipientStatement = await this.statementsRepository.create({
      user_id,
      amount,
      description: description,
      type: OperationType.TRANSFER,
      sender_id: id,
    });

    return { transferStatement, recipientStatement };
  }
}
