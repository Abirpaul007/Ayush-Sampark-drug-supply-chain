'use client';

import { useState } from 'react';

// Reusable Input component
function Input({ name, value, placeholder, onChange }: any) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
    />
  );
}

// Reusable Textarea component
function Textarea({ name, value, placeholder, onChange }: any) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-xl p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
    />
  );
}

// Reusable Section Heading
function Section({ title }: { title: string }) {
  return (
    <div className="col-span-2">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">{title}</h2>
    </div>
  );
}

export default function AddMedicinePage() {
  const [form, setForm] = useState({
    brandName: '',
    genericName: '',
    category: '',
    dosageForm: '',
    strength: '',
    packSize: '',
    licenseNumber: '',
    approvalNumber: '',
    mrp: '',
    gst: '',
    minOrderQuantity: '',
    shortDescription: '',
    detailedDescription: '',
    productImage: '',
    packagingImage: '',
    labReports: '',
    storageConditions: '',
    shippingWeight: '',
    dimensions: '',
    brochure: '',
    msds: '',
    certifications: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vendor-medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('✅ Medicine added successfully!');
        setForm({
          brandName: '',
          genericName: '',
          category: '',
          dosageForm: '',
          strength: '',
          packSize: '',
          licenseNumber: '',
          approvalNumber: '',
          mrp: '',
          gst: '',
          minOrderQuantity: '',
          shortDescription: '',
          detailedDescription: '',
          productImage: '',
          packagingImage: '',
          labReports: '',
          storageConditions: '',
          shippingWeight: '',
          dimensions: '',
          brochure: '',
          msds: '',
          certifications: '',
        });
      } else {
        const data = await res.json();
        alert(`❌ Failed to add: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">Add New Medicine</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section title=" Basic Medicine Information" />
        <Input name="brandName" value={form.brandName} onChange={handleChange} placeholder="Brand Name" />
        <Input name="genericName" value={form.genericName} onChange={handleChange} placeholder="Generic Name" />
        <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />

        <Section title=" Product Specifications" />
        <Input name="dosageForm" value={form.dosageForm} onChange={handleChange} placeholder="Dosage Form" />
        <Input name="strength" value={form.strength} onChange={handleChange} placeholder="Strength" />
        <Input name="packSize" value={form.packSize} onChange={handleChange} placeholder="Pack Size" />

        <Section title=" Regulatory & Compliance" />
        <Input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="License Number" />
        <Input name="approvalNumber" value={form.approvalNumber} onChange={handleChange} placeholder="Approval Number" />

        <Section title=" Pricing" />
        <Input name="mrp" value={form.mrp} onChange={handleChange} placeholder="MRP" />
        <Input name="gst" value={form.gst} onChange={handleChange} placeholder="GST (%)" />
        <Input name="minOrderQuantity" value={form.minOrderQuantity} onChange={handleChange} placeholder="Minimum Order Quantity" />

        <Section title=" Descriptions" />
        <Textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Short Description" />
        <Textarea name="detailedDescription" value={form.detailedDescription} onChange={handleChange} placeholder="Detailed Description" />

        <Section title=" Media & Documents" />
        <Input name="productImage" value={form.productImage} onChange={handleChange} placeholder="Product Image URL" />
        <Input name="packagingImage" value={form.packagingImage} onChange={handleChange} placeholder="Packaging Image URL" />
        <Input name="labReports" value={form.labReports} onChange={handleChange} placeholder="Lab Reports URL" />

        <Section title=" Logistics & Packaging" />
        <Input name="storageConditions" value={form.storageConditions} onChange={handleChange} placeholder="Storage Conditions" />
        <Input name="shippingWeight" value={form.shippingWeight} onChange={handleChange} placeholder="Shipping Weight" />
        <Input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="Dimensions" />

        <Section title="Attachments" />
        <Input name="brochure" value={form.brochure} onChange={handleChange} placeholder="Brochure URL" />
        <Input name="msds" value={form.msds} onChange={handleChange} placeholder="MSDS Document URL" />
        <Input name="certifications" value={form.certifications} onChange={handleChange} placeholder="Certifications" />

        <div className="col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-4 rounded-xl shadow-lg"
          >
            {loading ? '⏳ Adding Medicine...' : 'Add Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
}
