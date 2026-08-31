import { MockProvider } from "./MockProvider.js";
import { PterodactylProvider } from "./PterodactylProvider.js";

export function createProvider() {
  if (process.env.PROVIDER === "pterodactyl") {
    if (!process.env.PTERODACTYL_URL || !process.env.PTERODACTYL_API_KEY) {
      throw new Error("PTERODACTYL_URL and PTERODACTYL_API_KEY are required.");
    }
    return new PterodactylProvider(process.env.PTERODACTYL_URL, process.env.PTERODACTYL_API_KEY);
  }
  return new MockProvider();
}
