#!/usr/bin/env node
// Run: node scripts/get-google-refresh-token.mjs
// Walks you through Google OAuth to get a refresh token for Drive access.

import { createServer } from "http";
import { google } from "googleapis";
import readline from "readline";

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
const REDIRECT_URI = "http://localhost:3456/oauth2callback";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

console.log("\n=== Google Drive OAuth Setup ===\n");
console.log("You need an OAuth 2.0 client from Google Cloud Console.");
console.log("Make sure http://localhost:3456/oauth2callback is in your authorized redirect URIs.\n");

const clientId = await ask("Paste your GOOGLE_CLIENT_ID: ");
const clientSecret = await ask("Paste your GOOGLE_CLIENT_SECRET: ");

const auth = new google.auth.OAuth2(clientId.trim(), clientSecret.trim(), REDIRECT_URI);

const authUrl = auth.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);
console.log("\nWaiting for Google to redirect back...\n");

// Spin up a temporary server to catch the callback
const code = await new Promise((resolve, reject) => {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost:3456");
    const code = url.searchParams.get("code");
    if (code) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h2>Done! You can close this tab and go back to your terminal.</h2>");
      server.close();
      resolve(code);
    } else {
      res.writeHead(400);
      res.end("No code found.");
      reject(new Error("No code in callback"));
    }
  });
  server.listen(3456);
  server.on("error", reject);
});

const { tokens } = await auth.getToken(code);

console.log("\n=== SUCCESS ===\n");
console.log("Add these to Vercel:\n");
console.log(`GOOGLE_CLIENT_ID=${clientId.trim()}`);
console.log(`GOOGLE_CLIENT_SECRET=${clientSecret.trim()}`);
console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
console.log("\nThen run:");
console.log("  vercel env add GOOGLE_REFRESH_TOKEN production");

rl.close();
