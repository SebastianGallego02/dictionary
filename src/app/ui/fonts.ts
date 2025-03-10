import { Roboto as RobotoFont, Noto_Serif, Space_Mono } from "next/font/google";

export const robotoFont = RobotoFont({ 
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"]
});

export const notoSerifFont = Noto_Serif({ 
  weight: ["400", "700"],
  style: ["normal", "italic"], 
  subsets: ["latin"]
});

export const spaceMonoFont = Space_Mono({ 
  weight: ["400", "700"],
  style: ["normal"],  // Space Mono might have limited styles
  subsets: ["latin"]
});

export const fonts = {
  roboto: robotoFont,
  notoSerif: notoSerifFont,
  spaceMono: spaceMonoFont,
};