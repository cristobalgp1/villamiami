// Password gate. Active only when the SITE_PASSWORD environment variable is set in Netlify.
const COOKIE = "lds_auth";
const MAX_AGE = 60 * 60 * 24 * 30;

async function tokenFor(pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("lds-villa-miami:" + pw));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? m[1] : null;
}

function loginPage(error) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow">
<title>Villa Miami × Lacruz Design Studio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;1,300&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#211C15;color:#F6F4EF;font-family:'Newsreader',serif;height:100vh;display:flex;align-items:center;justify-content:center;-webkit-font-smoothing:antialiased}
.box{width:100%;max-width:380px;padding:0 32px;text-align:center}.box img{height:51px;width:auto;display:block;margin:0 auto 8px}
.label{display:block;font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:#C97C43;margin-bottom:32px}
input{width:100%;background:transparent;border:none;border-bottom:1px solid #877D6A;color:#F6F4EF;font-family:'Newsreader',serif;font-size:22px;padding:8px 0;text-align:center;outline:none;margin-bottom:32px}
input:focus{border-bottom-color:#C97C43}input::placeholder{color:#877D6A;font-style:italic}
button{background:none;border:1px solid #C9A583;color:#F6F4EF;font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;padding:14px 36px;cursor:pointer;transition:background 220ms,border-color 220ms}
button:hover{background:#A8683D;border-color:#A8683D}.err{margin-top:24px;font-style:italic;color:#C9A583;font-size:15px}</style></head>
<body><form class="box" method="POST" action="/__login">
<img src="/assets/lds-logo-transparent-white.webp" alt="Lacruz Design Studio">
<span class="label">Villa Miami · Private Preview</span>
<input type="password" name="password" placeholder="Password" autofocus required autocomplete="current-password">
<button type="submit">Enter</button>
${error ? '<p class="err">Incorrect password · Contraseña incorrecta</p>' : ""}
</form></body></html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function redirect(to, cookie) {
  const headers = new Headers({ Location: to, "cache-control": "no-store" });
  if (cookie) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
}

export default async (request, context) => {
  const password = Netlify.env.get("SITE_PASSWORD");
  if (!password) return context.next();

  const url = new URL(request.url);
  const token = await tokenFor(password);

  if (url.pathname === "/logout") {
    return redirect("/", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  }

  if (url.pathname === "/__login" && request.method === "POST") {
    const form = await request.formData();
    if (form.get("password") === password) {
      return redirect("/", `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`);
    }
    return loginPage(true);
  }

  if (readCookie(request, COOKIE) === token) return context.next();
  return loginPage(false);
};

export const config = {
  path: "/*",
  excludedPath: ["/assets/lds-logo-transparent-white.webp", "/robots.txt"],
};
