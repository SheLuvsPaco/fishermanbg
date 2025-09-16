import { supabase } from "../lib/supabase";
import { useState, useEffect, createContext, useContext } from "react";

async function ensureProfile(userId: string, email: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (!data) {
    await supabase.from("profiles").insert({
      id: userId,
      username: email.split("@")[0], // default username
      profile_pic: null,
      rank: "Rookie Silver Fish",
      badges: [],
    });
  }
}

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

type AuthContextType = {
  user: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      
      if (sessionUser) {
        ensureProfile(sessionUser.id, sessionUser.email || '');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      
      if (sessionUser) {
        ensureProfile(sessionUser.id, sessionUser.email || '');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-6">Зареждане…</div>;

  if (!session) {
    return (
      <div className="p-6 pt-10 pb-24 md:pb-28 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Влез в приложението</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);

            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) setError(error.message);
            else if (data.user) setSession(data.session);
          }}
        >
          <input
            type="email"
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-black"
            required
          />
          <input
            type="password"
            placeholder="Парола"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-ocean-500 text-white font-semibold rounded-xl py-3 hover:bg-ocean-600 transition"
          >
            Влез
          </button>
        </form>

        <button
          onClick={async () => {
            if (!email) return setError("Въведи имейл, за да се регистрираш.");
            const { error } = await supabase.auth.signUp({
              email,
              password,
            });
            if (error) {
              if (error.message.includes('over_email_send_rate_limit') || (error.message.includes('after') && error.message.includes('seconds'))) {
                setError('Твърде много опити за регистрация. Моля, изчакайте 49 секунди, преди да опитате отново.');
              } else {
                setError(error.message);
              }
            }
            else alert("Провери имейла си за потвърждение.");
          }}
          className="w-full mt-4 bg-gray-700 text-white font-semibold rounded-xl py-3 hover:bg-gray-800 transition"
        >
          Регистрация
        </button>

        {error && <p className="text-red-400 mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}