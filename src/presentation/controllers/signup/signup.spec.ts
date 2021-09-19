import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import { SignUpController } from "./signup";
import {
  EmailValidator,
  AddAccount,
  AccountModel,
  AddAccountModel,
} from "./signup-protocols";

interface SystemUnderTestTypes {
  systemUnderTest: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountStub();
};

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const systemUnderTest = new SignUpController(
    emailValidatorStub,
    addAccountStub
  );

  return {
    addAccountStub,
    systemUnderTest,
    emailValidatorStub,
  };
};

describe("SignUp Controller", () => {
  it("Should return 400 if no name is provided.", async () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("Should return 400 if no email is provided.", async () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("Should return 400 if no password is provided.", async () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("Should return 400 if no password confirmation is provided.", async () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  it("Should return 400 if password confirmation fails.", async () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "invalid_password",
      },
    };

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  it("Should return 400 if an invalid email is provided.", async () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValue(false);

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  it("Should call EmailValidator with correct email.", async () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    await systemUnderTest.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("Should return 500 if EmailValidator throws.", async () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
    });

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("Should return 500 if AddAccount throws.", async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    jest.spyOn(addAccountStub, "add").mockImplementation(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("Should call AddAccount with correct values.", async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const addSpy = jest.spyOn(addAccountStub, "add");

    await systemUnderTest.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  it("Should return 200 if valid data is provided.", async () => {
    const { systemUnderTest } = makeSystemUnderTest();

    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      },
    };

    const httpResponse = await systemUnderTest.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    });
  });
});
