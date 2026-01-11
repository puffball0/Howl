import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            navigate("/home");
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Enter your details to sign in to your account.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-600 bg-black/20 text-howl-orange focus:ring-howl-orange" />
                        <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <Link to="#" className="text-howl-orange hover:text-howl-burnt transition-colors">Forgot Password?</Link>
                </div>

                <Button
                    type="submit"
                    variant="adventure"
                    className="w-full text-lg py-6"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Login <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </form>



            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-bold text-howl-orange hover:underline underline-offset-4">
                    Call your pack
                </Link>
            </p>
        </div>
    );
};

export default Login;

