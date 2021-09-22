import bcrypt from "bcrypt";

import { BcryptAdater } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

describe("Bcrypt Adapter", () => {
  it("Should call bcrypt with correct values.", async () => {
    const SALT = 12;
    const systemUnderTest = new BcryptAdater(SALT);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await systemUnderTest.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
  });

  it("Should return a hash on success.", async () => {
    const SALT = 12;
    const systemUnderTest = new BcryptAdater(SALT);
    const hash = await systemUnderTest.encrypt("any_value");
    expect(hash).toBe("hash");
  });
});
