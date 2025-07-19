/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import type { ClassValue } from "class-variance-authority/types";
import type { Control, FieldValues, Path } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import {
  File,
  FileText,
  ImageIcon,
  Music,
  Upload,
  UserCircle,
  Video,
  X,
} from "lucide-react";

import { cn, splitCamelCaseToWords, truncateFileName } from "@repo/design/lib/utils";

import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type FileVariant = "default" | "avatar";

interface CustomFileFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  variant?: FileVariant;
  avatarUploadButtonText?: string;
  allowPreview?: boolean;
  defaultPreview?: string; // URL/path to existing file for initial preview
  isNotLabeled?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  onFileSelect?: (files: FileList | null) => void;
  fieldClassName?: ClassValue;
  labelClassName?: ClassValue;
  inputClassName?: ClassValue;
  previewClassName?: ClassValue;
  dropzoneClassName?: ClassValue;
}

export function CustomFileField<T extends FieldValues>({
  control,
  name,
  label = "",
  placeholder = "Choose file or drag and drop",
  description = "",
  accept = "*/*",
  maxSize = 5, // 5MB default
  multiple = false,
  variant = "default",
  avatarUploadButtonText,
  allowPreview = true,
  defaultPreview = "",
  isNotLabeled = false,
  disabled = false,
  hidden = false,
  readOnly = false,
  onFileSelect,
  fieldClassName = "",
  labelClassName = "",
  inputClassName = "",
  previewClassName = "",
  dropzoneClassName = "",
}: CustomFileFieldProps<T>) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | React.ReactNode | null>(
    defaultPreview || null,
  );
  const [hasDefaultPreview, setHasDefaultPreview] = useState(!!defaultPreview);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial preview from defaultPreview prop
  useEffect(() => {
    if (defaultPreview) {
      setPreview(defaultPreview);
      setHasDefaultPreview(true);
    }
  }, [defaultPreview]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="size-6" />;
    if (fileType.startsWith("audio/")) return <Music className="size-6" />;
    if (fileType.startsWith("video/")) return <Video className="size-6" />;
    if (fileType.includes("pdf") || fileType.includes("document"))
      return <FileText className="size-6" />;
    return <File className="size-6" />;
  };

  const getAcceptedFileTypes = () => {
    if (accept.includes("image/*")) return "Images";
    if (accept.includes("audio/*")) return "Audio files";
    if (accept.includes("video/*")) return "Videos";
    if (accept.includes(".pdf")) return "PDF files";
    return "Files";
  };

  const validateFileSize = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= maxSize;
  };

  const handleFileChange = (
    files: FileList | null,
    onChange: (value: unknown) => void,
  ) => {
    if (!files || files.length === 0) {
      // If there's a default preview, revert to it, otherwise clear
      if (hasDefaultPreview && defaultPreview) {
        setPreview(defaultPreview);
        onChange(null); // Clear the form value but keep the preview
      } else {
        setPreview(null);
        onChange(null);
      }
      return;
    }

    const file = files[0];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!validateFileSize(file!)) {
      // Handle file size error
      console.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Clear the default preview flag since user selected a new file
    setHasDefaultPreview(false);

    if (allowPreview && file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, clear preview but keep file info
      setPreview(null);
    }

    onChange(multiple ? files : file);
    onFileSelect?.(files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    onChange: (value: unknown) => void,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files, onChange);
    }
  };

  const clearFile = (onChange: (value: unknown) => void) => {
    // If there's a default preview, revert to it
    if (hasDefaultPreview && defaultPreview) {
      setPreview(defaultPreview);
      onChange(null); // Clear the form value but show default preview
    } else {
      setPreview(null);
      onChange(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getCurrentPreviewSource = (field: { value: File | string | null }) => {
    // If user selected a new file and we have a preview, use it
    if (preview && !hasDefaultPreview) {
      return preview;
    }
    // If we have a default preview, use it
    if (defaultPreview) {
      return defaultPreview;
    }
    // If field has a value and it's a string (URL), use it
    if (field.value && typeof field.value === "string") {
      return field.value;
    }
    return null;
  };


  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn("space-y-[0.2px]", fieldClassName)}
          hidden={hidden}
        >
          {!isNotLabeled && (
            <FormLabel
              className={cn(
                "text-accent-foreground/80 text-sm font-medium capitalize",
                labelClassName,
              )}
            >
              {label || splitCamelCaseToWords(name)}
            </FormLabel>
          )}

          {variant === "avatar" ? (
            // Avatar upload variant for profile pictures
            <div className="flex items-center space-x-4">
              <div
                className={cn(
                  "border-secondary-foreground/30 relative h-20 w-20 overflow-hidden rounded-full border-2 border-dashed",
                  previewClassName,
                )}
              >
                {getCurrentPreviewSource(field) ? (
                  <img
                    src={getCurrentPreviewSource(field) as string}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-accent-foreground/30 flex h-full w-full items-center justify-center">
                    <UserCircle className="text-secondary size-full" />
                  </div>
                )}
                {(getCurrentPreviewSource(field) ?? field.value) &&
                  !readOnly && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => clearFile(field.onChange)}
                      size={"icon"}
                      className="bg-destructive size-fit rounded-full p-1"
                    >
                      <X />
                    </Button>
                  )}
              </div>
              <div className="flex-1">
                <FormControl>
                  <Input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled || readOnly}
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(e.target.files, field.onChange)
                    }
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || readOnly}
                  onClick={() => inputRef.current?.click()}
                >
                  {getCurrentPreviewSource(field)
                    ? "Change Profile"
                    : (avatarUploadButtonText ?? "Upload Avatar")}
                </Button>

                {fieldState.error ? (
                  <FormMessage className={cn("text-destructive text-sm")} />
                ) : (
                  <FormDescription className="text-sm">
                    {description || "Select a profile"}
                  </FormDescription>
                )}
              </div>
            </div>
          ) : (
            // Basic file upload
            <div
              className={cn(
                "border-secondary-foreground/30 relative w-full rounded-lg border-2 border-dashed bg-transparent p-6 transition-all duration-200",
                dropzoneClassName,
                {
                  "border-destructive/50 bg-destructive/5": fieldState.error,
                  "border-primary bg-primary/5": dragActive,
                  "border-primary/50 border-solid":
                    field.value || getCurrentPreviewSource(field),
                },
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, field.onChange)}
            >
              <FormControl>
                <Input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  disabled={disabled || readOnly}
                  className={cn(
                    "absolute inset-0 h-full w-full cursor-pointer opacity-0",
                    inputClassName,
                  )}
                  onChange={(e) =>
                    handleFileChange(e.target.files, field.onChange)
                  }
                />
              </FormControl>

              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                {getCurrentPreviewSource(field) && allowPreview ? (
                  <div className="relative">
                    <img
                      src={
                        (getCurrentPreviewSource(field) as string) ||
                        "/placeholder.svg"
                      }
                      alt="File preview"
                      className={cn(
                        "max-h-32 max-w-full rounded-lg object-contain",
                        previewClassName,
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => clearFile(field.onChange)}
                      size={"icon"}
                      className="bg-destructive size-fit rounded-full p-1"
                    >
                      <X />
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      {field.value ? "New file selected" : "Current file"}
                    </p>
                  </div>
                ) : field.value ? (
                  <div className="flex items-center space-x-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
                    {getFileIcon(field.value.type ?? "")}
                    <span className="flex flex-col gap-1 text-xs font-medium">
                      {/*eslint-disable-next-line @typescript-eslint/no-unnecessary-condition*/}
                      {truncateFileName(field.value.name as string, 20) ??
                        (typeof field.value === "object"
                          ? Object.entries(field.value).map(([_, file]) => (
                              <span key={_}>
                                {truncateFileName(
                                  (file as any).name as string,
                                  15,
                                )}
                              </span>
                            ))
                          : "File(s) selected")}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => clearFile(field.onChange)}
                      size={"icon"}
                      className="bg-destructive size-fit rounded-full p-1"
                    >
                      <X />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Upload className="size-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {placeholder}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getAcceptedFileTypes()} up to {maxSize}MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {variant !== "avatar" &&
            (fieldState.error ? (
              <FormMessage className={cn("text-destructive text-sm")} />
            ) : (
              <FormDescription className="text-sm">
                {description}
              </FormDescription>
            ))}
        </FormItem>
      )}
    />
  );
}
