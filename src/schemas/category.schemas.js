import { checkNameAlreadyExist } from "../services/index.js";

const categoryValidationRules = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "name is required",
    },
    isString: {
      errorMessage: "name must be a string",
    },
    custom: {
      options: async (value) => {
        if (await checkNameAlreadyExist(value)) {
          throw new Error(`Category name '${value}' already exists`);
        }
      },
      errorMessage: "Category name already exists",
    },
  },
  key: {
    in: ["body"],
    isString: {
      errorMessage: "key must be a string",
    },
    notEmpty: {
      errorMessage: "key is required",
    },
  },
};

const categoryPatchValidationRules = {
  name: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "name is required",
    },
    isString: {
      errorMessage: "name must be a string",
    },
    custom: {
      options: async (value) => {
        if (await checkNameAlreadyExist(value)) {
          throw new Error(`Category name '${value}' already exists`);
        }
      },
      errorMessage: "Category name already exists",
    },
  },
  key: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "key must be a string",
    },
    notEmpty: {
      errorMessage: "key is required",
    },
  },
};

export { categoryValidationRules, categoryPatchValidationRules };
