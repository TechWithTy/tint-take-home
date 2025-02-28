import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuoteCard } from "./quoteCard";
interface QuoteResultDialogProps {
    open: boolean;
    onClose: () => void;
    quote: any; // Adjust type based on API response
}

const QuoteResultDialog: React.FC<QuoteResultDialogProps> = ({ open, onClose, quote }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="z-[9999] bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle>Generated Insurance Quote</DialogTitle>
                    <DialogDescription>
                        Below is the custom insurance quote based on your inputs.
                    </DialogDescription>
                </DialogHeader>

                {/* ✅ Display the Quote using QuoteCard */}
                <QuoteCard quote={quote} />

                <DialogFooter>
                    <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuoteResultDialog;
