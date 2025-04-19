import { checkEmailAlreadyExist } from "../services/index.js";

const userValidationRules = {
  lastName: {
    in: ["body"],
    isString: {
      errorMessage: "lastName must be a string",
    },
    notEmpty: {
      errorMessage: "lastName is required",
    },
  },
  firstName: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "firstName must be a string",
    },
    notEmpty: {
      errorMessage: "firstName is required",
    },
    errorMessage: "Invalid first name",
  },
  email: {
    in: ["body"],
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
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "password must be a string",
    },
    notEmpty: {
      errorMessage: "password is required",
    },
  },
  gender: {
    in: ["body"],
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
  },
};

const userPatchValidationRules = {
  lastName: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Last name must be a string",
    },
    notEmpty: {
      errorMessage: "Last name is required",
    },
  },
  firstName: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "firstName must be a string",
    },
    notEmpty: {
      errorMessage: "firstName is required",
    },
  },
  email: {
    in: ["body"],
    optional: true,
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
  },
  gender: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "gender cannot be empty if provided",
    },
    isIn: {
      options: [["M", "m", "F", "f"]],
      errorMessage: "gender is 'M' or 'F'",
    },
  },
};

export { userValidationRules, userPatchValidationRules };
