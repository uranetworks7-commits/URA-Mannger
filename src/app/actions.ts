
"use server"

import { z } from "zod";
import { xPostDb, chatDb, gunFightDb, giftBoxDb, uraTradeDb, get, child, set, databaseRef, push, update } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const xPostSchema = z.object({
  mainAccountUsername: z.string().min(1, "Main account username is required."),
  chatName: z.string().min(1, "Chat name is required."),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

export async function createXPostAccount(prevState: any, formData: FormData) {
  const validatedFields = xPostSchema.safeParse({
    mainAccountUsername: formData.get("mainAccountUsername"),
    chatName: formData.get("chatName"),
    avatarUrl: formData.get("avatarUrl"),
  });

  if (!validatedFields.success) {
    return {
      type: "error" as const,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { mainAccountUsername, chatName, avatarUrl } = validatedFields.data;
  const id = `user-${chatName.replace(/\s+/g, '_')}-${Date.now()}`;
  const defaultAvatar = PlaceHolderImages.find(img => img.id === 'default-avatar')?.imageUrl;

  const newAccount = {
    id,
    name: chatName,
    mainAccountUsername,
    avatar: avatarUrl || defaultAvatar,
    isMonetized: true,
    dailyPostCount: {
      count: 0,
      date: new Date().toISOString().split("T")[0],
    },
  };

  try {
    await set(databaseRef(xPostDb, `users/${id}`), newAccount);
    revalidatePath("/");
    return {
      type: "success" as const,
      message: `X Post account for ${newAccount.name} created successfully.`,
    };
  } catch (error) {
    return {
      type: "error" as const,
      message: "Failed to create account in Firebase.",
    };
  }
}

const chatAccountSchema = z.object({
  username: z.string().min(1, "Username is required."),
  customName: z.string().min(1, "Custom name is required."),
  profileImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

export async function createChatAccount(prevState: any, formData: FormData) {
  const validatedFields = chatAccountSchema.safeParse({
    username: formData.get("username"),
    customName: formData.get("customName"),
    profileImageUrl: formData.get("profileImageUrl"),
  });

  if (!validatedFields.success) {
    return {
      type: "error" as const,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, customName, profileImageUrl } = validatedFields.data;
  
  const newAccount = {
    username,
    customName,
    profileImageUrl: profileImageUrl || `https://avatar.vercel.sh/${username}.png`,
    role: "user",
  };

  try {
    const userRef = databaseRef(chatDb, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return {
        type: "error" as const,
        message: `Chat account for ${username} already exists.`,
      };
    }
    await set(userRef, newAccount);
    revalidatePath("/");
    return {
      type: "success" as const,
      message: `Chat account for ${username} created successfully.`,
    };
  } catch (error) {
    return {
      type: "error" as const,
      message: "Failed to create chat account in Firebase.",
    };
  }
}

const gunFightSchema = z.object({
  username: z.string().min(1, "Username is required."),
});

export async function createGunFightUser(prevState: any, formData: FormData) {
    const validatedFields = gunFightSchema.safeParse({
        username: formData.get("username"),
    });

    if (!validatedFields.success) {
        return {
            type: "error" as const,
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { username } = validatedFields.data;

    try {
        const validUsernamesRef = databaseRef(gunFightDb, 'validUsernames');
        const snapshot = await get(validUsernamesRef);
        const usernames = snapshot.val() || [];

        if (Object.values(usernames).includes(username)) {
            return {
                type: "error" as const,
                message: `Gun Fight user "${username}" already exists.`,
            };
        }
        
        let newIndex = 0;
        if (Array.isArray(usernames)) {
            newIndex = usernames.length;
        } else if (typeof usernames === 'object' && usernames !== null) {
            const keys = Object.keys(usernames);
            newIndex = keys.length > 0 ? Math.max(...keys.map(Number)) + 1 : 0;
        }

        await set(child(validUsernamesRef, String(newIndex)), username);
        revalidatePath("/");
        return {
            type: "success" as const,
            message: `Gun Fight user "${username}" created successfully.`,
        };
    } catch (error: any) {
        return {
            type: "error" as const,
            message: error.message || "Failed to create Gun Fight user in Firebase.",
        };
    }
}


const giftBoxSchema = z.object({
  username: z.string().min(1, "Username is required."),
});

export async function createGiftBoxUser(prevState: any, formData: FormData) {
    const validatedFields = giftBoxSchema.safeParse({
        username: formData.get("username"),
    });

    if (!validatedFields.success) {
        return {
            type: "error" as const,
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { username } = validatedFields.data;

    try {
        const usersRef = databaseRef(giftBoxDb, 'users');
        const snapshot = await get(usersRef);
        const users = snapshot.val();
        if (users) {
            const existingUser = Object.values(users).find((user: any) => user.username === username);
            if (existingUser) {
                return {
                    type: "error" as const,
                    message: `Gift Box user "${username}" already exists.`,
                };
            }
        }
        
        const newUserRef = push(usersRef);
        const userId = newUserRef.key;

        const newUser = {
            user_id: userId,
            username: username,
            xp: 50
        };

        await set(newUserRef, newUser);
        revalidatePath("/");
        return {
            type: "success" as const,
            message: `Gift Box user "${username}" created successfully.`,
        };
    } catch (error: any) {
        return {
            type: "error" as const,
            message: error.message || "Failed to create Gift Box user in Firebase.",
        };
    }
}

const uraTradeSchema = z.object({
  username: z.string().min(1, "Username is required."),
  chatName: z.string().min(1, "Chat name is required."),
});

export async function createUraTradeAccount(prevState: any, formData: FormData) {
  const validatedFields = uraTradeSchema.safeParse({
    username: formData.get("username"),
    chatName: formData.get("chatName"),
  });

  if (!validatedFields.success) {
    return {
      type: "error" as const,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, chatName } = validatedFields.data;

  const newAccount = {
    "Chat Name ": chatName,
    accountname: username,
    avgBtcCost: 0,
    btcBalance: 0,
    dailyGain: 0,
    dailyLoss: 0,
    usdBalance: 1000,
  };

  try {
    const userRef = databaseRef(uraTradeDb, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        return {
            type: "error" as const,
            message: `URA Trade account for ${username} already exists.`,
        };
    }
    await set(userRef, newAccount);
    revalidatePath("/");
    return {
      type: "success" as const,
      message: `URA Trade account for ${username} created successfully.`,
    };
  } catch (error: any) {
    return {
      type: "error" as const,
      message: error.message || "Failed to create URA Trade account in Firebase.",
    };
  }
}

const masterAccountSchema = z.object({
  username: z.string().min(1, "A universal username is required."),
  chatName: z.string().min(1, "A universal chat name is required."),
});

export async function createMasterAccount(prevState: any, formData: FormData) {
  const validatedFields = masterAccountSchema.safeParse({
    username: formData.get("username"),
    chatName: formData.get("chatName"),
  });

  if (!validatedFields.success) {
    return {
      type: "error" as const,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, chatName } = validatedFields.data;
  const results = [];

  // 1. Create X Post Account - Assuming no easy check for existence, create new one.
  const xPostId = `user-${chatName.replace(/\s+/g, '_')}-${Date.now()}`;
  const xPostAccount = {
    id: xPostId,
    name: chatName,
    mainAccountUsername: username,
    avatar: PlaceHolderImages.find(img => img.id === 'default-avatar')?.imageUrl || '',
    isMonetized: true,
    dailyPostCount: { count: 0, date: new Date().toISOString().split("T")[0] },
  };
  try {
    const xPostUsersRef = databaseRef(xPostDb, 'users');
    const xPostSnapshot = await get(xPostUsersRef);
    const xPostUsers = xPostSnapshot.val();
    let xPostUserExists = false;
    if (xPostUsers) {
        const existingUser = Object.values(xPostUsers).find((user: any) => user.mainAccountUsername === username);
        if (existingUser) {
            xPostUserExists = true;
        }
    }
    if (xPostUserExists) {
        results.push("X Post account already exists.");
    } else {
        await set(databaseRef(xPostDb, `users/${xPostId}`), xPostAccount);
        results.push("X Post account created successfully.");
    }
  } catch (e) { results.push("X Post creation failed."); }

  // 2. Create Chat Account
  try {
    const chatUserRef = databaseRef(chatDb, `users/${username}`);
    const chatSnapshot = await get(chatUserRef);
    if (chatSnapshot.exists()) {
      results.push("Chat account already exists.");
    } else {
      const chatAccount = {
        username,
        customName: chatName,
        profileImageUrl: `https://avatar.vercel.sh/${username}.png`,
        role: "user",
      };
      await set(chatUserRef, chatAccount);
      results.push("Chat account created successfully.");
    }
  } catch (e) { results.push("Chat account creation failed."); }

  // 3. Create Gun Fight User
  try {
    const gfRef = databaseRef(gunFightDb, 'validUsernames');
    const snapshot = await get(gfRef);
    const usernames = snapshot.val() || [];
     if (Object.values(usernames).includes(username)) {
        results.push("Gun Fight user already exists.");
    } else {
        let newIndex = Array.isArray(usernames) ? usernames.length : (typeof usernames === 'object' && usernames !== null) ? Object.keys(usernames).length : 0;
        await set(child(gfRef, String(newIndex)), username);
        results.push("Gun Fight user created successfully.");
    }
  } catch (e) { results.push("Gun Fight user creation failed."); }

  // 4. Create Gift Box User
  try {
    const giftBoxUsersRef = databaseRef(giftBoxDb, 'users');
    const giftBoxSnapshot = await get(giftBoxUsersRef);
    const giftBoxUsers = giftBoxSnapshot.val();
    let giftBoxUserExists = false;
    if (giftBoxUsers) {
        const existingUser = Object.values(giftBoxUsers).find((user: any) => user.username === username);
        if (existingUser) {
            giftBoxUserExists = true;
        }
    }
    if(giftBoxUserExists) {
        results.push("Gift Box user already exists.");
    } else {
        const newGiftBoxUserRef = push(giftBoxUsersRef);
        const giftBoxUser = {
            user_id: newGiftBoxUserRef.key,
            username: username,
            xp: 50,
        };
        await set(newGiftBoxUserRef, giftBoxUser);
        results.push("Gift Box user created successfully.");
    }
  } catch (e) { results.push("Gift Box user creation failed."); }

  // 5. Create URA Trade Account
  try {
    const uraTradeUserRef = databaseRef(uraTradeDb, `users/${username}`);
    const uraTradeSnapshot = await get(uraTradeUserRef);
    if(uraTradeSnapshot.exists()){
        results.push("URA Trade account already exists.");
    } else {
        const uraTradeAccount = {
            "Chat Name ": chatName,
            accountname: username,
            avgBtcCost: 0,
            btcBalance: 0,
            dailyGain: 0,
            dailyLoss: 0,
            usdBalance: 1000,
        };
        await set(uraTradeUserRef, uraTradeAccount);
        results.push("URA Trade account created successfully.");
    }
  } catch (e) { results.push("URA Trade account creation failed."); }

  revalidatePath("/");
  return {
    type: "success" as const,
    message: "Master account creation process finished.",
    details: results,
  };
}

const banUnbanSchema = z.object({
  username: z.string().min(1, "Username is required."),
  chatName: z.string().min(1, "Chat name is required."),
});

async function findUserKey(db: any, path: string, username: string, usernameField: string = 'username'): Promise<string | null> {
    const ref = databaseRef(db, path);
    const snapshot = await get(ref);
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (const key in data) {
            if (data[key][usernameField] === username) {
                return key;
            }
        }
    }
    return null;
}

async function findGunFightUserKey(db: any, path: string, username: string): Promise<string | null> {
    const ref = databaseRef(db, path);
    const snapshot = await get(ref);
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (const key in data) {
            if (data[key] === username) {
                return key;
            }
        }
    }
    return null;
}

export async function banAccount(prevState: any, formData: FormData) {
  const validatedFields = banUnbanSchema.safeParse({
    username: formData.get("username"),
    chatName: formData.get("chatName"),
  });

  if (!validatedFields.success) {
    return { type: "error", message: "Invalid form data.", errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username } = validatedFields.data;
  await new Promise(resolve => setTimeout(resolve, 10000));
  const bannedUsername = `${username}#URA225`;
  const results = [];

  // 1. Ban X Post Account
  try {
    const userKey = await findUserKey(xPostDb, 'users', username, 'mainAccountUsername');
    if (userKey) {
        await update(databaseRef(xPostDb, `users/${userKey}`), { mainAccountUsername: bannedUsername });
        results.push("X Post account banned.");
    } else {
        results.push("X Post account not found.");
    }
  } catch(e: any) { results.push(`Banning X Post account failed: ${e.message}`); }

  // 2. Ban Chat Account
  try {
    const userRef = databaseRef(chatDb, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const userData = snapshot.val();
        const newRef = databaseRef(chatDb, `users/${bannedUsername}`);
        await set(newRef, { ...userData, username: bannedUsername });
        await set(userRef, null); // Remove old record
        results.push("Chat account banned.");
    } else {
        results.push("Chat account not found.");
    }
  } catch(e: any) { results.push(`Banning Chat account failed: ${e.message}`); }

  // 3. Ban Gun Fight User
  try {
    const userKey = await findGunFightUserKey(gunFightDb, 'validUsernames', username);
    if (userKey) {
        await set(databaseRef(gunFightDb, `validUsernames/${userKey}`), bannedUsername);
        results.push("Gun Fight user banned.");
    } else {
        results.push("Gun Fight user not found.");
    }
  } catch(e: any) { results.push(`Banning Gun Fight user failed: ${e.message}`); }

  // 4. Ban Gift Box User
  try {
    const userKey = await findUserKey(giftBoxDb, 'users', username);
    if (userKey) {
        await update(databaseRef(giftBoxDb, `users/${userKey}`), { username: bannedUsername });
        results.push("Gift Box user banned.");
    } else {
        results.push("Gift Box user not found.");
    }
  } catch(e: any) { results.push(`Banning Gift Box user failed: ${e.message}`); }

  // 5. Ban URA Trade Account
  try {
    const userRef = databaseRef(uraTradeDb, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const userData = snapshot.val();
        const newRef = databaseRef(uraTradeDb, `users/${bannedUsername}`);
        await set(newRef, { ...userData, accountname: bannedUsername });
        await set(userRef, null); // Remove old record
        results.push("URA Trade account banned.");
    } else {
        results.push("URA Trade account not found.");
    }
  } catch(e: any) { results.push(`Banning URA Trade account failed: ${e.message}`); }

  revalidatePath("/danger-zone");
  return { type: "success", message: "Ban process completed.", details: results };
}


export async function unbanAccount(prevState: any, formData: FormData) {
  const validatedFields = banUnbanSchema.safeParse({
    username: formData.get("username"),
    chatName: formData.get("chatName"),
  });

  if (!validatedFields.success) {
    return { type: "error", message: "Invalid form data.", errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username } = validatedFields.data;
  if (!username.includes('#URA225')) {
    return { type: "error", message: "Username does not appear to be banned (missing #URA225)." };
  }

  const originalUsername = username.replace('#URA225', '');
  const results = [];

  // 1. Unban X Post Account
  try {
    const userKey = await findUserKey(xPostDb, 'users', username, 'mainAccountUsername');
    if (userKey) {
        await update(databaseRef(xPostDb, `users/${userKey}`), { mainAccountUsername: originalUsername });
        results.push("X Post account unbanned.");
    } else {
        results.push("Banned X Post account not found.");
    }
  } catch(e: any) { results.push(`Unbanning X Post account failed: ${e.message}`); }
  
  // 2. Unban Chat Account
  try {
    const userRef = databaseRef(chatDb, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const userData = snapshot.val();
        const newRef = databaseRef(chatDb, `users/${originalUsername}`);
        await set(newRef, { ...userData, username: originalUsername });
        await set(userRef, null);
        results.push("Chat account unbanned.");
    } else {
        results.push("Banned Chat account not found.");
    }
  } catch(e: any) { results.push(`Unbanning Chat account failed: ${e.message}`); }

  // 3. Unban Gun Fight User
  try {
    const userKey = await findGunFightUserKey(gunFightDb, 'validUsernames', username);
    if (userKey) {
        await set(databaseRef(gunFightDb, `validUsernames/${userKey}`), originalUsername);
        results.push("Gun Fight user unbanned.");
    } else {
        results.push("Banned Gun Fight user not found.");
    }
  } catch(e: any) { results.push(`Unbanning Gun Fight user failed: ${e.message}`); }

  // 4. Unban Gift Box User
  try {
    const userKey = await findUserKey(giftBoxDb, 'users', username);
    if (userKey) {
        await update(databaseRef(giftBoxDb, `users/${userKey}`), { username: originalUsername });
        results.push("Gift Box user unbanned.");
    } else {
        results.push("Banned Gift Box user not found.");
    }
  } catch(e: any) { results.push(`Unbanning Gift Box user failed: ${e.message}`); }

  // 5. Unban URA Trade Account
  try {
    const userRef = databaseRef(uraTradeDb, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const userData = snapshot.val();
        const newRef = databaseRef(uraTradeDb, `users/${originalUsername}`);
        await set(newRef, { ...userData, accountname: originalUsername });
        await set(userRef, null);
        results.push("URA Trade account unbanned.");
    } else {
        results.push("Banned URA Trade account not found.");
    }
  } catch(e: any) { results.push(`Unbanning URA Trade account failed: ${e.message}`); }

  revalidatePath("/danger-zone");
  return { type: "success", message: "Unban process completed.", details: results };
}
