"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, Trash2, Loader2 } from "lucide-react";

export function DangerZoneSection() {
  const t = useTranslations("settings");
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-neutral-200">
            {t("dangerTitle")}
          </CardTitle>
          <p className="text-sm text-neutral-500">{t("dangerDescription")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-4 py-4">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                {t("signOutTitle")}
              </p>
              <p className="text-xs text-neutral-500">
                {t("signOutDescription")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {t("signOutButton")}
            </Button>
          </div>

          <div className="border-destructive/30 bg-destructive/5 flex items-center justify-between rounded-md border px-4 py-4">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                {t("deleteTitle")}
              </p>
              <p className="text-xs text-neutral-500">
                {t("deleteDescription")}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                  {t("deleteButton")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("deleteConfirmDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("deleteCancel")}</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">
                    {t("deleteConfirmButton")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
