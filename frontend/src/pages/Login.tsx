import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ArrowRight, Mail, Lock } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        navigate("/onboarding");
    };

    return (
        <div className="space-y-6">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Enter your details to sign in to your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input type="email" placeholder="Email Address" className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input type="password" placeholder="Password" className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange" required />
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
                >
                    Login <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-howl-navy lg:bg-transparent px-2 text-muted-foreground px-2">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="bg-black/20 border-white/10 text-white hover:bg-white/10 hover:text-white">
                    Google
                </Button>
                <Button variant="outline" className="bg-black/20 border-white/10 text-white hover:bg-white/10 hover:text-white">
                    Apple
                </Button>
            </div>

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
