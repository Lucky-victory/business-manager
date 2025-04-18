import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "./drawer";

export interface DrawerOrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
export const DrawerOrModal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: DrawerOrModalProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange} modal={true}>
          <DrawerContent className="pb-16">
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
            <div className="px-4">{children}</div>

            {footer && <DrawerFooter>{footer}</DrawerFooter>}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
          <DialogContent className="pointer-events-auto">
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            {children}

            {footer && <DialogFooter>{footer}</DialogFooter>}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
