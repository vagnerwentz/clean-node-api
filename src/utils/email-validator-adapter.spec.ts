import validator from "validator";

import { EmailValidatorAdapter } from "./email-validator-adapter";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidator Adapter", () => {
  it("Should return false if validator returns false.", () => {
    const systemUnderTest = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = systemUnderTest.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });

  it("Should return true if validator returns true.", () => {
    const systemUnderTest = new EmailValidatorAdapter();
    const isValid = systemUnderTest.isValid("invalid_email@mail.com");
    expect(isValid).toBe(true);
  });
});