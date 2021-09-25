import request from "supertest";

import app from "../config/app";

describe("SignUp Routes", () => {
  it("Should return an account on success.", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "valid_name",
        email: "valid_email",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      })
      .expect(200);
  });
});
