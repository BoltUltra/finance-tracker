import { db, auth } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export const updateUserProfile = async (
  userId: string,
  data: { displayName?: string; photoURL?: string },
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // 1. Update Firebase Auth Profile
    await updateProfile(user, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    });

    // 2. Update Firestore User Document
    const userRef = doc(db, "users", userId);

    // Clean data to remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    await updateDoc(userRef, {
      ...cleanData,
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
