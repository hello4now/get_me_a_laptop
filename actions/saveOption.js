// actions/saveOption.js
"use server";

import fs from "fs";
import path from "path";

export async function saveOption(option) {
  const filePath = path.join(process.cwd(), "data", "options.txt");

  try {
    fs.appendFileSync(filePath, `${option}\n`);
    return { message: "Option saved successfully" };
  } catch (error) {
    return { message: "Failed to save option" };
  }
}
