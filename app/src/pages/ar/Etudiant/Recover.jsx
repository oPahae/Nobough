import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Mail, Lock, Sparkles, Moon, ArrowRight, Info } from 'lucide-react'
import Link from "next/link";
import Head from "next/head";
import { verifyAuth } from "@/middlewares/Etudiant";
import { useRouter } from "next/router";

export default function Forgot({ session }) {
    const router = useRouter()
    useEffect(() => {
        if (session) router.push('/ar/Student')
    })

    const [step, setStep] = useState(0);
    const formRef = useRef(null);
    const verifyBtnRef = useRef(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [sendCodeLoading, setSendCodeLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [code, setCode] = useState(Array(6).fill(""));
    const [password, setPassword] = useState({ newPassword: "", confirmPassword: "" });

    const [timer, setTimer] = useState(300);

    useEffect(() => {
        let interval;
        if (step === 1 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleNext = () => {
        if (step === 0 && !email.includes("@")) {
            setError("الرجاء إدخال عنوان بريد إلكتروني صالح.");
            return;
        }

        setError(null);

        if (step === 0) {
            setSendCodeLoading(true);
            setTimeout(() => {
                setSendCodeLoading(false);
                setTimer(300);
            }, 1000);
        }

        if (formRef.current) {
            gsap.to(formRef.current, {
                x: "-100%",
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    setStep((prev) => prev + 1);
                    gsap.set(formRef.current, { x: "0%", opacity: 1 });
                },
            });
        }
    };

    const handleCodeInput = (value, index) => {
        const updatedCode = [...code];
        updatedCode[index] = value.slice(-1); // Take the last character entered
        setCode(updatedCode);

        // If a value is entered and it's not the last input, move focus to the next input
        if (value && index < 5) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
        // If no value is entered (i.e., backspace is pressed) and it's not the first input, move focus to the previous input
        else if (!value && index > 0) {
            document.getElementById(`code-input-${index - 1}`).focus();
        }
    };


    const progress = Math.round(((step + 1) / 3) * 100);

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, x: "100%" },
                { opacity: 1, x: "0%", duration: 0.5 }
            );
        }
    }, [step]);

    const formatTimer = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    const fetchCode = async () => {
        try {
            const response = await fetch('/api/_auth/userRecover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'getCode', email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'خطأ أثناء إرسال الرمز.');
            } else {
                setSuccess('تم إرسال الرمز بنجاح! يرجى التحقق من بريدك الإلكتروني.');
                setError('');
                handleNext();
            }
        } catch (error) {
            setError('حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقًا.');
        }
    };

    const handleVerifyCode = async () => {
        if (code.join("").length < 6) {
            setError("الرجاء إدخال رمز مكون من 6 أرقام.");
            return;
        }

        try {
            const response = await fetch('/api/_auth/userRecover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'verifyCode', email, code: code.join("") }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'رمز غير صالح.');
            } else {
                setSuccess("تم التحقق من الرمز! يرجى تعيين كلمة مرور جديدة.");
                setStep((prev) => prev + 1);
                setError('');
            }
        } catch (error) {
            setError('حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقًا.');
        }
    };

    const handleSavePassword = async () => {
        if (password.newPassword !== password.confirmPassword) {
            setError("كلمات المرور غير متطابقة.");
            return;
        }

        try {
            const response = await fetch('/api/_auth/userRecover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'resetPassword', email, password: password.newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'خطأ أثناء إعادة تعيين كلمة المرور.');
            } else {
                setSuccess("تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.");
                setError('');
            }
        } catch (error) {
            setError('حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقًا.');
        }
    };

    return (
        <>
            <Head>
                <title>مساحة الطالب - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="w-full h-screen bg-white/60 backdrop-blur-3xl" dir="rtl">
                <div className="max-w-full relative pb-12">
                    {/* Motif décoratif */}
                    <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 opacity-20">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="absolute top-1/2 -right-24 w-64 h-64 opacity-20">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="absolute -bottom-24 left-1/4 w-72 h-72 opacity-20">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Titre avec ornement */}
                    <div className="mb-12 text-center pt-8 relative">
                        <div className="inline-block">
                            <div className="flex items-center justify-center mb-2">
                                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                                <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">إعادة تعيين كلمة المرور</h1>
                            <div className="flex items-center justify-center mt-2">
                                <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                                <Moon className="text-amber-800 mx-4 w-4 h-4" />
                                <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4 max-w-xl mx-auto">أدخل عنوان بريدك الإلكتروني لاستلام رمز التحقق</p>
                    </div>

                    {/* Formulaire de réinitialisation */}
                    <div className="max-w-full mx-auto flex justify-center items-center">
                        <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-lg overflow-hidden">
                            {/* Smooth Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                                <div
                                    className="bg-[#875e15] h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            <div ref={formRef} className="relative">
                                {error && (
                                    <p className="text-red-500 text-center mb-4">
                                        {error}
                                    </p>
                                )}
                                {success && (
                                    <p className="text-green-500 text-center mb-4">
                                        {success}
                                    </p>
                                )}

                                {step === 0 && (
                                    <>
                                        <h1 className="text-xl font-bold text-center mb-6">
                                            أدخل بريدك الإلكتروني
                                        </h1>
                                        <div className="relative mb-6">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-amber-700" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder="بريدك.الإلكتروني@مثال.كوم"
                                            />
                                        </div>
                                        <button
                                            className="w-full mt-6 p-3 bg-[#593a00] text-white font-bold rounded-lg hover:bg-[#593a00] transition hover:rotate-2"
                                            onClick={fetchCode}
                                        >
                                            {!sendCodeLoading ? "إرسال الرمز" : <div className="flex justify-center"><div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div></div>}
                                        </button>
                                    </>
                                )}

                                {step === 1 && (
                                    <>
                                        <h1 className="text-xl font-bold text-center mb-6">
                                            أدخل رمز التحقق
                                        </h1>
                                        <p className="text-gray-500 text-center mb-4">
                                            ينتهي بعد : <span className="font-bold">{formatTimer(timer)}</span>
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            {code.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`code-input-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleCodeInput(e.target.value, index)}
                                                    className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition focus:rotate-3 focus:scale-105"
                                                    autoComplete="off"
                                                />
                                            ))}
                                        </div>
                                        <button
                                            ref={verifyBtnRef}
                                            className="w-full mt-6 p-3 bg-[#593a00] text-white font-bold rounded-lg hover:bg-[#593a00] transition hover:rotate-2"
                                            onClick={handleVerifyCode}
                                        >
                                            التحقق من الرمز
                                        </button>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <h1 className="text-xl font-bold text-center mb-6">
                                            تعيين كلمة مرور جديدة
                                        </h1>
                                        <div className="relative mb-6">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-amber-700" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="كلمة المرور الجديدة"
                                                value={password.newPassword}
                                                onChange={(e) =>
                                                    setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
                                                }
                                                className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>
                                        <div className="relative mb-6">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-amber-700" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="تأكيد كلمة المرور"
                                                value={password.confirmPassword}
                                                onChange={(e) =>
                                                    setPassword((prev) => ({
                                                        ...prev,
                                                        confirmPassword: e.target.value,
                                                    }))
                                                }
                                                className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>
                                        <button
                                            className="w-full p-3 bg-[#986301] text-white font-bold rounded-lg hover:bg-[#986301] transition hover:-rotate-2"
                                            onClick={handleSavePassword}
                                        >
                                            حفظ
                                        </button>
                                    </>
                                )}
                                <div className="text-center mt-4">
                                    <Link href="/ar/Student" className="text-amber-600 hover:underline">
                                        العودة
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ req, res }) {
    const etudiant = verifyAuth(req, res)

    if (etudiant) {
        return {
            props: {
                session: {
                    id: etudiant.id,
                    nom: etudiant.nom,
                    prenom: etudiant.prenom,
                    email: etudiant.email,
                    tel: etudiant.tel,
                    cin: etudiant.cin,
                    bio: etudiant.bio,
                    rabais: etudiant.rabais,
                    created_At: etudiant.created_At,
                }
            },
        }
    }

    return { props: { session: null } }
}