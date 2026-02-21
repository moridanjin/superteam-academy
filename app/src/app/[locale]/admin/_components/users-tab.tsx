"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FadeInStagger, FadeInItem } from "@/components/motion";
import type { AdminUserRow } from "@/lib/services/admin-service";

type UsersTabProps = {
  users: AdminUserRow[];
};

export function UsersTab({ users }: UsersTabProps) {
  const t = useTranslations("admin");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) => u.displayName.toLowerCase().includes(q));
  }, [users, searchQuery]);

  return (
    <FadeInStagger className="space-y-4">
      <FadeInItem>
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder={t("usersSearchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </FadeInItem>

      <FadeInItem>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
            <p className="text-sm text-neutral-500">{t("usersEmpty")}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-[1fr_80px_80px_90px] gap-4 border-b border-white/[0.06] px-4 py-3 text-xs font-medium text-neutral-500">
              <span>{t("colUser")}</span>
              <span className="text-right">{t("colXp")}</span>
              <span className="text-right">{t("colLevel")}</span>
              <span className="text-right">{t("colRole")}</span>
            </div>

            {filtered.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1fr_80px_80px_90px] items-center gap-4 border-b border-white/[0.04] px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user.displayName}
                  </p>
                  <p className="truncate font-mono text-xs text-neutral-600">
                    {user.id.slice(0, 8)}...
                  </p>
                </div>
                <p className="text-right text-sm text-neutral-300">
                  {user.totalXp.toLocaleString()}
                </p>
                <p className="text-right text-sm text-neutral-300">
                  {user.level}
                </p>
                <div className="flex justify-end">
                  {user.isAdmin ? (
                    <Badge className="bg-solana-purple/20 text-solana-purple border-0 text-xs">
                      Admin
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs text-neutral-500"
                    >
                      User
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeInItem>
    </FadeInStagger>
  );
}
