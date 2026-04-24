
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "../../hooks/use-mobile.jsx";
import { cn } from "../../lib/utils";
import { Button } from "./button.jsx";
import { Input } from "./input.jsx";
import { Separator } from "./separator.jsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./sheet.jsx";
import { Skeleton } from "./skeleton.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip.jsx";

/* ================= CONTEXT ================= */

const SidebarContext = React.createContext(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

/* ================= PROVIDER ================= */

export const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);

    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value) => {
        const next = typeof value === "function" ? value(open) : value;
        if (onOpenChange) onOpenChange(next);
        else _setOpen(next);

        document.cookie = `sidebar_state=${next}; path=/; max-age=${60 * 60 * 24 * 7}`;
      },
      [open, onOpenChange]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((prev) => !prev)
        : setOpen((prev) => !prev);
    }, [isMobile, setOpen]);

    React.useEffect(() => {
      const handler = (e) => {
        if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    return (
      <SidebarContext.Provider
        value={{
          state,
          open,
          setOpen,
          openMobile,
          setOpenMobile,
          isMobile,
          toggleSidebar,
        }}
      >
        <TooltipProvider delayDuration={0}>
          <div
            ref={ref}
            style={{
              "--sidebar-width": "16rem",
              "--sidebar-width-icon": "3rem",
              ...style,
            }}
            className={cn("flex min-h-screen w-full", className)}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);

/* ================= SIDEBAR ================= */

export const Sidebar = React.forwardRef(
  ({ side = "left", children, className, ...props }, ref) => {
    const { isMobile, openMobile, setOpenMobile, state } = useSidebar();

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side={side} className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Mobile sidebar</SheetDescription>
            </SheetHeader>
            {children}
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn("hidden md:flex flex-col w-64 border-r", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/* ================= TRIGGER ================= */

export const SidebarTrigger = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", className)}
        onClick={(e) => {
          if (onClick) onClick(e);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft />
      </Button>
    );
  }
);

/* ================= CONTENT ================= */

export const SidebarHeader = ({ className, ...props }) => (
  <div className={cn("p-4 border-b", className)} {...props} />
);

export const SidebarFooter = ({ className, ...props }) => (
  <div className={cn("p-4 border-t mt-auto", className)} {...props} />
);

export const SidebarContent = ({ className, ...props }) => (
  <div className={cn("flex-1 overflow-auto p-2", className)} {...props} />
);

export const SidebarInput = React.forwardRef((props, ref) => (
  <Input ref={ref} className="h-8" {...props} />
));

export const SidebarSeparator = (props) => <Separator {...props} />;

/* ================= MENU ================= */

export const SidebarMenu = ({ className, ...props }) => (
  <ul className={cn("flex flex-col gap-1", className)} {...props} />
);

export const SidebarMenuItem = ({ className, ...props }) => (
  <li className={cn("relative", className)} {...props} />
);

export const SidebarMenuButton = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted",
          className
        )}
        {...props}
      />
    );
  }
);

export const SidebarGroup = ({ className, ...props }) => (
  <div className={cn("px-2 py-2", className)} {...props} />
);

export const SidebarGroupLabel = ({ className, ...props }) => (
  <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props} />
);

export const SidebarGroupContent = ({ className, ...props }) => (
  <div className={cn("", className)} {...props} />
);

/* ================= EXTRA ================= */

export const SidebarSkeleton = () => (
  <div className="flex items-center gap-2 p-2">
    <Skeleton className="h-4 w-4" />
    <Skeleton className="h-4 w-full" />
  </div>
);
