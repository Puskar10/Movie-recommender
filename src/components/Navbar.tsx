'use client';

import { useState } from 'react';
import type { ElementType } from 'react';
import { Film, Menu, Search, Sparkles, Tv, X } from 'lucide-react';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import { ActiveTab } from '../types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

type TabItem = {
  id: ActiveTab;
  label: string;
  icon: ElementType;
};

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const tabs: TabItem[] = [
    { id: 'all', label: 'Discover', icon: Sparkles },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'Web Series', icon: Tv },
  ];

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('all')}
          className="group flex items-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: -8, scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 text-white shadow-lg shadow-violet-500/25"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <Film className="relative z-10 h-6 w-6" />
          </motion.div>

          <div className="flex flex-col items-start leading-none">
            <span className="text-xl font-black tracking-tight text-foreground">
              Cine
              <span className="bg-gradient-to-r from-violet-500 to-rose-500 bg-clip-text text-transparent">
                Verse
              </span>
            </span>

            <span className="mt-1 hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:block">
              Movie Recommender
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center rounded-full border bg-muted/60 p-1.5 shadow-inner md:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`relative h-10 rounded-full px-5 text-sm font-semibold ${
                  isActive
                    ? 'text-white hover:text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-desktop-tab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 shadow-md shadow-violet-500/25"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </span>
              </Button>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <motion.div
            animate={{ width: isSearchFocused ? 300 : 230 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className={`relative hidden h-11 items-center rounded-full border bg-muted/50 px-4 transition-all sm:flex ${
              isSearchFocused
                ? 'border-violet-400 ring-4 ring-violet-500/10'
                : 'border-border'
            }`}
          >
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />

            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search movies, shows..."
              className="h-full border-0 bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
            />

            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="ml-1 h-7 w-7 rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </motion.div>

          <div className="rounded-full border bg-muted/50 p-1">
            <ThemeToggle />
          </div>

          {/* Mobile Sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[86%] max-w-sm border-l bg-background/95 p-0 backdrop-blur-2xl"
            >
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b px-5 py-5 text-left">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-rose-500 text-white">
                      <Film className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-lg font-black">
                        Cine
                        <span className="bg-gradient-to-r from-violet-500 to-rose-500 bg-clip-text text-transparent">
                          Verse
                        </span>
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Discover movies and web series
                      </p>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-7 px-5 py-6">
                  {/* Mobile Search */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      Search
                    </p>

                    <div className="flex h-12 items-center rounded-2xl border bg-muted/50 px-4">
                      <Search className="mr-3 h-4 w-4 text-muted-foreground" />

                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movies, shows..."
                        className="h-full border-0 bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
                      />

                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSearchQuery('')}
                          className="h-8 w-8 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Tabs */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      Browse
                    </p>

                    <div className="grid gap-2">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                          <Button
                            key={tab.id}
                            variant={isActive ? 'default' : 'outline'}
                            onClick={() => handleTabChange(tab.id)}
                            className={`h-14 justify-start rounded-2xl px-4 text-sm font-semibold ${
                              isActive
                                ? 'border-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 text-white shadow-lg shadow-violet-500/25 hover:text-white'
                                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Icon className="mr-3 h-4 w-4" />
                            {tab.label}

                            {isActive && (
                              <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Premium Card */}
                  <div className="mt-auto rounded-3xl border bg-muted/50 p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-rose-500 text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <h3 className="text-sm font-bold text-foreground">
                      Find your next favorite watch
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Explore trending movies, top rated series, and personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}