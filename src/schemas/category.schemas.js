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
  slug: {
    in: ["body"],
    isString: {
      errorMessage: "slug must be a string",
    },
    notEmpty: {
      errorMessage: "slug is required",
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
  slug: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "slug must be a string",
    },
    notEmpty: {
      errorMessage: "slug is required",
    },
  },
};

export { categoryValidationRules, categoryPatchValidationRules };
