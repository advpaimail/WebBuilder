// Генерирует JWT с role: "postgres" для POSTGREST_API_KEY (.env)
// Запуск: node scripts/gen-postgrest-jwt.cjs
const crypto = require("crypto");
const secret = "jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret";
const payload = {
  iss: "supabase",
  ref: "kmdpixzoqiirabmpdippy",
  role: "postgres",
  iat: Math.floor(Date.now() / 1000),
  exp: 1981912428,
};
const header = { alg: "HS256", typ: "JWT" };
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const sig = crypto.createHmac("sha256", secret).update(b64(header) + "." + b64(payload)).digest("base64url");
const token = b64(header) + "." + b64(payload) + "." + sig;
console.log("POSTGREST_API_KEY=" + token);
console.log("\nСкопируйте строку выше в .env (замените значение POSTGREST_API_KEY).");
