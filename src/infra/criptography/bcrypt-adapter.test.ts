import bcrypt from "bcrypt";

import { BcryptAdater } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const SALT = 12;

const makeSystemUnderTest = (): BcryptAdater => {
  return new BcryptAdater(SALT);
};

describe("Bcrypt Adapter", () => {
  it("Should call bcrypt with correct values.", async () => {
    const systemUnderTest = makeSystemUnderTest();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await systemUnderTest.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
  });

  it("Should return a hash on success.", async () => {
    const systemUnderTest = makeSystemUnderTest();
    const hash = await systemUnderTest.encrypt("any_value");
    expect(hash).toBe("hash");
  });

  it("Should throw if bcrypt throws.", async () => {
    const systemUnderTest = makeSystemUnderTest();
    jest
      .spyOn(bcrypt, "hash")
      .mockReturnValueOnce(
        new Promise((resovle, reject) => reject(new Error())) as any
      );
    const promise = systemUnderTest.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
