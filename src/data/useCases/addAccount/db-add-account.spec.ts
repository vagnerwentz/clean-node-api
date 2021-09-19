import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SystemUnderTestTypes {
  systemUnderTest: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  const encrypterStub = new EncrypterStub();
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
});
