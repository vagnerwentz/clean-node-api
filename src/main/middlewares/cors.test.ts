import request from "supertest";

import app from "../config/app";

describe("Cors Middleware", () => {
  it("Should enable cors.", async () => {
    app.get("/test_cors", (request, response) => {
      response.send();
    });
    await request(app)
      .get("/test_cors")
      .send({ name: "any_name " })
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-methods", "*")
      .expect("access-control-allow-headers", "*");
  });
});
