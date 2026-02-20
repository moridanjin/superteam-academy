"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type ProfileEditDialogProps = {
  profile: Tables<"users">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProfileEditDialog({
  profile,
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const t = useTranslations("profile");
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [saving, setSaving] = useState(false);

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
      toast.success(t("profileUpdated"));
      onOpenChange(false);
    } catch {
      toast.error(t("profileUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("editProfileTitle")}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("editProfileTitle")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-200">
              {t("displayName")}
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-200">
              {t("bio")}
            </label>
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder")}
              maxLength={160}
            />
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {t("saveProfile")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
