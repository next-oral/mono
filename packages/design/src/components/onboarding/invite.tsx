import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const Invite = ({
  type = "link",
  onTypeChange,
}: {
  type: "email" | "link";
  onTypeChange: () => void;
}) => {
  return (
    <div className="h-full w-full p-6">
      <h3 className="text-lg">Invite teammates</h3>
      <p className="text-muted-foreground text-sm">
        {type === "email"
          ? "Share this link with others you'd like to join your clinic."
          : "Add the email(s) of the people you want to invite. Separate multiple emails with commas."}
      </p>
      <div className="mt-4 space-y-2">
        {type === "email" ? (
          <Input />
        ) : (
          <Textarea placeholder="cgeorge@gmail.com,kona@outlook.com" />
        )}
        <div className="flex justify-between">
          <Button onClick={onTypeChange} variant="link" className="p-0">
            Invite by {` ${type === "link" ? "email" : "link"}`}
          </Button>
          <Button>Copy</Button>
        </div>
      </div>
    </div>
  );
};
