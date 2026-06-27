import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

function decodeBase64Text(fileBase64: string) {
  return Buffer.from(fileBase64, "base64").toString("utf8");
}

function isTextMimeType(mimeType: string) {
  return mimeType === "text/plain" || mimeType === "text/markdown";
}

function isImageMimeType(mimeType: string) {
  return mimeType.startsWith("image/");
}

export async function parseDocument(fileBase64: string, mimeType: string): Promise<string> {
  if (isTextMimeType(mimeType)) {
    return decodeBase64Text(fileBase64);
  }

  const anthropic = getAnthropic();
  if (!anthropic) {
    throw new Error("Anthropic API key not configured");
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const content: any[] = [
    {
      type: "text",
      text: "Extract all readable text from this file. Return plain text only. Preserve paragraph breaks where they are materially meaningful.",
    },
  ];

  if (mimeType === "application/pdf") {
    content.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: fileBase64,
      },
    });
  } else if (isImageMimeType(mimeType)) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mimeType,
        data: fileBase64,
      },
    });
  } else {
    throw new Error(`Unsupported document mimeType: ${mimeType}`);
  }

  const message = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: "user", content }],
  });

  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}
