import crypto from "crypto";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), ".data", "tituhub-auth.json");
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function ensureDb() {
  if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], pendingUsers: [], otps: [], sessions: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  return {
    users: [],
    pendingUsers: [],
    otps: [],
    sessions: [],
    ...JSON.parse(fs.readFileSync(dbPath, "utf8"))
  };
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export function publicUser(user) {
  if (!user) return null;
  return {
    uid: user.id,
    id: user.id,
    name: user.fullName,
    fullName: user.fullName,
    email: user.email,
    phone: user.mobile,
    mobile: user.mobile,
    role: user.role || "customer",
    emailVerified: Boolean(user.isVerified),
    isVerified: Boolean(user.isVerified)
  };
}

export function createSession(user) {
  const db = readDb();
  const now = new Date();
  const session = {
    id: crypto.randomUUID(),
    userId: user.id,
    email: user.email,
    role: user.role || "customer",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString()
  };
  db.sessions = db.sessions.filter((item) => new Date(item.expiresAt).getTime() > Date.now());
  db.sessions.push(session);
  writeDb(db);
  return session;
}

export function findSession(sessionId = "") {
  if (!sessionId) return null;
  const db = readDb();
  const session = db.sessions.find((item) => item.id === sessionId);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return null;
  const user = db.users.find((item) => item.id === session.userId && item.email === session.email);
  if (!user || !user.isVerified) return null;
  return { session, user };
}

export function deleteSession(sessionId = "") {
  const db = readDb();
  db.sessions = db.sessions.filter((item) => item.id !== sessionId);
  writeDb(db);
}

export function cleanupExpiredOtps() {
  const db = readDb();
  const now = Date.now();
  db.otps = db.otps.filter((otp) => !otp.used && new Date(otp.expiresAt).getTime() > now && otp.attempts < MAX_ATTEMPTS);
  db.pendingUsers = db.pendingUsers.filter((pending) => new Date(pending.expiresAt).getTime() > now);
  writeDb(db);
  return db;
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

export function hashOtp(otp, salt) {
  return crypto.createHmac("sha256", salt).update(String(otp)).digest("hex");
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 210000, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$210000$${salt}$${hash}`;
}

export function verifyPassword(password, passwordHash = "") {
  const [scheme, iterations, salt, storedHash] = passwordHash.split("$");
  if (scheme !== "pbkdf2_sha256" || !iterations || !salt || !storedHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, Number(iterations), 32, "sha256").toString("hex");
  return timingSafeEqual(hash, storedHash);
}

export function createOtpRecord(email, purpose) {
  const otp = generateOtp();
  const salt = crypto.randomBytes(16).toString("hex");
  const now = new Date();
  const record = {
    id: crypto.randomUUID(),
    email: normalizeEmail(email),
    purpose,
    otp: hashOtp(otp, salt),
    salt,
    expiresAt: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
    attempts: 0,
    used: false,
    createdAt: now.toISOString()
  };

  const db = cleanupExpiredOtps();
  db.otps = db.otps.filter((item) => !(item.email === record.email && item.purpose === purpose));
  db.otps.push(record);
  writeDb(db);
  console.info("[OTP Generated]", { email: record.email, purpose, expiresAt: record.expiresAt });
  return { otp, record };
}

export function verifyOtpRecord(email, purpose, otp) {
  const db = cleanupExpiredOtps();
  const normalized = normalizeEmail(email);
  const record = db.otps.find((item) => item.email === normalized && item.purpose === purpose);
  if (!record) {
    console.warn("[Verification Failure]", { email: normalized, purpose, reason: "not_found" });
    return { ok: false, error: "OTP expired or not found" };
  }
  if (record.used) {
    console.warn("[Verification Failure]", { email: normalized, purpose, reason: "reused" });
    return { ok: false, error: "OTP already used" };
  }
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    db.otps = db.otps.filter((item) => item.id !== record.id);
    writeDb(db);
    console.warn("[Verification Failure]", { email: normalized, purpose, reason: "expired" });
    return { ok: false, error: "OTP expired" };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    db.otps = db.otps.filter((item) => item.id !== record.id);
    writeDb(db);
    console.warn("[Verification Failure]", { email: normalized, purpose, reason: "too_many_attempts" });
    return { ok: false, error: "Too many OTP attempts" };
  }

  const candidate = hashOtp(otp, record.salt);
  if (!timingSafeEqual(candidate, record.otp)) {
    record.attempts += 1;
    writeDb(db);
    console.warn("[Verification Failure]", { email: normalized, purpose, reason: "invalid", attempts: record.attempts });
    return { ok: false, error: `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempt(s) left.` };
  }

  record.used = true;
  db.otps = db.otps.filter((item) => item.id !== record.id);
  writeDb(db);
  console.info("[Verification Success]", { email: normalized, purpose });
  return { ok: true };
}

export function createPendingUser({ fullName, email, mobile, password }) {
  const db = cleanupExpiredOtps();
  const normalized = normalizeEmail(email);
  if (db.users.some((user) => user.email === normalized)) {
    return { ok: false, error: "Email already registered" };
  }
  const now = new Date();
  const pending = {
    id: crypto.randomUUID(),
    fullName: String(fullName).trim(),
    email: normalized,
    mobile: String(mobile).trim(),
    passwordHash: hashPassword(password),
    isVerified: false,
    role: normalized === normalizeEmail(process.env.ADMIN_EMAIL || "pandvikash46@gmail.com") ? "admin" : "customer",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + OTP_TTL_MS).toISOString()
  };
  db.pendingUsers = db.pendingUsers.filter((user) => user.email !== normalized);
  db.pendingUsers.push(pending);
  writeDb(db);
  return { ok: true, pending };
}

export function verifyPendingUser(email) {
  const db = cleanupExpiredOtps();
  const normalized = normalizeEmail(email);
  const pending = db.pendingUsers.find((user) => user.email === normalized);
  if (!pending) return { ok: false, error: "Pending signup expired. Please signup again." };
  if (db.users.some((user) => user.email === normalized)) return { ok: false, error: "Email already registered" };
  const user = {
    id: crypto.randomUUID(),
    fullName: pending.fullName,
    email: pending.email,
    mobile: pending.mobile,
    passwordHash: pending.passwordHash,
    isVerified: true,
    role: pending.role || "customer",
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  db.pendingUsers = db.pendingUsers.filter((item) => item.email !== normalized);
  writeDb(db);
  console.info("[User Created]", { email: user.email, role: user.role });
  return { ok: true, user };
}

export function removeAuthChallenge(email, purpose = "signup") {
  const db = cleanupExpiredOtps();
  const normalized = normalizeEmail(email);
  db.pendingUsers = db.pendingUsers.filter((user) => user.email !== normalized);
  db.otps = db.otps.filter((otp) => !(otp.email === normalized && otp.purpose === purpose));
  writeDb(db);
}

export function findUser(email) {
  const db = cleanupExpiredOtps();
  return db.users.find((user) => user.email === normalizeEmail(email));
}

export function findPendingUser(email) {
  const db = cleanupExpiredOtps();
  return db.pendingUsers.find((user) => user.email === normalizeEmail(email));
}

export function updatePassword(email, password) {
  const db = cleanupExpiredOtps();
  const user = db.users.find((item) => item.email === normalizeEmail(email));
  if (!user) return { ok: false, error: "User not found" };
  user.passwordHash = hashPassword(password);
  writeDb(db);
  console.info("[Password Reset]", { email: user.email });
  return { ok: true, user };
}

export function getAuthAdminSnapshot() {
  const db = cleanupExpiredOtps();
  return {
    verifiedUsers: db.users.map(publicUser),
    pendingUsers: db.pendingUsers.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      isVerified: false,
      createdAt: user.createdAt,
      expiresAt: user.expiresAt
    })),
    activeOtps: db.otps.map((otp) => ({
      id: otp.id,
      email: otp.email,
      purpose: otp.purpose,
      expiresAt: otp.expiresAt,
      attempts: otp.attempts,
      createdAt: otp.createdAt
    }))
  };
}

export function deleteUserByEmail(email) {
  const db = cleanupExpiredOtps();
  const normalized = normalizeEmail(email);
  db.users = db.users.filter((user) => user.email !== normalized);
  db.pendingUsers = db.pendingUsers.filter((user) => user.email !== normalized);
  db.sessions = db.sessions.filter((session) => session.email !== normalized);
  writeDb(db);
  return { ok: true };
}
