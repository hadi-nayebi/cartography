import {createHash} from "node:crypto";
import {createReadStream} from "node:fs";
import {realpath, stat} from "node:fs/promises";
import {isAbsolute, relative, resolve, sep} from "node:path";

export function uploadPrivacy(args) {
  if (args.some((arg) => arg !== "--public")) throw new Error("unknown upload option");
  // Saved listing metadata is not a new publication instruction.
  return args.includes("--public") ? "public" : "private";
}

export function validateVideoSlug(slug) {
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("video slug must contain lowercase letters, numbers and single hyphens");
  }
  return slug;
}

export async function verifyUploadRender(directory, lock) {
  if (!lock || typeof lock.output !== "string" || !lock.output || isAbsolute(lock.output)) {
    throw new Error("render lock must name a relative output file");
  }
  if (!/^[a-f0-9]{64}$/i.test(lock.sha256 ?? "")) throw new Error("render lock requires SHA-256");
  const root = await realpath(directory);
  const file = await realpath(resolve(root, lock.output));
  const child = relative(root, file);
  if (!child || child === ".." || child.startsWith(`..${sep}`) || isAbsolute(child)) {
    throw new Error("render output must stay within its video directory");
  }
  const info = await stat(file);
  if (!info.isFile() || info.size === 0) throw new Error("render output must be a nonempty file");
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  const sha256 = hash.digest("hex");
  if (sha256 !== lock.sha256.toLowerCase()) throw new Error("render bytes differ from render.lock.json; re-render/review before upload");
  return {file, size: info.size, sha256};
}
