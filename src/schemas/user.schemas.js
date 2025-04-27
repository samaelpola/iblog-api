import { checkEmailAlreadyExist } from "../services/index.js";
import { AppUserRole } from "../utils/index.js";

const commonStringRule = (fieldName) => ({
  in: ["body"],
  isString: {
    errorMessage: `${fieldName} must be a string`,
  },
  notEmpty: {
    errorMessage: `${fieldName} is required`,
  },
});

const genderValidation = {
  in: ["body"],
  optional: true,
  notEmpty: {
    errorMessage: "gender cannot be empty if provided",
  },
  isString: {
    errorMessage: "gender must be a string",
  },
  isIn: {
    options: [["M", "m", "F", "f"]],
    errorMessage: "gender is 'M' or 'F'",
  },
};

const rolesValidation = {
  in: ["body"],
  optional: true,
  isArray: {
    errorMessage: "roles must be an array",
  },
  custom: {
    options: async (value) => {
      if (value.length === 0) {
        throw new Error("roles cannot be empty");
      }

      value = value.map((role) => role.toUpperCase());
      const invalidRoles = value.filter(
        (role) => ![AppUserRole.USER, AppUserRole.ADMIN].includes(role),
      );

      if (invalidRoles.length > 0) {
        throw new Error(`Invalid roles: ${invalidRoles.join(", ")}`);
      }
    },
  },
  customSanitizer: {
    options: (value) => {
      if (!Array.isArray(value)) {
        return value;
      }

      let upperRoles = value.map((role) => role.toUpperCase());

      if (
        upperRoles.includes(AppUserRole.ADMIN) &&
        !upperRoles.includes(AppUserRole.USER)
      ) {
        upperRoles.push(AppUserRole.USER);
      }

      return upperRoles;
    },
  },
};

const emailValidation = (isOptional = false) => ({
  in: ["body"],
  ...(isOptional ? { optional: true } : {}),
  isEmail: {
    errorMessage: "Invalid email",
  },
  notEmpty: {
    errorMessage: "email is required",
  },
  custom: {
    options: async (value) => {
      if (await checkEmailAlreadyExist(value)) {
        throw new Error(`Email '${value}' already exists`);
      }
    },
    errorMessage: "email already exists",
  },
});

const userValidationRules = {
  lastName: commonStringRule("lastName"),
  firstName: {
    ...commonStringRule("firstName"),
    optional: true,
    errorMessage: "Invalid first name",
  },
  email: emailValidation(),
  password: commonStringRule("password"),
  gender: genderValidation,
  roles: rolesValidation,
  active: {
    in: ["body"],
    optional: true,
    isBoolean: {
      errorMessage: "active must be a boolean",
    },
  },
};

const userPatchValidationRules = {
  lastName: {
    ...commonStringRule("lastName"),
    optional: true,
  },
  firstName: {
    ...commonStringRule("firstName"),
    optional: true,
  },
  email: emailValidation(true),
  gender: genderValidation,
  roles: rolesValidation,
  active: {
    in: ["body"],
    optional: true,
    isBoolean: {
      errorMessage: "active must be a boolean",
    },
  },
};

export { userValidationRules, userPatchValidationRules };
