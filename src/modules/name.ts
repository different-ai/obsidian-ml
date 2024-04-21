import { requestUrl } from "obsidian";
import { logMessage } from "../../utils";

async function useName(document, { baseUrl, apiKey }) {
  const data = {
    // move model to plugin settings
    document: document,
  };
  const endpoint = "api/name";
  const url = `${baseUrl}/${endpoint}`;
  logMessage("log url", url);
  const response = await requestUrl({
    url: url,
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const result = await response.json;
  logMessage("name result", result.choices[0].message.content);
  return result.choices[0].message.content.trim();
}

export default useName;
