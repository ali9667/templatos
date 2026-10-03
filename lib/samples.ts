import type { PlatformId, ProfileInput, ToneId } from "@/lib/ai/config";

/**
 * Pre-written example output for the homepage preview. It is labelled as a sample
 * in the UI: AI Studio itself always generates new text from the visitor's details.
 * Every entry is checked against the platform's medium-length target in tests.
 */

export const SAMPLE_PROFILE: Pick<ProfileInput, "name" | "role" | "skills" | "experience" | "interests" | "website"> = {
  name: "Maya Rivera",
  role: "Frontend developer",
  skills: "React, TypeScript, accessibility, design systems",
  experience: "4 years building product UI. Led the redesign of a design system used by three teams.",
  interests: "Typography, cycling, coffee",
  website: "mayarivera.dev",
};

export const SAMPLE_OUTPUT: Record<PlatformId, Record<ToneId, string>> = {
  instagram: {
    professional: "Frontend developer · React & TypeScript\nAccessible interfaces for small teams\nmayarivera.dev",
    friendly: "Hi, I'm Maya 👋 I build web interfaces and ride bikes.\nTypography nerd. Coffee first.\nmayarivera.dev",
    creative: "Turning rough ideas into interfaces people enjoy.\nReact, type, and the details in between.\nmayarivera.dev",
    humorous: "I make buttons that work and forms that forgive.\nFrontend dev. Cyclist. Font opinions available.",
  },
  linkedin: {
    professional:
      "I'm a frontend developer who builds accessible, maintainable interfaces with React and TypeScript. Most of my work is design systems and product UI for small teams.\n\nOver four years I've moved from building individual screens to leading the redesign of a design system now used by three teams.\n\nI care about typography, accessibility and the small decisions that make software feel considered. If you need a careful frontend developer, get in touch: mayarivera.dev",
    friendly:
      "Hi, I'm Maya. I'm a frontend developer, and I spend my days making web interfaces that are pleasant to use and easy to maintain, mostly with React and TypeScript.\n\nRecently I led the redesign of a design system that three teams now share, which taught me more about people than about code.\n\nOutside work it's typography, cycling and too much coffee. Always happy to talk shop: mayarivera.dev",
    creative:
      "Good interfaces are mostly decisions nobody notices. I make those decisions for a living as a frontend developer working in React and TypeScript.\n\nFour years in, I've shipped product UI and led the redesign of a design system used by three teams.\n\nAccessibility and typography are where I like to spend the extra hour. See what I'm building at mayarivera.dev",
    humorous:
      "I'm a frontend developer, which means I care a lot about things like focus states and get unreasonably happy when a form behaves.\n\nI work in React and TypeScript, and I led the redesign of a design system that three teams now argue about politely.\n\nTypography, cycling, coffee. Say hello: mayarivera.dev",
  },
  x: {
    professional: "Frontend developer. React, TypeScript, accessibility. Building design systems for small teams. mayarivera.dev",
    friendly: "Frontend dev who loves a good design system, a long bike ride and strong coffee. Say hi: mayarivera.dev",
    creative: "Interfaces, but considered. React, type, and the details nobody sees until they're missing.",
    humorous: "I write React so you can click things. Accessibility advocate, font snob, occasional cyclist.",
  },
  telegram: {
    professional: "Frontend developer working with React and TypeScript. I write about design systems and accessible UI. mayarivera.dev",
    friendly: "Maya here. I build web interfaces and share what I learn about React, type and design systems. Come say hi.",
    creative: "Notes from the space between design and code: React, typography and the small decisions that make UI feel right.",
    humorous: "Frontend developer. I share React tips, design system notes and the occasional strong opinion about fonts.",
  },
};
