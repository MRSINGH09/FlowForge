import { v4 as uuidv4 } from "uuid";
import type { AuthSession } from "@/types";
import { getItem, setItem } from "@/lib/storage";

interface StoredUser {
  email: string;
  password: string;
  name: string;
  id: string;
}

function getUsers(): StoredUser[] {
  return getItem<StoredUser[]>("flowforge_users") ?? [];
}

function saveUsers(users: StoredUser[]): void {
  setItem("flowforge_users", users);
}

function createSession(user: StoredUser): AuthSession {
  return {
    user: { id: user.id, email: user.email, name: user.name },
    token: `token_${uuidv4()}`,
  };
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthSession> {
    await delay(400);
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    return createSession(user);
  },

  async signup(name: string, email: string, password: string): Promise<AuthSession> {
    await delay(400);
    const users = getUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("An account with this email already exists");
    }

    const newUser: StoredUser = {
      id: uuidv4(),
      name,
      email,
      password,
    };

    saveUsers([...users, newUser]);
    return createSession(newUser);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
