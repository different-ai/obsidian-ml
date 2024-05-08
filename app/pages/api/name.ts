import type { NextApiRequest, NextApiResponse } from "next";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { models } from "@/lib/models";

type ResponseData = {
  name?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      console.log(process.env.MODEL_NAME, "name");
      const model = models[process.env.MODEL_NAME || "gpt-4-turbo"];
      if (!model) {
        throw new Error(`Model ${process.env.MODEL_NAME} not found`);
      }
      const name = await generateText({
        model,
        prompt: `Give a name to this document:
${req.body.document} should only be 30 chars long max. only answer with the name nothing else.`,
      });
      console.log({ name });
      console.log(name.text, "name.text");

      res.status(200).json({ name: name.text });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        console.log("Invalid OpenAI API key");
        res.status(401).json({ message: "Invalid API key" });
      } else {
        res.status(500).json({ message: "Error" });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
