"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";

export default function CreateServiceRequest() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: "",
    machineType: "",
    serialNumber: "",
    machineLocation: [""],
    companyName: "",
    address: "",
    contactPerson: "",
    position: "",
    email: "",
    phone: "",
    serviceTypes: [] as string[],
    otherService: "",
    maintenanceHistory: "",
    maintenanceFile: null as File | null,
    issueDescription: "",
    documents: [] as string[],
    documentsFile: null as File | null,
    technicianQualifications: [] as string[],
    otherQualification: "",
    safetyRequirements: [] as string[],
    otherSafety: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: keyof typeof formData
  ) => {
    const { value, checked } = e.target;
    const list = [...(formData[name] as string[])];
    if (checked) {
      if (!list.includes(value)) list.push(value);
    } else {
      const index = list.indexOf(value);
      if (index > -1) list.splice(index, 1);
    }
    setFormData((prev) => ({ ...prev, [name]: list }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: keyof typeof formData
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleArrayChange = (index: number, value: string) => {
    const updated = [...formData.machineLocation];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, machineLocation: updated }));
  };

  const addArrayItem = () => {
    setFormData((prev) => ({
      ...prev,
      machineLocation: [...prev.machineLocation, ""],
    }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      // Map camelCase keys to snake_case keys expected by backend
      const keyMap: Record<string, string> = {
        jobTitle: "job_title",
        machineType: "machine_type",
        serialNumber: "serial_number",
        machineLocation: "machine_location",
        companyName: "company_name",
        address: "address",
        contactPerson: "contact_person",
        position: "position",
        email: "email",
        phone: "phone",
        serviceTypes: "service_types",
        otherService: "other_service",
        maintenanceHistory: "maintenance_history",
        issueDescription: "issue_description",
        technicianQualifications: "technician_qualifications",
        otherQualification: "other_qualification",
        safetyRequirements: "safety_requirements",
        otherSafety: "other_safety",
      };

      const payload: Record<string, any> = {};

      for (const key in formData) {
        const value = formData[key as keyof typeof formData];

        // Skip files (handle separately if needed)
        if (value instanceof File || value === null) continue;

        // machineLocation is an array of strings, send as is
        if (key === "machineLocation") {
          payload[keyMap[key]] = value;
          continue;
        }

        // Arrays (checkbox selections) sent as arrays
        if (Array.isArray(value) && key !== "machineLocation") {
          payload[keyMap[key]] = value;
          continue;
        }

        // Otherwise, assign directly
        payload[keyMap[key]] = value;
      }

      const res = await fetch("http://localhost:8000/api/service-request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/serviceList");
      } else {
        const errorText = await res.text();
        console.error("Submission error:", res.status, errorText);
        alert(`Submission failed: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Network or other error:", error);
      alert(`Submission failed: ${error}`);
    }
  };

  const Input = ({
    label,
    name,
    type = "text",
    ...props
  }: {
    label?: string;
    name: keyof typeof formData;
    type?: string;
    placeholder?: string;
    required?: boolean;
    // onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
  }) => (
    <div className="mb-4">
      {label && (
        <label className="block font-medium mb-1 text-sm text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={
          // For file inputs, do not pass value prop
          type === "file" ? undefined : formData[name] ?? ""
        }
        onChange={
          props.onChange
            ? props.onChange
            : (e) => handleChange(e as ChangeEvent<HTMLInputElement>)
        }
        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        {...props}
      />
    </div>
  );

  const ButtonGroup = ({
    onBack,
    onNext,
    isFinal = false,
  }: {
    onBack?: () => void;
    onNext: () => void;
    isFinal?: boolean;
  }) => (
    <div className="flex gap-4 mt-6">
      {step > 1 && (
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
          type="button"
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        className="flex-1 bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
        type="button"
      >
        {isFinal ? "Submit" : "Save & Continue"}
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Create New Service Request
      </h1>
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${
              s <= step ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {step === 1 && (
          <div>
            <Input label="Job Title" name="jobTitle" required />
            <Input label="Machine/System Type" name="machineType" />
            <Input label="Serial Number" name="serialNumber" />
            {formData.machineLocation.map((loc, i) => (
              <Input
                // key={i}
                label={`Machine Location ${i + 1}`}
                name={`machineLocation-${i}` as any} // dummy name for uniqueness, won't be used in formData
                value={loc}
                onChange={(e) => handleArrayChange(i, e.target.value)}
              />
            ))}
            <button
              onClick={addArrayItem}
              className="text-sm text-blue-600 mb-4"
              type="button"
            >
              + Add more
            </button>

            {/* Display machine locations list */}
            {/* <div className="mt-4">
              <strong>Machine Locations:</strong>
              <ul className="list-disc list-inside">
                {formData.machineLocation.map((loc, i) => (
                  <li key={i}>{loc || "(empty)"}</li>
                ))}
              </ul>
            </div> */}

            <ButtonGroup onNext={handleNext} />
          </div>
        )}

        {step === 2 && (
          <div>
            <Input label="Company Name" name="companyName" />
            <Input label="Address" name="address" />
            <Input label="Contact Person" name="contactPerson" />
            <Input label="Position" name="position" />
            <Input label="Email" name="email" type="email" />
            <Input label="Phone" name="phone" type="tel" />
            <ButtonGroup onBack={handlePrev} onNext={handleNext} />
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block font-medium mb-2 text-sm text-gray-700">
              Service Types
            </label>
            {["Inspection", "Repair", "Maintenance"].map((type) => (
              <div key={type} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    checked={formData.serviceTypes.includes(type)}
                    onChange={(e) => handleCheckboxChange(e, "serviceTypes")}
                    className="mr-2"
                  />{" "}
                  {type}
                </label>
              </div>
            ))}
            <Input name="otherService" placeholder="Other" />

            {/* Display selected service types */}
            <div className="mt-4">
              <strong>Selected Services:</strong>
              <ul className="list-disc list-inside">
                {formData.serviceTypes.map((service) => (
                  <li key={service}>{service}</li>
                ))}
                {formData.otherService && <li>{formData.otherService}</li>}
              </ul>
            </div>

            <ButtonGroup onBack={handlePrev} onNext={handleNext} />
          </div>
        )}

        {step === 4 && (
          <div>
            <Input label="Maintenance History" name="maintenanceHistory" />
            <Input
              label="Upload Maintenance File"
              name="maintenanceFile"
              type="file"
              onChange={(e) => handleFileChange(e, "maintenanceFile")}
            />
            <Input label="Issue Description" name="issueDescription" />
            <ButtonGroup onBack={handlePrev} onNext={handleNext} />
          </div>
        )}

        {step === 5 && (
          <div>
            <Input
              label="Upload Related Documents"
              name="documentsFile"
              type="file"
              onChange={(e) => handleFileChange(e, "documentsFile")}
            />
            <ButtonGroup onBack={handlePrev} onNext={handleNext} />
          </div>
        )}

        {step === 6 && (
          <div>
            <label className="block font-medium mb-2 text-sm text-gray-700">
              Technician Qualifications
            </label>
            {["Certified Technician", "Manufacturer Trained", "Other"].map(
              (qual) => (
                <div key={qual} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={qual}
                      checked={formData.technicianQualifications.includes(qual)}
                      onChange={(e) =>
                        handleCheckboxChange(e, "technicianQualifications")
                      }
                      className="mr-2"
                    />{" "}
                    {qual}
                  </label>
                </div>
              )
            )}
            <Input name="otherQualification" placeholder="Other" />

            {/* Display selected qualifications */}
            <div className="mt-4">
              <strong>Selected Qualifications:</strong>
              <ul className="list-disc list-inside">
                {formData.technicianQualifications.map((q) => (
                  <li key={q}>{q}</li>
                ))}
                {formData.otherQualification && (
                  <li>{formData.otherQualification}</li>
                )}
              </ul>
            </div>

            <ButtonGroup onBack={handlePrev} onNext={handleNext} />
          </div>
        )}

        {step === 7 && (
          <div>
            <label className="block font-medium mb-2 text-sm text-gray-700">
              Safety requirements
            </label>
            {[
              "SCC Safety Certificate",
              "Occupational Safety Training",
              "First Aid Course",
            ].map((s) => (
              <div key={s} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={s}
                    checked={formData.safetyRequirements.includes(s)}
                    onChange={(e) =>
                      handleCheckboxChange(e, "safetyRequirements")
                    }
                    className="mr-2"
                  />{" "}
                  {s}
                </label>
              </div>
            ))}
            <Input name="otherSafety" placeholder="Other" />

            {/* Display selected safety requirements */}
            <div className="mt-4">
              <strong>Selected Safety Requirements:</strong>
              <ul className="list-disc list-inside">
                {formData.safetyRequirements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
                {formData.otherSafety && <li>{formData.otherSafety}</li>}
              </ul>
            </div>

            <ButtonGroup onBack={handlePrev} onNext={handleSubmit} isFinal />
          </div>
        )}
      </div>
    </div>
  );
}
