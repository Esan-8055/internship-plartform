"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, User, FileText, Globe, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const onSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <div className="hidden md:flex items-center gap-2 max-w-md flex-1">
        <div 
          className="relative w-full cursor-pointer group"
          onClick={() => setOpen(true)}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <div className="pl-10 h-10 w-full bg-white border border-slate-200 rounded-xl flex items-center text-slate-400 text-sm hover:border-blue-200 transition-all shadow-sm">
            Search…
            <kbd className="ml-auto mr-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type to search interns, tasks, domains..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>
          
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => onSelect(result.url)}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    result.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    result.type === 'task' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {result.type === 'user' ? <User size={16} /> :
                     result.type === 'task' ? <FileText size={16} /> :
                     <Globe size={16} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{result.title}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{result.subtitle}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
