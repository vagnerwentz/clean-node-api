import validator from "validator";

import { EmailValidatorAdapter } from "./email-validator-adapter";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSystemUnderTest = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("EmailValidator Adapter", () => {
  it("Should return false if validator returns false.", () => {
    const systemUnderTest = makeSystemUnderTest();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = systemUnderTest.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });

  it("Should return true if validator returns true.", () => {
    const systemUnderTest = makeSystemUnderTest();
    const isValid = systemUnderTest.isValid("invalid_email@mail.com");
    expect(isValid).toBe(true);
  });

  it("Should call validator with correct email.", () => {
    const systemUnderTest = makeSystemUnderTest();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    systemUnderTest.isValid("any_email@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
