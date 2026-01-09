"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { generateProblem, validateApiKey, MODELS } from "@/lib/gemini";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";
import { GenerationOptions, CodingProblem } from "@/types";
import { revalidatePath } from "next/cache";

// Internal helper
async function getRawSession() {
    return await getIronSession<SessionData>(await cookies(), sessionOptions);
}

// Public action for Client Components (must return plain objects)
export async function getSessionData(): Promise<SessionData> {
    const session = await getRawSession();
    return {
        geminiApiKey: session.geminiApiKey,
        modelApiKeys: session.modelApiKeys || {},
        defaultModel: session.defaultModel
    };
}

export async function validateAndSaveApiKey(apiKey: string, modelId?: string) {
    // モデルIDが指定されている場合はそのモデルで、そうでなければデフォルトでバリデーション
    const isValid = await validateApiKey(apiKey, modelId);
    if (!isValid) {
        throw new Error(`${modelId || "Gemini"} への接続に失敗しました。APIキーが正しいか確認してください。`);
    }

    const session = await getRawSession();
    if (modelId) {
        if (!session.modelApiKeys) session.modelApiKeys = {};
        session.modelApiKeys[modelId] = apiKey;
    } else {
        session.geminiApiKey = apiKey;
    }
    await session.save();
    return { success: true };
}

export async function validateAndSaveApiKeyForAll(apiKey: string) {
    const session = await getRawSession();
    if (!session.modelApiKeys) session.modelApiKeys = {};

    // すべてのモデルに対して並列で疎通確認を実行
    const results = await Promise.all(
        MODELS.map(async (m) => ({
            id: m.id,
            success: await validateApiKey(apiKey, m.id)
        }))
    );

    const successfulModels = results.filter(r => r.success).map(r => r.id);
    const failedModels = results.filter(r => !r.success).map(r => r.id);

    // 疎通に成功したモデルのみ保存
    successfulModels.forEach(id => {
        session.modelApiKeys![id] = apiKey;
    });

    // 少なくとも一つ成功していればグローバルキーとしても保持（下位互換性）
    if (successfulModels.length > 0) {
        session.geminiApiKey = apiKey;
    }

    await session.save();

    return {
        success: successfulModels.length > 0,
        count: successfulModels.length,
        failedModels
    };
}

export async function clearApiKeyForModel(modelId: string) {
    const session = await getRawSession();
    if (session.modelApiKeys) {
        delete session.modelApiKeys[modelId];
    }
    await session.save();
    return { success: true };
}

export async function saveApiKey(apiKey: string) {
    const session = await getRawSession();
    session.geminiApiKey = apiKey;
    await session.save();
    return { success: true };
}

export async function clearAllApiKeys() {
    const session = await getRawSession();
    session.geminiApiKey = undefined;
    session.modelApiKeys = {};
    await session.save();
    return { success: true };
}

export async function destroySession() {
    const session = await getRawSession();
    session.destroy();
    return { success: true };
}

export async function generateAndSaveProblem(options: GenerationOptions) {
    const session = await getRawSession();
    const selectedModel = options.model || "gemini-2.0-flash";
    const apiKey = session.modelApiKeys?.[selectedModel] || session.geminiApiKey;

    if (!apiKey) {
        throw new Error(`${selectedModel} のAPIキーが設定されていません。設定画面で接続を完了してください。`);
    }

    try {
        const problem = await generateProblem(apiKey, options);

        // Save to Firestore
        const docRef = await addDoc(collection(db, "problems"), {
            ...problem,
            options, // 生成時のオプションを保存
            createdAt: serverTimestamp(),
        });

        revalidatePath("/problems");
        return { success: true, id: docRef.id };
    } catch (error: unknown) {
        console.error("Generation error:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate problem");
    }
}

export async function getProblems() {
    const q = query(collection(db, "problems"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Firebase Timestamp is a complex object, convert it to a string for Client Components
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        };
    }) as CodingProblem[];
}

export async function getProblemById(id: string) {
    const docRef = doc(db, "problems", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        } as CodingProblem;
    }
    return null;
}
