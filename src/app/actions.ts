
"use server"

import { z } from "zod";
import { xPostDb, chatDb, gunFightDb, giftBoxDb, uraTradeDb, get, child, set, databaseRef, push } from "@/lib/firebase";
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
    await set(databaseRef(chatDb, `users/${username}`), newAccount);
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
    await set(databaseRef(uraTradeDb, `users/${chatName}`), newAccount);
    revalidatePath("/");
    return {
      type: "success" as const,
      message: `URA Trade account for ${chatName} created successfully.`,
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

  // 1. Create X Post Account
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
    await set(databaseRef(xPostDb, `users/${xPostId}`), xPostAccount);
    results.push("X Post account created.");
  } catch (e) { results.push("X Post creation failed."); }

  // 2. Create Chat Account
  const chatAccount = {
    username,
    customName: chatName,
    profileImageUrl: `https://avatar.vercel.sh/${username}.png`,
    role: "user",
  };
  try {
    await set(databaseRef(chatDb, `users/${username}`), chatAccount);
    results.push("Chat account created.");
  } catch (e) { results.push("Chat account creation failed."); }

  // 3. Create Gun Fight User
  try {
    const gfRef = databaseRef(gunFightDb, 'validUsernames');
    const snapshot = await get(gfRef);
    const usernames = snapshot.val() || [];
    let newIndex = Array.isArray(usernames) ? usernames.length : (typeof usernames === 'object' && usernames !== null) ? Object.keys(usernames).length : 0;
    await set(child(gfRef, String(newIndex)), username);
    results.push("Gun Fight user created.");
  } catch (e) { results.push("Gun Fight user creation failed."); }

  // 4. Create Gift Box User
  const giftBoxUser = {
    user_id: push(databaseRef(giftBoxDb, 'users')).key,
    username: username,
    xp: 50,
  };
  try {
    await set(databaseRef(giftBoxDb, `users/${giftBoxUser.user_id}`), giftBoxUser);
    results.push("Gift Box user created.");
  } catch (e) { results.push("Gift Box user creation failed."); }

  // 5. Create URA Trade Account
  const uraTradeAccount = {
    "Chat Name ": chatName,
    accountname: username,
    avgBtcCost: 0,
    btcBalance: 0,
    dailyGain: 0,
    dailyLoss: 0,
    usdBalance: 1000,
  };
  try {
    await set(databaseRef(uraTradeDb, `users/${chatName}`), uraTradeAccount);
    results.push("URA Trade account created.");
  } catch (e) { results.push("URA Trade account creation failed."); }

  revalidatePath("/");
  return {
    type: "success" as const,
    message: "Master account creation process finished.",
    details: results,
  };
}
