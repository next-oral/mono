import type { ClassValue } from "class-variance-authority/types";
import { cn } from "../lib/utils";
import { File } from "lucide-react";

interface FileIconTemplateProps {
    fileExtension: string;
    fileFormat: 'image' | 'document';
    className?: ClassValue;
}

/**
 * 
 * @param extension The file extension (e.g., 'pdf', 'docx', 'png', '.pdf')
 * @returns 
 */
export function FileIconTemplate({ fileExtension, fileFormat, className = "" }: FileIconTemplateProps) {
    const formattedExtension = fileExtension.startsWith(".")
        ? fileExtension.slice(1).toLowerCase()
        : fileExtension.toLowerCase();

    let classForFile = "";

    switch (formattedExtension) {
        case 'pdf':
            classForFile = "bg-[#d92d20]/5 [&_svg]:fill-[#d92d20] [&_svg]:text-[#d92d20]/40";
            break;

        case 'doc':
        case 'docx':
            classForFile = "bg-[#155eef]/5 [&_svg]:fill-[#155eef] [&_svg]:text-[#155eef]/40";
            break;

        case 'csv':
        case 'xls':
        case 'xlsx':
            classForFile = "bg-[#079455]/5 [&_svg]:fill-[#079455] [&_svg]:text-[#079455]/40";
            break;

        default:
            classForFile = "bg-[#7f56d9]/5 [&_svg]:fill-transparent [&_svg]:text-slate-300";
            break;
    }
    return (
        <div className={cn("bg-secondary/60 size-fit py-2 px-3 rounded-lg relative flex items-center justify-center ", classForFile, className)}>
            <div className="relative size-fit">
                <File className="size-10" />
                <span className={cn("text-[7px] uppercase text-white absolute",
                    { "bottom-[12%] left-[24%]": fileFormat === "document" },
                    { "bg-[#7f56d9] py-[0.3px] px-[1px] bottom-[12%] left-[10%] rounded-xs": fileFormat === "image" }
                )}>{formattedExtension}</span>
            </div>

        </div>
    );
};