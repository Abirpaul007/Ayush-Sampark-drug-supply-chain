"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import { Check, X, ChevronRight, FileText, FileBadge, Home, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {  FiCheckCircle} from 'react-icons/fi';


interface Verification {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  licenseNumber: string;
  licenseType: string;
  licenseIssuedBy: string;
  organization: string;
  idProofUrl?: string;
  licenseCertificateUrl?: string;
  addressProofUrl?: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

interface UserRequest {
  _id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  isEmailVerified: boolean;
  isVerified: boolean;
  verification?: Verification;
}

export default function UserVerificationRequests() {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [verifiedDocs, setVerifiedDocs] = useState<{ [key: string]: { idProof?: boolean; license?: boolean; address?: boolean } }>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/verification/all");
        const data = await res.json();
        const filtered = data.filter((u: UserRequest) => u.verification?.applicationStatus === "PENDING");
        setRequests(filtered);

        const storedState = localStorage.getItem("verifiedDocs");
        const parsedStored = storedState ? JSON.parse(storedState) : {};

        const initial: any = {};
        filtered.forEach((u: UserRequest) => {
          if (u.verification) {
            initial[u.verification._id] = {
              idProof: parsedStored[u.verification._id]?.idProof || false,
              license: parsedStored[u.verification._id]?.license || false,
              address: parsedStored[u.verification._id]?.address || false,
            };
          }
        });
        setVerifiedDocs(initial);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch("/api/verification/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId: id, status }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((u) => u.verification?._id !== id));
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleExportCSV = () => {
  if (!requests || requests.length === 0) return;

  const headers = [
    "Full Name",
    "Email",
    "Phone Number",
    "Organization",
    "Designation",
    "License Number",
    "License Type",
    "Issued By",
    "Application Status",
    "Submitted At",
  ];

  const rows = requests.map((u) => {
    const v = u.verification;
    return [
      v?.fullName || "",
      u.email || "",
      v?.phoneNumber || "",
      u.organization || "",
      v?.designation || "",
      v?.licenseNumber || "",
      v?.licenseType || "",
      v?.licenseIssuedBy || "",
      v?.applicationStatus || "",
      new Date(v?.submittedAt || "").toLocaleString(),
    ];
  });

  const csvContent =
    [headers, ...rows]
      .map((e) =>
        e
          .map((field) =>
            `"${String(field).replace(/"/g, '""')}"`
          ) // escape quotes
          .join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "verification_requests.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const handleCheckboxChange = (vid: string, field: "idProof" | "license" | "address", checked: boolean) => {
    setVerifiedDocs((prev) => {
      const updated = {
        ...prev,
        [vid]: {
          ...prev[vid],
          [field]: prev[vid][field] || checked,
        },
      };
      localStorage.setItem("verifiedDocs", JSON.stringify(updated));
      return updated;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
        <FiCheckCircle className="mr-3 text-white-200" />
        Verification Requests
      </h1>
      <p className="text-indigo-100 mt-1">
        {requests.length} pending {requests.length === 1 ? "request" : "requests"}
      </p>
    </div>
    
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={handleExportCSV}
        className="flex items-center gap-2 bg-white bg-opacity-100 hover:bg-opacity-100 text-white-700 hover:text-indigo-800 border-indigo-300 hover:border-indigo-400"
      >
        <span>Export</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
</div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
            <p className="text-gray-500">There are no pending verification requests at this time.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                      className="transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.organization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.verification && getStatusIcon(user.verification.applicationStatus)}
                          <span className="ml-2 text-sm text-gray-500 capitalize">
                            {user.verification?.applicationStatus.toLowerCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.verification && (
                          <Button
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 flex items-center gap-1"
                            onClick={() => setActiveModal(user.verification!._id)}
                          >
                            <FileText className="w-4 h-4" />
                            <span>View</span>
                          </Button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.verification?.applicationStatus === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="default"
                              className="px-4 py-2 text-sm flex items-center gap-1"
                              onClick={() => updateStatus(user.verification!._id, "APPROVED")}
                              disabled={
                                !verifiedDocs[user.verification._id]?.idProof ||
                                !verifiedDocs[user.verification._id]?.license ||
                                !verifiedDocs[user.verification._id]?.address
                              }
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              className="px-4 py-2 text-sm flex items-center gap-1"
                              onClick={() => updateStatus(user.verification!._id, "REJECTED")}
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveModal(null)}
          >
            {requests.map((user) => {
              const v = user.verification;
              return (
                v &&
                activeModal === v._id && (
                  <motion.div
                    key={v._id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setActiveModal(null)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                            <User className="text-blue-500" />
                            {user.name}
                          </h2>
                          <p className="text-gray-500 mt-1">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              v.applicationStatus === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : v.applicationStatus === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {v.applicationStatus}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-500" />
                            Personal Information
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <DetailItem label="Full Name" value={v.fullName} />
                            <DetailItem label="Phone" value={v.phoneNumber} />
                            <DetailItem label="Designation" value={v.designation} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <FileBadge className="w-5 h-5 text-gray-500" />
                            License Information
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <DetailItem label="License Number" value={v.licenseNumber} />
                            <DetailItem label="License Type" value={v.licenseType} />
                            <DetailItem label="Issued By" value={v.licenseIssuedBy} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-gray-500" />
                            Organization
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <DetailItem label="Organization" value={v.organization} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            Submission Details
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <DetailItem
                              label="Submitted At"
                              value={new Date(v.submittedAt).toLocaleString()}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {v.idProofUrl && (
                          <DocumentSection
                            title="ID Proof"
                            url={v.idProofUrl}
                            verified={verifiedDocs[v._id]?.idProof || false}
                            onChange={(checked) => handleCheckboxChange(v._id, "idProof", checked)}
                          />
                        )}
                        {v.licenseCertificateUrl && (
                          <DocumentSection
                            title="License Certificate"
                            url={v.licenseCertificateUrl}
                            verified={verifiedDocs[v._id]?.license || false}
                            onChange={(checked) => handleCheckboxChange(v._id, "license", checked)}
                          />
                        )}
                        {v.addressProofUrl && (
                          <DocumentSection
                            title="Address Proof"
                            url={v.addressProofUrl}
                            verified={verifiedDocs[v._id]?.address || false}
                            onChange={(checked) => handleCheckboxChange(v._id, "address", checked)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => setActiveModal(null)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => updateStatus(v._id, "APPROVED")}
                        disabled={
                          !verifiedDocs[v._id]?.idProof ||
                          !verifiedDocs[v._id]?.license ||
                          !verifiedDocs[v._id]?.address
                        }
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Approve Request
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateStatus(v._id, "REJECTED")}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject Request
                      </Button>
                    </div>
                  </motion.div>
                )
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900">{value || "-"}</p>
    </div>
  );
}

function DocumentSection({
  title,
  url,
  verified,
  onChange,
}: {
  title: string;
  url: string;
  verified: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            checked={verified}
            disabled={verified}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className={`text-sm ${verified ? "text-green-600" : "text-gray-600"}`}>
            {verified ? "Verified" : "Mark as verified"}
          </span>
        </label>
      </div>
      <div className="p-4">
        <iframe
          src={url}
          className="w-full h-96 border border-gray-200 rounded-md"
          title={`Document: ${title}`}
        />
        <div className="mt-3 flex justify-end">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
}