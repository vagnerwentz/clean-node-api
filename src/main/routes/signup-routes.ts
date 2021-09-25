import { Router } from "express";

import { adpterRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../factories/signup";

export default (router: Router): void => {
  router.post("/signup", adpterRoute(makeSignUpController()));
};
