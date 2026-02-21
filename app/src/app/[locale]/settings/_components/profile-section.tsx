"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

type ProfileSectionProps = {
  user: User;
  profile: Tables<"users">;
};

export function ProfileSection({ user, profile }: ProfileSectionProps) {
  const t = useTranslations("settings");
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [saving, setSaving] = useState(false);

  const avatarUrl =
    profile.avatar_url ?? user.user_metadata?.avatar_url ?? undefined;
  const initials = (displayName || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasChanges =
    displayName !== (profile.display_name ?? "") || bio !== (profile.bio ?? "");

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update({
          display_name: displayName || null,
          bio: bio || null,
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast.success(t("saved"));
    } catch {
      toast.error(t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-neutral-200">
            {t("profileTitle")}
          </CardTitle>
          <p className="text-sm text-neutral-500">{t("profileDescription")}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} alt={displayName || "Avatar"} />
              <AvatarFallback className="bg-neutral-800 text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-neutral-200">
                {t("avatarTitle")}
              </p>
              <p className="text-xs text-neutral-500">
                {t("avatarDescription")}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="displayName"
              className="text-sm font-medium text-neutral-200"
            >
              {t("displayName")}
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("displayNamePlaceholder")}
              maxLength={50}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="bio"
              className="text-sm font-medium text-neutral-200"
            >
              {t("bio")}
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder")}
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-neutral-600">{bio.length}/160</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving || !hasChanges}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
