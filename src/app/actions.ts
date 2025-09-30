"use server"

import { z } from "zod";
import { xPostDb, bitcoinDb, chatDb } from "@/lib/firebase";
import { ref, set } from "firebase/database";
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
    await set(ref(xPostDb, `users/${id}`), newAccount);
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

const bitcoinSchema = z.object({
    accountName: z.string().min(1, "Account name is required."),
    chatName: z.string().min(1, "Chat name is required."),
});

export async function createBitcoinAccount(prevState: any, formData: FormData) {
    const validatedFields = bitcoinSchema.safeParse({
        accountName: formData.get("accountName"),
        chatName: formData.get("chatName"),
    });

    if (!validatedFields.success) {
        return {
            type: "error" as const,
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { accountName, chatName } = validatedFields.data;
    const key = accountName.replace(/[\.\#\$\[\]\/]/g, "_");

    const newAccount = {
        "Chat Name": chatName,
        accountname: accountName,
        avgBtcCost: 66189.34,
        balance: 10000000,
        btcBalance: 0.00001536,
        dailyGain: 0,
        dailyLoss: 0,
        lastClaim: new Date().toISOString(),
        lastPrice: 71582.28,
        todaysPL: 0,
        usdBalance: 1000,
    };

    try {
        await set(ref(bitcoinDb, `Users/${key}`), newAccount);
        revalidatePath("/");
        return {
            type: "success" as const,
            message: `Bitcoin account "${accountName}" for user "${chatName}" created successfully.`,
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
    await set(ref(chatDb, `users/${username}`), newAccount);
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
