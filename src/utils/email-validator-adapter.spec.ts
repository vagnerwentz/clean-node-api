import { EmailValidatorAdapter } from "./email-validator-adapter";

describe("EmailValidator Adapter", () => {
  it("Should return false if validator returns false.", () => {
    const systemUnderTest = new EmailValidatorAdapter();
    const isValid = systemUnderTest.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
});
