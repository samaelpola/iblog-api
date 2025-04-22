import { User } from "../models/index.js";
import bcrypt from "bcrypt";

const getByEmail = async (email) => {
  return await User.findOne({
    where: {
      email: email,
    },
  });
};

const checkEmailAlreadyExist = async (userEmail) => {
  const user = await getByEmail(userEmail);

  return user !== null;
};

const hashPassword = async (password) => {
  const saltRounds = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const verifyCredentials = async (credentials) => {
  const user = await getByEmail(credentials.email);
  if (!user) {
    return null;
  }

  const isPasswordMatched = await comparePasswords(
    credentials.password,
    user.password,
  );

  return isPasswordMatched ? user : null;
};

const getUsers = async () => {
  return await User.findAll();
};

const getUser = async (userId) => {
  return await User.findByPk(userId, { include: { all: true } });
};

const createUser = async (user) => {
  return await User.create({ ...user, gender: user.gender.toUpperCase() });
};

const deleteUser = async (user) => {
  await user.destroy();
};

const updateUser = async (user, data) => {
  if (Object.prototype.hasOwnProperty.call(data, "lastName")) {
    user.lastName = data.lastName;
  }

  if (Object.prototype.hasOwnProperty.call(data, "firstName")) {
    user.firstName = data.firstName;
  }

  if (Object.prototype.hasOwnProperty.call(data, "email")) {
    user.email = data.email;
  }

  if (Object.prototype.hasOwnProperty.call(data, "gender")) {
    user.gender = data.gender.toUpperCase();
  }

  if (Object.prototype.hasOwnProperty.call(data, "roles")) {
    user.roles = data.roles;
  }

  await user.save();
  await user.reload();
  return user;
};

export {
  checkEmailAlreadyExist,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  hashPassword,
  verifyCredentials,
  comparePasswords,
};
