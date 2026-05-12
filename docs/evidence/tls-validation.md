# TLS Validation Checklist

Public hostname: `https://54-72-107-165.sslip.io`
EC2 Elastic IP: `54.72.107.165`
Validated: 2026-05-12

---

## Checklist

- [x] **Casdoor login flow completes from the public URL**
  — Logged in as `user` / `pswd123` via Casdoor SSO. No `Secure cookie` or `redirect_uri` errors.
  — Evidence: `lobechat-https.png` (browser shows "Connection is secure" popup + LobeChat home page post-login).

- [x] **LobeChat chat streaming works**
  — Sent "Use the filesystem tool to list the allowed directories". Response tokens arrived incrementally via SSE.
  — Evidence: `chat-mcp.png` (full streamed response visible from `meta-llama/llama-4-scout`).

- [x] **At least one MCP tool invoked from chat returns a result**
  — `MCPHub Filesystem → filesystem-list_allowed_directories` called and returned `/`.
  — Evidence: `chat-mcp.png` (MCPHub Filesystem tool call + result rendered in chat).

- [x] **File upload to MinIO from chat works**
  — Uploaded `devops_session1_study_guide.pdf` (294.7 KB) via LobeChat paperclip. Model read and summarised the file.
  — Evidence: `file-upload.png` (PDF shown in chat, model response visible).

- [x] **Direct connection to EC2 origin on port 47000 is rejected**
  — `curl -v --max-time 5 http://54.72.107.165:47000/` timed out after 5006 ms. Security Group blocks all ports except 80/443.
  — Evidence: `REPORT.md` section 6 (full curl output with timestamp).

- [x] **Browser shows a valid certificate chain on the public hostname**
  — Chrome shows "Connection is secure" with padlock. Certificate issued by Let's Encrypt via Caddy ACME.
  — Evidence: `lobechat-https.png` (Chrome security popup open showing "Connection is secure").
