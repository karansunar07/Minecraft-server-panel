type MojangVersion = {
  id: string;
  type: "release" | "snapshot" | "old_beta" | "old_alpha";
};

type MojangManifest = {
  versions: MojangVersion[];
};

type PaperProject = {
  versions: string[];
};

type PurpurProject = {
  versions: string[];
};

const VERSION_CACHE_MS = 1000 * 60 * 30;
const cache = new Map<string, { expiresAt: number; versions: string[] }>();

const fallbackModernVersions = [
  "1.21.8",
  "1.21.7",
  "1.21.6",
  "1.21.5",
  "1.21.4",
  "1.21.3",
  "1.21.2",
  "1.21.1",
  "1.21",
  "1.20.6",
  "1.20.5",
  "1.20.4",
  "1.20.3",
  "1.20.2",
  "1.20.1",
  "1.20"
];

export async function listMinecraftVersions(software: string, includeSnapshots = false) {
  const normalized = software.toLowerCase();
  const cacheKey = `${normalized}:${includeSnapshots}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.versions;

  const versions = await resolveVersions(normalized, includeSnapshots).catch(() => fallbackModernVersions);
  const uniqueVersions = [...new Set(versions)].filter(isModernMinecraftVersion).sort(compareVersionsDescending);

  cache.set(cacheKey, { expiresAt: Date.now() + VERSION_CACHE_MS, versions: uniqueVersions });
  return uniqueVersions;
}

async function resolveVersions(software: string, includeSnapshots: boolean) {
  if (software === "paper" || software === "folia" || software === "velocity" || software === "waterfall") {
    return listPaperProjectVersions(software);
  }

  if (software === "purpur") {
    const project = await fetchJson<PurpurProject>("https://api.purpurmc.org/v2/purpur");
    return project.versions;
  }

  return listMojangVersions(includeSnapshots);
}

async function listPaperProjectVersions(projectName: string) {
  const project = await fetchJson<PaperProject>(`https://api.papermc.io/v2/projects/${projectName}`);
  return project.versions;
}

async function listMojangVersions(includeSnapshots: boolean) {
  const manifest = await fetchJson<MojangManifest>("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json");
  return manifest.versions
    .filter((version) => version.type === "release" || (includeSnapshots && version.type === "snapshot"))
    .map((version) => version.id);
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "EmberPanel/0.1" }
    });
    if (!response.ok) throw new Error(`Version provider returned ${response.status}`);
    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

function isModernMinecraftVersion(version: string) {
  return /^1\.(2[0-9]|[3-9][0-9])(\.\d+)?(-pre\d+|-rc\d+|w\d+[a-z])?$/.test(version);
}

function compareVersionsDescending(left: string, right: string) {
  return right.localeCompare(left, undefined, { numeric: true, sensitivity: "base" });
}
