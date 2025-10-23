import type { ClassValue } from "class-variance-authority/types";
import { File } from "lucide-react";

import { cn } from "../lib/utils";

interface FileIconTemplateProps {
  fileExtension: string;
  fileFormat: "image" | "document";
  className?: ClassValue;
}

/**
 *
 * @param extension The file extension (e.g., 'pdf', 'docx', 'png', '.pdf')
 * @returns
 */
export function FileIconTemplate({
  fileExtension,
  fileFormat,
  className = "",
}: FileIconTemplateProps) {
  const formattedExtension = fileExtension.startsWith(".")
    ? fileExtension.slice(1).toLowerCase()
    : fileExtension.toLowerCase();

  let classForFile = "";

  switch (formattedExtension) {
    case "pdf":
      classForFile =
        "bg-[#d92d20]/5 [&_svg]:fill-[#d92d20] [&_svg]:text-[#d92d20]/40";
      break;

    case "doc":
    case "docx":
      classForFile =
        "bg-[#155eef]/5 [&_svg]:fill-[#155eef] [&_svg]:text-[#155eef]/40";
      break;

    case "csv":
    case "xls":
    case "xlsx":
      classForFile =
        "bg-[#079455]/5 [&_svg]:fill-[#079455] [&_svg]:text-[#079455]/40";
      break;

    default:
      classForFile =
        "bg-[#7f56d9]/5 [&_svg]:fill-transparent [&_svg]:text-slate-300";
      break;
  }
  return (
    <div
      className={cn(
        "relative flex size-fit items-center justify-center rounded-sm p-[4px]",
        classForFile,
        className,
      )}
    >
      <div className="relative size-fit">
        <File className="size-full" />
        <span
          className={cn(
            "absolute text-[5px] text-white uppercase",
            { "bottom-[12%] left-[24%]": fileFormat === "document" },
            {
              "bottom-[12%] left-[10%] rounded-xs bg-[#7f56d9] px-[1px] py-[0.3px]":
                fileFormat === "image",
            },
          )}
        >
          {formattedExtension}
        </span>
      </div>
    </div>
  );
}
