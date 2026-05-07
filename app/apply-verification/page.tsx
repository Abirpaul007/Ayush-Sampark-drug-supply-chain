"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/ui/card";
import { Input } from "@/app/ui/input";
import { Button } from "@/app/ui/button";
import { Label } from "@/app/ui/label";
import {
  UploadCloud,
  LogOut,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function ApplyVerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    designation: "",
    licenseNumber: "",
    licenseType: "",
    licenseIssuedBy: "",
    organization: "",
    idProofFile: null,
    licenseCertificateFile: null,
    addressProofFile: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    idProofFile: File | null;
    licenseCertificateFile: File | null;
    addressProofFile: File | null;
  }>({
    idProofFile: null,
    licenseCertificateFile: null,
    addressProofFile: null,
  });

  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return router.push("/sign-in");

    const checkStatus = async () => {
      try {
        const res = await fetch("/api/verification/status");
        const data = await res.json();
        if (data.applicationStatus === "APPROVED") {
          const role = session.user.role?.toLowerCase() || "";
          router.push(`/dashboard/${role}`);
        } else if (data.hasApplied) {
          router.push("/application-status");
        } else {
          setFormData((prev) => ({
            ...prev,
            name: session.user?.name || "",
            email: session.user?.email || "",
          }));
          setChecking(false);
        }
      } catch {
        setFormData((prev) => ({
          ...prev,
          name: session.user?.name || "",
          email: session.user?.email || "",
        }));
        setChecking(false);
      }
    };

    checkStatus();
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setUploadedFiles((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const removeFile = (name: string) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    setUploadedFiles((prev) => ({ ...prev, [name]: null }));
    const element = document.getElementById(name) as HTMLInputElement;
    if (element) element.value = "";
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });
      const res = await fetch("/api/verification/apply", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok) router.push("/application-status");
      else setStatusMsg(`❌ ${data.message || "Submission failed"}`);
    } catch {
      setStatusMsg("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonSubmit = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  const renderFileUpload = (name: string, label: string, required = true) => {
    const file = uploadedFiles[name as keyof typeof uploadedFiles];
    return (
      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <label className={`flex flex-col items-center justify-center w-full min-h-32 border-2 ${file ? 'border-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-dashed border-gray-300 dark:border-zinc-600'} rounded-xl bg-white/50 dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-all duration-200 group`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            {file ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center bg-white dark:bg-zinc-700 rounded-lg px-3 py-2 mb-2 w-full max-w-xs">
                  <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{file.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(name); }} className="ml-2 text-gray-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400">Click to change file</span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, PNG (MAX. 5MB)</p>
              </>
            )}
          </div>
          <Input type="file" id={name} name={name} onChange={handleFileChange} required={required && !file} className="hidden" />
        </label>
      </div>
    );
  };

  const renderStep = () => {
    const leftPanel = (
      <div className="bg-indigo-50 dark:bg-zinc-800 flex flex-col items-center justify-start p-6 relative space-y-4">
        <img src="/logo.png" alt="PharmaChain Logo" className="w-52 h-52 object-contain mt-4" />
        <img src="https://raw.githubusercontent.com/subhradeep09/Drugs-Supply-Chain/823dd0f268f3b6a3cdbe389d8a47602d9f6a5bb4/verificationpage.png" alt="Verification" className="w-11/10 max-h-96 object-contain -mt-6 scale-110" />
        <h2 className="text-xl text-center font-semibold text-indigo-700 dark:text-indigo-300 mt-4">Begin Your Verification</h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 max-w-xs">Fill out your personal details to get started.</p>
      </div>
    );

    const rightPanel = (content: React.ReactNode, title: string) => (
      <div className="p-6 sm:p-10 space-y-8 bg-gradient-to-br from-white via-indigo-50 to-purple-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>

        

        {content}
      </div>
    );

    const commonInputStyle = "rounded-xl border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 px-4 py-3 text-gray-800 dark:text-gray-200";

    const containerStyle = "flex flex-col md:flex-row min-h-[70vh] rounded-2xl overflow-hidden shadow-xl";


    if (step === 1) {
      return (
        <div className={containerStyle}>
          {leftPanel}
          {rightPanel(
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} required className={commonInputStyle} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" value={formData.email} readOnly className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-zinc-700 cursor-not-allowed text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className={commonInputStyle} />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input name="designation" value={formData.designation} onChange={handleChange} required className={commonInputStyle} />
                </div>
              </div>
            </div>,
            "Personal Information"
          )}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className={containerStyle}>
          {leftPanel}
          {rightPanel(
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input name="organization" value={formData.organization} onChange={handleChange} required className={commonInputStyle} />
                </div>
                <div className="space-y-2">
                  <Label>License Number</Label>
                  <Input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className={commonInputStyle} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>License Type</Label>
                  <Input name="licenseType" value={formData.licenseType} onChange={handleChange} required className={commonInputStyle} />
                </div>
                <div className="space-y-2">
                  <Label>Issued By</Label>
                  <Input name="licenseIssuedBy" value={formData.licenseIssuedBy} onChange={handleChange} required className={commonInputStyle} />
                </div>
              </div>
            </div>,
            "License Information"
          )}
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className={containerStyle}>
          {leftPanel}
          {rightPanel(
            <div className="space-y-6">
              {renderFileUpload("idProofFile", "ID Proof")}
              {renderFileUpload("licenseCertificateFile", "License Certificate")}
              {renderFileUpload("addressProofFile", "Address Proof (Optional)", false)}
            </div>,
            "Document Upload"
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-4">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img
          src="https://www.transparenttextures.com/patterns/cubes.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <Card className="relative w-full max-w-3xl shadow-lg z-10">
  {/* ✅ Progress bar moved here */}
  <div className="w-full bg-gray-200 h-2.5 dark:bg-zinc-700 rounded-t-xl overflow-hidden">
    <div
      className="bg-indigo-600 h-2.5 transition-all duration-300"
      style={{ width: `${(step / 3) * 100}%` }}
    ></div>
  </div>

  <CardContent>
    <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white mb-4" />
    {checking ? (

            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
          ) : (
            <>
              {renderStep()}
              <div className="flex flex-col md:flex-row justify-between items-center mt-6">
  <div className="w-full md:w-auto mt-4 md:mt-0">
    <Button
      variant="ghost"
      onClick={() => signOut()}
      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </Button>
  </div>
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleButtonSubmit} disabled={loading} className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" /> Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                )}
              </div>
              {statusMsg && (
                <p className={`mt-4 text-sm ${statusMsg.startsWith("❌") ? "text-red-500" : "text-green-500"}`}>
                  {statusMsg}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
