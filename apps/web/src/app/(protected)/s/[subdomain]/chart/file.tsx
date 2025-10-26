"use client";

import { useCallback, useEffect, useState } from "react";

import { authClient } from "~/auth/client";

interface StoredFile {
  name: string;
  size: number;
  handle: FileSystemFileHandle;
  uploadedAt: number;
  uploadedBy: string;
}

async function hashString(contents: string | ArrayBuffer) {
  const encoder = new TextEncoder();
  const data =
    typeof contents === "string" ? encoder.encode(contents) : contents;
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export function OPFSUploader() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<
    "image" | "pdf" | "text" | "unsupported" | null
  >(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const { data: session } = authClient.useSession();
  // const { data: organizations } = authClient.useListOrganizations();

  // 🔹 Initialize OPFS and list files
  const listFiles = useCallback(async () => {
    if (!session?.user.id) return;
    try {
      const root = await navigator.storage.getDirectory();
      const uploadDir = await root.getDirectoryHandle("uploads", {
        create: true,
      });
      const newFiles: StoredFile[] = [];

      for await (const [name, handle] of uploadDir) {
        if (handle.kind === "file") {
          const file = await handle.getFile();
          newFiles.push({
            name,
            size: file.size,
            handle,
            uploadedAt: Date.now(),
            uploadedBy: session.user.id,
          });
        }
      }

      setFiles(newFiles);
    } catch (err) {
      console.error("Error listing OPFS files:", err);
    } finally {
      // setIsLoading(false);
    }
  }, [session?.user.id]);
  useEffect(() => {
    listFiles().catch(console.error);
  }, [listFiles]);

  // 🔹 Save files to OPFS
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event");
    console.log(event.target.files);
    const selected = event.target.files;
    if (!selected?.length) {
      console.log("no files selected");
      return;
    }

    await navigator.storage.persist();
    const root = await navigator.storage.getDirectory();
    const uploadDir = await root.getDirectoryHandle("uploads", {
      create: true,
    });

    for (const file of selected) {
      const arrayBuffer = await file.arrayBuffer();

      console.time("hash");
      const hash = await hashString(arrayBuffer);
      console.timeEnd("hash");
      console.log("file hash", hash);

      console.time("save file");
      const fileHandle = await uploadDir.getFileHandle(file.name, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(arrayBuffer);
      await writable.close();
      console.timeEnd("save file");
    }

    await listFiles();
  };

  // 🔹 Download file
  const handleDownload = async (fileHandle: FileSystemFileHandle) => {
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🔹 Delete file
  const handleDelete = async (name: string) => {
    const root = await navigator.storage.getDirectory();
    const uploadDir = await root.getDirectoryHandle("uploads");
    await uploadDir.removeEntry(name);
    await listFiles();
  };

  // 🔹 Preview file
  const handlePreview = async (
    fileHandle: FileSystemFileHandle,
    name: string,
  ) => {
    // Cleanup previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewText(null);
    setPreviewUrl(null);
    setPreviewKind(null);
    setPreviewName(name);

    const file = await fileHandle.getFile();
    const mime = file.type || "";

    if (mime.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewKind("image");
      return;
    }

    if (mime === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewKind("pdf");
      return;
    }

    if (mime.startsWith("text/") || name.toLowerCase().endsWith(".csv")) {
      const text = await file.text();
      setPreviewText(text);
      setPreviewKind("text");
      return;
    }

    // Many spreadsheet formats (xlsx) aren't previewable without extra libs
    setPreviewKind("unsupported");
  };

  // Cleanup object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <h1 className="text-xl font-semibold">📁 OPFS File Uploader</h1>

      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="block w-full rounded border p-2"
      />

      {files.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        <ul className="divide-y">
          {files.map(({ name, size, handle }) => (
            <li key={name} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">
                  {(size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(handle, name)}
                  className="text-green-600 hover:underline"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleDownload(handle)}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(name)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {previewKind && (
        <div className="mt-4 rounded border p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium">
              Preview{previewName ? `: ${previewName}` : ""}
            </p>
            <button
              className="text-sm text-gray-600 hover:underline"
              onClick={() => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setPreviewText(null);
                setPreviewKind(null);
                setPreviewName(null);
              }}
            >
              Close
            </button>
          </div>

          {previewKind === "image" && previewUrl && (
            <img
              src={previewUrl}
              alt={previewName ?? "Preview"}
              className="max-h-[60vh] w-full object-contain"
            />
          )}

          {previewKind === "pdf" && previewUrl && (
            <iframe
              src={(() => {
                try {
                  const url = new URL(previewUrl);
                  // Append viewer params via hash to hint supported viewers to hide UI
                  const base = `${url.toString().split("#")[0]}`;
                  const hash = url.hash
                    ? `${url.hash}&toolbar=0&navpanes=0&scrollbar=0`
                    : `#toolbar=0&navpanes=0&scrollbar=0`;
                  return `${base}${hash}`;
                } catch {
                  // Fallback for blob:/object URLs not parseable by URL()
                  return `${previewUrl}${previewUrl.includes("#") ? "&" : "#"}toolbar=0&navpanes=0&scrollbar=0`;
                }
              })()}
              title={previewName ?? "PDF Preview"}
              className="h-[70vh] w-full"
            />
          )}

          {previewKind === "text" && previewText !== null && (
            <pre className="h-[60vh] w-full overflow-auto rounded bg-gray-50 p-3 text-sm">
              {previewText}
            </pre>
          )}

          {previewKind === "unsupported" && (
            <div className="text-sm text-gray-600">
              Preview not available for this file type. Please download to view.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
