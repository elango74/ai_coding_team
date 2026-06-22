import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Route = createFileRoute('/sign-in')({
    component: SignInPage,
});

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Automatically update the browser tab title when this page loads
    useEffect(() => {
        document.title = "Login | AI Software Engineering";
    }, []);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const data = await response.json();

            // Save token and redirect
            localStorage.setItem('ai_workspace_token', data.access_token);
            navigate({ to: '/' });

        } catch (err: any) {
            setError(err.message || 'Failed to connect to the server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Light pastel gradient matching your landing page
        <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] via-[#f4f1fa] to-[#fceef1] text-[#2a2456] flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">

            {/* Background ambient soft purple glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b0a1ea]/20 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Main Two-Column Container */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row relative z-10">

                {/* Left Column: Welcome & Google Auth */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:pr-20">
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-6 text-[#2a2456]">
                        LOGIN
                    </h1>

                    <div className="text-[#2a2456]/70 mb-10 text-sm md:text-base font-medium leading-relaxed">
                        <p>Hey welcome back!</p>
                        <p>We hope you had a great day</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => alert('Google OAuth coming soon!')}
                        className="flex items-center justify-center gap-4 w-fit px-6 py-3 rounded-full border border-[#2a2456]/10 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all mb-16 shadow-sm cursor-pointer"
                    >
                        {/* Embedded Google Logo SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.408 1.678l2.841-2.841C17.34 1.96 14.898.909 12 .909a11.111 11.111 0 00-9.878 6.136l3.144 2.72z" />
                            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.806l-3.143 2.72A11.111 11.111 0 0012 23.091c2.922 0 5.32-.987 7.108-2.656l-3.068-2.422z" />
                            <path fill="#4A90E2" d="M19.834 16.292A11.008 11.008 0 0021.09 12c0-.765-.067-1.5-.195-2.182H12v4.272h5.205c-.23 1.4-.95 2.59-2.035 3.385l3.068 2.422a10.84 10.84 0 001.596-3.605z" />
                            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.783.136-1.54.37-2.235L2.135 7.045A11.05 11.05 0 00.91 12c0 1.76.41 3.42 1.144 4.89l3.223-2.622z" />
                        </svg>
                        <span className="text-sm text-[#2a2456] font-bold">Sign in with Google</span>
                    </button>

                    <div className="text-sm text-[#2a2456]/60 mt-auto pt-8 font-medium">
                        Not yet a member? <a href="#" className="text-[#b0a1ea] font-extrabold ml-1 hover:text-[#9d8ce0] transition-colors">Sign Up</a>
                    </div>
                </div>

                {/* Right Column: Light Glassmorphism Login Card */}
                <div className="w-full md:w-1/2 flex items-center mt-8 md:mt-0">
                    <div className="w-full bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgba(42,36,86,0.04)]">
                        <form onSubmit={handleSignIn} className="space-y-6">

                            {error && (
                                <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-100 rounded-xl">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="font-medium">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <label className="text-[#2a2456]/80 text-sm px-2 font-bold tracking-wide">E-Mail</label>
                                <input
                                    type="email"
                                    placeholder="E.g. developer@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/80 border border-[#b0a1ea]/20 focus:border-[#b0a1ea] focus:ring-2 focus:ring-[#b0a1ea]/20 rounded-full h-12 px-6 text-[#2a2456] placeholder:text-[#2a2456]/40 outline-none transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[#2a2456]/80 text-sm px-2 font-bold tracking-wide">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        // Added pr-12 (padding-right) so text doesn't hide behind the eye icon
                                        className="w-full bg-white/80 border border-[#b0a1ea]/20 focus:border-[#b0a1ea] focus:ring-2 focus:ring-[#b0a1ea]/20 rounded-full h-12 pl-6 pr-12 text-[#2a2456] placeholder:text-[#2a2456]/40 outline-none transition-all text-sm font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2a2456]/50 hover:text-[#2a2456] transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#b0a1ea] hover:bg-[#9d8ce0] text-white font-bold h-12 rounded-full transition-all flex items-center justify-center tracking-wider text-sm shadow-md shadow-[#b0a1ea]/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            CONNECTING...
                                        </>
                                    ) : (
                                        'LOGIN'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}