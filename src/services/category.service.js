import { Category } from "../models/index.js";

const checkNameAlreadyExist = async (categoryName) => {
  const category = await Category.findOne({
    where: {
      name: categoryName,
    },
  });

  return category !== null;
};

const getCategories = async (limit = null) => {
  return await Category.findAll({
    order: [["createdAt", "DESC"]],
    ...(limit && { limit }),
  });
};

const getCategory = async (categoryId) => {
  return await Category.findByPk(categoryId, { include: { all: true } });
};

const createCategory = async (category) => {
  return await Category.create({ ...category });
};

const deleteCategory = async (category) => {
  await category.destroy();
  return { detail: "category delete" };
};

const updateCategory = async (category, data) => {
  if (Object.prototype.hasOwnProperty.call(data, "name")) {
    category.name = data.name;
  }

  if (Object.prototype.hasOwnProperty.call(data, "slug")) {
    category.slug = data.slug;
  }

  await category.save();
  await category.reload();
  return category;
};

export {
  checkNameAlreadyExist,
  createCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
};
