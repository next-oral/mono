import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export function AddCsv() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="justify-start border-none shadow-none"
                >
                    Upload CSV
                </Button>
            </DialogTrigger>
            <DialogContent></DialogContent>
        </Dialog>
    );
}
