import {
  checkTitleAlreadyExist,
  getCategory,
  getUser,
} from "../services/index.js";

const articleValidationRules = {
  title: {
    in: ["body"],
    notEmpty: {
      errorMessage: "title is required",
    },
    isString: {
      errorMessage: "title must be a string",
    },
    custom: {
      options: async (value) => {
        if (await checkTitleAlreadyExist(value)) {
          throw new Error(`article with title '${value}' already exists`);
        }
      },
      errorMessage: "title already exists",
    },
  },
  description: {
    in: ["body"],
    notEmpty: {
      errorMessage: "description is required",
    },
    isString: {
      errorMessage: "description must be a string",
    },
  },
  shortDescription: {
    in: ["body"],
    notEmpty: {
      errorMessage: "short description is required",
    },
    isString: {
      errorMessage: "short description must be a string",
    },
  },
  categoryId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "categoryId is required",
    },
    custom: {
      options: async (value, { req }) => {
        const category = await getCategory(value);

        if (!category) {
          throw new Error(`category '${value}' not found`);
        }

        req.category = category;
      },
    },
  },
  authorId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "authorId is required",
    },
    custom: {
      options: async (value, { req }) => {
        const user = await getUser(value);

        if (!user) {
          throw new Error(`user '${value}' not found`);
        }

        req.author = user;
      },
    },
  },
};

const articlePatchValidationRules = {
  title: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "title is required",
    },
    isString: {
      errorMessage: "title must be a string",
    },
    custom: {
      options: async (value) => {
        if (await checkTitleAlreadyExist(value)) {
          throw new Error(`article with title '${value}' already exists`);
        }
      },
      errorMessage: "title already exists",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "description is required",
    },
    isString: {
      errorMessage: "description must be a string",
    },
  },
  shortDescription: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "short description is required",
    },
    isString: {
      errorMessage: "short description must be a string",
    },
  },
  categoryId: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "categoryId is required",
    },
    custom: {
      options: async (value, { req }) => {
        const category = await getCategory(value);

        if (!category) {
          throw new Error(`category '${value}' not found`);
        }

        req.category = category;
      },
    },
  },
  authorId: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "authorId is required",
    },
    custom: {
      options: async (value, { req }) => {
        const user = await getUser(value);

        if (!user) {
          throw new Error(`user '${value}' not found`);
        }

        req.author = user;
      },
    },
  },
};

export { articleValidationRules, articlePatchValidationRules };
