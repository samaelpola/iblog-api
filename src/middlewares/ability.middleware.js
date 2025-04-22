import { defineAbilitiesFor } from "../config/index.js";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { ForbiddenError } from "@casl/ability";

export const checkPermission = (action, getSubject, getFields) => {
  return async (req, res, next) => {
    try {
      const ability = defineAbilitiesFor(req.currentUser || null);
      const subject = await getSubject(req);
      const fields =
        typeof getFields === "function" ? await getFields(req) : null;

      if (fields) {
        for (const field of fields) {
          ForbiddenError.from(ability).throwUnlessCan(action, subject, field);
        }
      } else {
        ForbiddenError.from(ability).throwUnlessCan(action, subject);
      }

      next();
    } catch (e) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ detail: e.message || getReasonPhrase(StatusCodes.FORBIDDEN) });
    }
  };
};
