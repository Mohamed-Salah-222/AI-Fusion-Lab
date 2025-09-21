"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

function Provider({ children, ...props }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      CreateNewuser();
    }
  }, [user]);

  const CreateNewuser = async () => {
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("Exitiing User");
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5,
        plan: "Free",
        credits: 1000,
      };
      await setDoc(userRef, userData);
      console.log("New User data saved");
    }
  };

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      <SidebarProvider>
        <AppSidebar />

        <div className="w-full">
          <AppHeader />
          {children}
        </div>
      </SidebarProvider>
    </NextThemesProvider>
  );
}

export default Provider;
