import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SystemUnderTestTypes {
  systemUnderTest: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const encrypterStub = makeEncrypter();
  const systemUnderTest = new DbAddAccount(encrypterStub);

  return {
    systemUnderTest,
    encrypterStub,
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
});
