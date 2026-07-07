"use client";

import { ThemeProvider as TeispaceThemeProvider } from "@teispace/next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof TeispaceThemeProvider>) {
  return (
    <TeispaceThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </TeispaceThemeProvider>
  );
}
