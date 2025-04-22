import inquirer from "inquirer";
import {
  checkAdminExist,
  checkEmailAlreadyExist,
  createUser,
} from "../services/index.js";
import { AppUserRole } from "../utils/index.js";

async function createAdmin() {
  try {
    const existingAdmin = await checkAdminExist();
    if (existingAdmin) {
      console.log("🚫 An admin user already exists. Admin creation aborted.");
      process.exit(0);
    }

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "👤 Enter the first name of the admin: ",
      },
      {
        type: "input",
        name: "lastName",
        message: "👤 Enter the last name of the admin: ",
        validate: (input) => (input.trim() ? true : "Last name is required."),
      },
      {
        type: "input",
        name: "email",
        message: "📧 Enter the email of the admin: ",
        validate: async (input) => {
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          if (!emailRegex.test(input.trim())) {
            return "⚠️ Invalid email format. Please provide a valid email.";
          }

          const existingUser = await checkEmailAlreadyExist(input.trim());
          if (existingUser) {
            return "⚠️ This email is already in use. Please provide a different email.";
          }

          return true;
        },
      },
      {
        type: "password",
        name: "password",
        message: "🔑 Enter the password for the admin: ",
        mask: "*",
        validate: (input) =>
          input.length >= 8
            ? true
            : "⚠️ Password must be at least 8 characters long.",
      },
      {
        type: "list",
        name: "gender",
        message: "🚻 Select the gender of the admin: ",
        choices: ["M", "F"],
      },
    ]);

    const adminUser = await createUser({
      firstName: answers.firstName.trim(),
      lastName: answers.lastName.trim(),
      email: answers.email.trim(),
      password: answers.password,
      gender: answers.gender.trim().toUpperCase(),
      roles: [AppUserRole.USER, AppUserRole.ADMIN],
    });

    console.log(
      "\n",
      "🎉 " +
        `Admin user created successfully: ${adminUser.firstName} ${adminUser.lastName}`,
      "\n",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user: ", error);
    process.exit(1);
  }
}

createAdmin();
