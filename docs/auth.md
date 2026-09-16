# 🔐 Sistem Autentikasi & Keamanan Admin — LPM UIN SGD

Sistem autentikasi menggunakan **NextAuth.js v5 (Credentials Provider)** dengan skema JWT.

---

## 🛡️ Lapisan Keamanan (10-Layer Protection)

1. **Password Hashing:** `bcryptjs` dengan salt round 12.
2. **Brute-Force Guard:** Rate limiter login (maksimal 5x percobaan gagal per 15 menit per IP).
3. **Session Strategy:** Stateless JWT Cookie dengan maxAge 8 jam (1 hari kerja).
4. **Cookie Security:** `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (pada production).
5. **Middleware Protection:** Intersepsi halaman `/admin/dashboard/*` secara otomatis via Next.js Middleware.
6. **SQL Injection Guard:** Parameterized query via Drizzle ORM.
7. **XSS Protection:** Output sanitization & TipTap HTML parser.
8. **CSRF Protection:** Token verification bawaan dari NextAuth.
9. **HTTP Security Headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP.
10. **Audit Logging:** Setiap login & operasi data admin dicatat di tabel `lpm_audit_logs`.

---

## 🔑 Akun Default Admin Awal
- **Username:** `admin`
- **Password Default:** `admin123` *(WAJIB diganti setelah login pertama!)*
