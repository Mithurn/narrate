import { Link } from "wouter";
import { Menu, X, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  title: string;
  bookmarkCount?: number;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function Navbar({
  title,
  bookmarkCount = 0,
  onMenuClick,
  showMenu = false,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-9 w-9 p-0"
            onClick={onMenuClick}
          >
            {showMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <Link
            href="/"
            className="font-serif font-bold text-lg hidden md:block"
          >
            Narrate
          </Link>
          <span className="text-foreground/40 hidden md:block">/</span>
          <h1 className="font-medium text-foreground/80">{title}</h1>
        </div>

        <Link href="/bookmarks">
          <Button variant="ghost" size="sm" className="gap-2">
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {bookmarkCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
