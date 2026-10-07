import { useState, type FormEvent } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LanguageToggle, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-sidebar px-6 text-sidebar-foreground">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold">{t("appName")}</h1>
          <p className="mt-2 text-sm text-sidebar-muted">{t("checkingSession")}</p>
        </div>
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
          callbackURL: "/",
        });
        if (res.error) throw new Error(res.error.message || "Could not create account");
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (res.error) throw new Error(res.error.message || "Could not sign in");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Wrench className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">{t("appName")}</p>
              <p className="text-xs tracking-wide text-sidebar-muted uppercase">{t("dept")}</p>
            </div>
          </div>
          <LanguageToggle tone="dark" />
        </div>
        <div className="max-w-md space-y-4">
          <h1 className="font-display text-5xl leading-[0.95] font-semibold tracking-tight">
            {t("loginHero")}
          </h1>
          <p className="text-sm leading-relaxed text-sidebar-muted">{t("loginBody")}</p>
        </div>
        <p className="text-xs text-sidebar-muted">{t("loginFoot")}</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-start justify-between gap-3 lg:hidden">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Wrench className="size-4" />
                </span>
                <span className="font-display text-lg font-semibold">{t("appName")}</span>
              </div>
              <h1 className="font-display text-3xl font-semibold">{t("signIn")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("loginLeadMobile")}</p>
            </div>
            <LanguageToggle />
          </div>
          <div className="mb-6 hidden items-start justify-between gap-3 lg:flex">
            <div>
              <h1 className="font-display text-3xl font-semibold">{t("welcomeIn")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("loginLead")}</p>
            </div>
            <LanguageToggle />
          </div>

          {authEnabled ? (
            <>
              <div className="space-y-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="h-11 w-full"
                    onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                  >
                    {t("continueWith")} {p.label}
                  </Button>
                ))}
              </div>

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t("orEmail")}
                <span className="h-px flex-1 bg-border" />
              </div>

              <Tabs value={mode} onValueChange={setMode}>
                <TabsList className="w-full">
                  <TabsTrigger value="signin" className="flex-1">
                    {t("signIn")}
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1">
                    {t("createAccount")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={mode}>
                  <form className="space-y-3" onSubmit={onEmail}>
                    {mode === "signup" && (
                      <div className="space-y-1.5">
                        <Label htmlFor="name">{t("fullName")}</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password">{t("password")}</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="h-11 w-full" disabled={busy}>
                      {busy
                        ? t("pleaseWait")
                        : mode === "signup"
                          ? t("createAccount")
                          : t("signIn")}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t("signInDisabled")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
