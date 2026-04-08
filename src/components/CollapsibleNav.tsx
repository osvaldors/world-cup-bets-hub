import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    path?: string;
    icon?: React.ReactNode;
    children?: NavItem[];
}

interface CollapsibleNavProps {
    item: NavItem;
    level?: number;
}

export function CollapsibleNav({ item, level = 0 }: CollapsibleNavProps) {
    const location = useLocation();
    const hasActiveChild = item.children?.some(child =>
        location.pathname === child.path ||
        child.children?.some(subChild => location.pathname === subChild.path)
    );
    const [isOpen, setIsOpen] = useState(hasActiveChild ?? false);

    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path ? location.pathname === item.path : false;

    const paddingLeft = level === 0 ? "pl-4" : level === 1 ? "pl-8" : "pl-12";

    if (!hasChildren && item.path) {
        return (
            <Link
                to={item.path}
                className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-muted/50",
                    paddingLeft,
                    isActive && "bg-primary/10 text-primary font-medium"
                )}
            >
                {item.icon}
                <span className="text-sm">{item.label}</span>
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all hover:bg-muted/50",
                    paddingLeft,
                    (isActive || hasActiveChild) && "text-primary font-medium"
                )}
            >
                <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                </div>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                    <ChevronRight className="h-4 w-4 transition-transform" />
                )}
            </button>

            {isOpen && hasChildren && (
                <div className="mt-1 space-y-1">
                    {item.children.map((child, index) => (
                        <CollapsibleNav key={index} item={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}