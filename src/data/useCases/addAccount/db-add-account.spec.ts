import { DbAddAccount } from "./db-add-account";
import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";

interface SystemUnderTestTypes {
  systemUnderTest: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const systemUnderTest = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub
  );

  return {
    systemUnderTest,
    encrypterStub,
    addAccountRepositoryStub,
  };
};
describe("DbAddAccount UseCase", () => {
  it("Should call Encrypter with correct password.", async () => {
    const { systemUnderTest, encrypterStub } = makeSystemUnderTest();
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    await systemUnderTest.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  it("Should throw if Encrypter throws.", async () => {
    const { systemUnderTest, encrypterStub } = makeSystemUnderTest();
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = systemUnderTest.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("Should call AddAccountRepository with correct values.", async () => {
    const { systemUnderTest, addAccountRepositoryStub } = makeSystemUnderTest();
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    await systemUnderTest.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
  });

  it("Should throw if AddAccountRepository throws.", async () => {
    const { systemUnderTest, addAccountRepositoryStub } = makeSystemUnderTest();
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = systemUnderTest.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("Should return an account on success.", async () => {
    const { systemUnderTest } = makeSystemUnderTest();
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const account = await systemUnderTest.add(accountData);
    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
  });
});
