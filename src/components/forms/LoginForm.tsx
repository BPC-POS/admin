"use client";

import React, { useState } from "react";
import {
    TextField,
    Button as MuiButton,
    IconButton as MuiIconButton,
    InputAdornment,
    CircularProgress
} from "@mui/material";
import {
    VisibilityOff,
    Visibility,
    Facebook,
    Google,
    AccountCircle,
    Key,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/api/auth";

interface LoginFormProps {
    setLoading?: (isLoading: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoading: setParentLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = (loadingState: boolean) => {
        setIsLoading(loadingState);
        if (setParentLoading) {
            setParentLoading(loadingState);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setLoading(true);

        try {
            const response = await signIn(email, password);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            router.push('/admin/dashboard');
        } catch (error: unknown) {
            console.error("Login failed:", error);
            const errorMessage = 'Login failed. Please check your email and password.';
            // Add specific error handling based on your API response structure if needed
            setLoginError(errorMessage);
            setLoading(false);
        }
    };

    const handleClickForgotPassword = () => {
        alert("Forgot password functionality to be implemented.");
    };

    const textFieldStyles = {
        width: "100%",
        "& .MuiOutlinedInput-root": {
            color: "white",
            fontFamily: 'Poppins',
            borderRadius: '8px',
            "& fieldset": {
                borderColor: "#ddd",
                borderRadius: '8px',
            },
            "&:hover fieldset": {
                borderColor: "#bbb",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#aaa",
            },
        },
        "& .MuiInputLabel-root": {
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'Poppins',
            "&.Mui-focused": {
                color: "white",
            },
        },
        "& .MuiInputAdornment-root .MuiSvgIcon-root": {
             color: "rgba(255, 255, 255, 0.7)",
        },
    };

    return (
        <div className="font-poppins p-0 m-0 max-w-sm mx-auto">
            <h2 className="text-5xl text-center mb-4 text-white font-bold">
                Your Store
            </h2>
            {loginError && (
                <div className="text-red-500 text-center mb-2 text-sm">{loginError}</div>
            )}
            <form onSubmit={handleLoginSubmit}>
                <TextField
                    sx={{ ...textFieldStyles, mt: 2 }}
                    label="Email/Phone Number"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
                <div className="relative mt-4">
                    <TextField
                        sx={textFieldStyles}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Key />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <MuiIconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{
                            position: "absolute",
                            top: '50%',
                            right: 8,
                            transform: 'translateY(-50%)',
                            color: "rgba(255, 255, 255, 0.7)"
                        }}
                    >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </MuiIconButton>
                </div>

                <div className="flex justify-end text-white text-sm mb-4 mt-3">
                    <a href="#" className="hover:underline" onClick={handleClickForgotPassword}>
                        Forgot password?
                    </a>
                </div>

                <MuiButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                        p: 1.5,
                        fontFamily: 'Poppins',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        borderRadius: '12px',
                        bgcolor: 'black',
                        color: 'white',
                        mt: 1,
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: 'black',
                        },
                        '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255, 255, 255, 0.5)',
                        }
                    }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
                </MuiButton>
            </form>

            <div className="text-center text-gray-400 mt-4 mb-2 text-sm">Or login with</div>
            <div className="flex justify-center space-x-2">
                <MuiButton
                    variant="contained"
                    startIcon={<Facebook />}
                    disabled={isLoading}
                    sx={{
                        flex: 1,
                        fontFamily: 'Poppins',
                        bgcolor: '#3b5998',
                        color: 'white',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: '#3b5998',
                            opacity: 0.9
                        },
                        '&.Mui-disabled': {
                           bgcolor: 'rgba(59, 89, 152, 0.5)',
                           color: 'rgba(255, 255, 255, 0.7)',
                        }
                    }}
                >
                    Facebook
                </MuiButton>
                <MuiButton
                    variant="contained"
                    startIcon={<Google />}
                    disabled={isLoading}
                    sx={{
                        flex: 1,
                        fontFamily: 'Poppins',
                        bgcolor: 'white',
                        color: 'black',
                        borderRadius: '8px',
                        textTransform: 'none',
                         '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                        },
                         '&.Mui-disabled': {
                           bgcolor: 'rgba(255, 255, 255, 0.5)',
                           color: 'rgba(0, 0, 0, 0.5)',
                        }
                    }}
                >
                    Google
                </MuiButton>
            </div>
            <div className="flex items-center justify-center space-x-1 mt-4 text-sm">
                <div className="text-center text-gray-300">{"Don't have an account?"}</div>
                <Link href="/register" className="text-white hover:underline font-bold">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;