import database from "infra/database.js";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();
    const dependencies = await database.status();

    response
      .status(200)
      .json({ updated_at: updatedAt, dependencies: dependencies });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export default status;
