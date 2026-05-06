const STORAGE_KEYS = {
  users: "event_frontend_users",
  events: "event_frontend_events",
  registrations: "event_frontend_registrations",
  currentUser: "event_frontend_current_user",
};

const LEGACY_SAMPLE_USER_IDS = new Set(["club-tech-01", "student-01"]);
const LEGACY_SAMPLE_EVENT_IDS = new Set(["event-01", "event-02", "event-03"]);

function readJson(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function ensureSeedData() {
  if (typeof window === "undefined") {
    return;
  }

  const existingUsers = readJson(STORAGE_KEYS.users, null);
  if (!Array.isArray(existingUsers) || existingUsers.length === 0) {
    writeJson(STORAGE_KEYS.users, []);
  } else {
    const filteredUsers = existingUsers.filter((user) => !LEGACY_SAMPLE_USER_IDS.has(user.id));
    if (filteredUsers.length !== existingUsers.length) {
      writeJson(STORAGE_KEYS.users, filteredUsers);
    }
  }

  const existingEvents = readJson(STORAGE_KEYS.events, null);
  if (!Array.isArray(existingEvents) || existingEvents.length === 0) {
    writeJson(STORAGE_KEYS.events, []);
  } else {
    const filteredEvents = existingEvents.filter((event) => !LEGACY_SAMPLE_EVENT_IDS.has(event.id));
    if (filteredEvents.length !== existingEvents.length) {
      writeJson(STORAGE_KEYS.events, filteredEvents);
    }
  }

  const existingRegistrations = readJson(STORAGE_KEYS.registrations, null);
  if (!Array.isArray(existingRegistrations)) {
    writeJson(STORAGE_KEYS.registrations, []);
  } else {
    const filteredRegistrations = existingRegistrations.filter(
      (registration) =>
        !LEGACY_SAMPLE_EVENT_IDS.has(registration.eventId) && !LEGACY_SAMPLE_USER_IDS.has(registration.userId)
    );
    if (filteredRegistrations.length !== existingRegistrations.length) {
      writeJson(STORAGE_KEYS.registrations, filteredRegistrations);
    }
  }

  const currentUser = readJson(STORAGE_KEYS.currentUser, null);
  if (currentUser && LEGACY_SAMPLE_USER_IDS.has(currentUser.id)) {
    window.localStorage.removeItem(STORAGE_KEYS.currentUser);
  }
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const interests = Array.isArray(user.interests)
    ? user.interests
    : String(user.interests || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    interests,
    clubInfo: user.clubInfo || "",
  };
}

function normalizeUserInput(input) {
  return {
    id: input.id || createId(input.role || "user"),
    name: String(input.name || "").trim(),
    password: String(input.password || ""),
    role: input.role,
    interests: Array.isArray(input.interests)
      ? input.interests.filter(Boolean)
      : String(input.interests || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    clubInfo: String(input.clubInfo || "").trim(),
  };
}

function normalizeEventInput(input) {
  return {
    id: input.id || createId("event"),
    title: String(input.title || "").trim(),
    description: String(input.description || "").trim(),
    clubId: input.clubId,
    clubName: input.clubName,
    date: input.date,
    time: String(input.time || "").trim(),
    location: String(input.location || "").trim(),
    capacity: Number.isFinite(Number(input.capacity)) ? Number(input.capacity) : null,
    tags: Array.isArray(input.tags)
      ? input.tags.filter(Boolean)
      : String(input.tags || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

export function initializeStorage() {
  ensureSeedData();
}

export function getUsers() {
  ensureSeedData();
  return readJson(STORAGE_KEYS.users, []);
}

export function getCurrentUser() {
  ensureSeedData();
  return readJson(STORAGE_KEYS.currentUser, null);
}

export function setCurrentUser(user) {
  ensureSeedData();
  writeJson(STORAGE_KEYS.currentUser, sanitizeUser(user));
}

export function clearCurrentUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.currentUser);
}

export function registerAccount(input) {
  ensureSeedData();

  const users = getUsers();
  const candidate = normalizeUserInput(input);
  const duplicate = users.find(
    (user) => user.name.toLowerCase() === candidate.name.toLowerCase() && user.role === candidate.role
  );

  if (duplicate) {
    throw new Error("An account with this name already exists for the selected role.");
  }

  users.push(candidate);
  writeJson(STORAGE_KEYS.users, users);
  setCurrentUser(candidate);
  return sanitizeUser(candidate);
}

export function signInAccount({ name, password, role }) {
  ensureSeedData();

  const users = getUsers();
  const foundUser = users.find(
    (user) => user.name.toLowerCase() === String(name).trim().toLowerCase() && user.password === password && user.role === role
  );

  if (!foundUser) {
    throw new Error("Invalid credentials for the selected role.");
  }

  setCurrentUser(foundUser);
  return sanitizeUser(foundUser);
}

export function signOutAccount() {
  clearCurrentUser();
}

export function getEvents() {
  ensureSeedData();
  return readJson(STORAGE_KEYS.events, []).slice().sort((left, right) => {
    const leftDate = new Date(left.date || 0).getTime();
    const rightDate = new Date(right.date || 0).getTime();
    return leftDate - rightDate;
  });
}

export function getRegistrations() {
  ensureSeedData();
  return readJson(STORAGE_KEYS.registrations, []);
}

export function createEvent(input) {
  ensureSeedData();

  const events = getEvents();
  const candidate = normalizeEventInput(input);

  events.push(candidate);
  writeJson(STORAGE_KEYS.events, events);
  return candidate;
}

export function registerForEvent({ eventId, user }) {
  ensureSeedData();

  const registrations = getRegistrations();
  const events = getEvents();
  const targetEvent = events.find((event) => event.id === eventId);

  if (!targetEvent) {
    throw new Error("Event not found.");
  }

  const existingRegistration = registrations.find(
    (registration) => registration.eventId === eventId && registration.userId === user.id
  );

  if (existingRegistration) {
    throw new Error("You are already registered for this event.");
  }

  if (Number.isFinite(targetEvent.capacity)) {
    const currentCount = registrations.filter((registration) => registration.eventId === eventId).length;
    if (currentCount >= targetEvent.capacity) {
      throw new Error("This event is fully booked.");
    }
  }

  registrations.push({
    id: createId("registration"),
    eventId,
    userId: user.id,
    userName: user.name,
    registeredAt: new Date().toISOString(),
  });

  writeJson(STORAGE_KEYS.registrations, registrations);
  return registrations;
}

export function getEventRegistrations(eventId) {
  ensureSeedData();
  return getRegistrations().filter((registration) => registration.eventId === eventId);
}

export function isUserRegisteredForEvent(eventId, userId) {
  ensureSeedData();
  return getRegistrations().some((registration) => registration.eventId === eventId && registration.userId === userId);
}

export function getUserRegistrations(userId) {
  ensureSeedData();
  return getRegistrations().filter((registration) => registration.userId === userId);
}

export function getEventsForClub(clubId) {
  ensureSeedData();
  return getEvents().filter((event) => event.clubId === clubId);
}

export function getEventSummary(event) {
  const registrations = getEventRegistrations(event.id);

  return {
    ...event,
    registrationCount: registrations.length,
    registrants: registrations,
  };
}