import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register(email, password, displayName);
            navigate("/onboarding");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">Join the Pack</h1>
                <p className="text-muted-foreground">Create an account to start your adventure.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange"
                        required
                        disabled={isLoading}
                    />
                </div>
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
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange"
                        required
                        minLength={6}
                        disabled={isLoading}
                    />
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
                            Creating account...
                        </>
                    ) : (
                        <>
                            Create Account <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-howl-orange hover:underline underline-offset-4">
                    Login here
                </Link>
            </p>
        </div>
    );
};

export default Register;

