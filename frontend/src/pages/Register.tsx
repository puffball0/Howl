import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate reg
        navigate("/onboarding");
    };

    return (
        <div className="space-y-6">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">Join the Pack</h1>
                <p className="text-muted-foreground">Create an account to start your adventure.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input type="text" placeholder="First Name" className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange" required />
                    </div>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input type="text" placeholder="Last Name" className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange" required />
                    </div>
                </div>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input type="email" placeholder="Email Address" className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange" required />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input type="password" placeholder="Password" className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-howl-orange" required />
                </div>

                <Button
                    type="submit"
                    variant="adventure"
                    className="w-full text-lg py-6"
                >
                    Create Account <ArrowRight className="ml-2 h-5 w-5" />
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
