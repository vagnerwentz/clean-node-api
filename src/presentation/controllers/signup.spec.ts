import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { EmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup";

interface SystemUnderTestTypes {
  systemUnderTest: SignUpController;
  emailValidatorStub: EmailValidator;
}
const makeSystemUnderTest = (): SystemUnderTestTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const systemUnderTest = new SignUpController(emailValidatorStub);

  return {
    systemUnderTest,
    emailValidatorStub,
  };
};

describe("SignUp Controller", () => {
  it("Should return 400 if no name is provided.", () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("Should return 400 if no email is provided.", () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("Should return 400 if no password is provided.", () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("Should return 400 if no password confirmation is provided.", () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };

    const httpResponse = systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  it("Should return 400 if an invalid email is provided.", () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpResponse = systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
});
