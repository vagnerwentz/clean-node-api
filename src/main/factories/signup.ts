import { DbAddAccount } from "../../data/useCases/addAccount/db-add-account";
import { BcryptAdater } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/database/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdater = new BcryptAdater(salt);
  const dbAddAccount = new DbAddAccount(bcryptAdater, accountMongoRepository);
  return new SignUpController(emailValidator, dbAddAccount);
};
