import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {mkdtemp, mkdir, rm, symlink, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {uploadPrivacy, validateVideoSlug, verifyUploadRender} from "./upload-preflight.mjs";

test("publication requires an explicit flag, never saved metadata", () => {
  assert.equal(uploadPrivacy([]), "private");
  assert.equal(uploadPrivacy(["--public"]), "public");
  assert.throws(() => uploadPrivacy(["--publc"]), /unknown/);
  assert.throws(() => validateVideoSlug("../other-channel"));
  assert.equal(validateVideoSlug("nyc-libraries-2026-01"), "nyc-libraries-2026-01");
});

test("actual render bytes must match; escaped paths and symlinks fail", async () => {
  const root = await mkdtemp(join(tmpdir(), "cartography-upload-"));
  try {
    const video = join(root, "video");
    await mkdir(video);
    const bytes = Buffer.from("controlled render fixture");
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    await writeFile(join(video, "render.mp4"), bytes);
    const lock = {output: "render.mp4", sha256};
    assert.equal((await verifyUploadRender(video, lock)).size, bytes.length);
    await writeFile(join(video, "render.mp4"), "replaced after review");
    await assert.rejects(verifyUploadRender(video, lock), /bytes differ/);
    await assert.rejects(verifyUploadRender(video, {output:"render.mp4"}), /SHA-256/);
    await writeFile(join(root, "outside.mp4"), bytes);
    await assert.rejects(verifyUploadRender(video, {...lock, output:"../outside.mp4"}), /within/);
    await symlink(join(root,"outside.mp4"), join(video,"link.mp4"));
    await assert.rejects(verifyUploadRender(video, {...lock, output:"link.mp4"}), /within/);
    await assert.rejects(verifyUploadRender(video, {...lock, output:join(root,"outside.mp4")}), /relative/);
  } finally { await rm(root, {recursive:true, force:true}); }
});
