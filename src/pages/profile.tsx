import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateProfile() {
  const router = useRouter();
  const [step, set_step] = useState(1);
  const [form_data, set_form_data] = useState({
    company_name: "",
    industry: "",
    locations: [""],
    contact_name: "",
    contact_position: "",
    email: "",
    phone: "",
    machine_types: [""],
    equipment_notes: "",
    required_services: [] as string[],
    provider_qualifications: [] as string[],
    safety_requirements: [] as string[],
    other_service: "",
    other_qualification: "",
    other_safety: "",
    company_size: "",
    additional_info: "",
  });

  const next_step = () => set_step((prev) => prev + 1);
  const prev_step = () => set_step((prev) => prev - 1);

  const handle_change = (field: string, value: string) => {
    set_form_data({ ...form_data, [field]: value });
  };

  const handle_array_change = (
    array_name: keyof typeof form_data,
    index: number,
    value: string
  ) => {
    const updated = [...(form_data[array_name] as string[])];
    updated[index] = value;
    set_form_data({ ...form_data, [array_name]: updated });
  };

  const add_array_item = (array_name: keyof typeof form_data) => {
    const updated = [...(form_data[array_name] as string[]), ""];
    set_form_data({ ...form_data, [array_name]: updated });
  };

  const handle_checkbox_change = (
    field: keyof typeof form_data,
    value: string,
    is_checked: boolean
  ) => {
    const current_array = [...(form_data[field] as string[])];
    const updated_array = is_checked
      ? [...current_array, value]
      : current_array.filter((item) => item !== value);

    set_form_data({ ...form_data, [field]: updated_array });
  };

  const handle_submit = async () => {
    console.log("Submitting form:", form_data);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form_data),
      });

      if (res.ok) {
        //next_step(); // Move to confirmation step
        router.push("/profileList");
      } else {
        const error_data = await res.json();
        console.error("Backend Error:", error_data);
        alert("Error submitting profile: " + JSON.stringify(error_data));
      }
    } catch (error) {
      console.error("Network or code error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </div>
        <h1 className="text-xl font-bold mb-2">Create Profile</h1>

        {/* Progress bar */}
        <div className="flex space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded ${
                s <= step ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Step 1: Company Info */}
          {step === 1 && (
            <>
              <h2 className="font-semibold mb-4">1. Company Information</h2>

              <input
                type="text"
                placeholder="Company Name"
                value={form_data.company_name}
                onChange={(e) => handle_change("company_name", e.target.value)}
                className="w-full p-2 mb-2 border rounded bg-gray-100"
                required
              />

              <select
                value={form_data.industry}
                onChange={(e) => handle_change("industry", e.target.value)}
                className="w-full p-2 mb-2 border rounded bg-gray-100"
                required
              >
                <option value="">Select Industry</option>
                <option>Mechanical Engineering</option>
                <option>Automation</option>
                <option>Medical Technology</option>
                <option>Energy</option>
              </select>

              {form_data.locations.map((loc, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Location ${index + 1}`}
                  value={loc}
                  onChange={(e) =>
                    handle_array_change("locations", index, e.target.value)
                  }
                  className="w-full p-2 mb-2 border rounded bg-gray-100"
                />
              ))}
              <button
                type="button"
                onClick={() => add_array_item("locations")}
                className="text-sm text-white bg-teal-600 px-3 py-1 rounded mb-3 hover:bg-teal-700"
              >
                + Add more
              </button>

              <input
                type="text"
                placeholder="Contact Name"
                value={form_data.contact_name}
                onChange={(e) => handle_change("contact_name", e.target.value)}
                className="w-full p-2 mb-2 border rounded bg-gray-100"
              />

              <input
                type="text"
                placeholder="Contact Position"
                value={form_data.contact_position}
                onChange={(e) =>
                  handle_change("contact_position", e.target.value)
                }
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              />

              <button
                type="button"
                onClick={next_step}
                className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900"
              >
                Save & Continue
              </button>
            </>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <>
              <h2 className="font-semibold mb-4">2. Contact Information</h2>

              <input
                type="email"
                placeholder="Email"
                value={form_data.email}
                onChange={(e) => handle_change("email", e.target.value)}
                className="w-full p-2 mb-2 border rounded bg-gray-100"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={form_data.phone}
                onChange={(e) => handle_change("phone", e.target.value)}
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prev_step}
                  className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={next_step}
                  className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900"
                >
                  Save & Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Machinery Info */}
          {step === 3 && (
            <>
              <h2 className="font-semibold mb-4">3. Machinery Information</h2>

              {form_data.machine_types.map((type, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Machine Type ${index + 1}`}
                  value={type}
                  onChange={(e) =>
                    handle_array_change("machine_types", index, e.target.value)
                  }
                  className="w-full p-2 mb-2 border rounded bg-gray-100"
                />
              ))}
              <button
                type="button"
                onClick={() => add_array_item("machine_types")}
                className="text-sm text-white bg-teal-600 px-3 py-1 rounded mb-3 hover:bg-teal-700"
              >
                + Add more
              </button>

              <textarea
                placeholder="Equipment Notes"
                value={form_data.equipment_notes}
                onChange={(e) =>
                  handle_change("equipment_notes", e.target.value)
                }
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prev_step}
                  className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={next_step}
                  className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900"
                >
                  Save & Continue
                </button>
              </div>
            </>
          )}

          {/* Step 4: Services and Qualifications */}
          {step === 4 && (
            <>
              <h2 className="font-semibold mb-4">4. Service Requirements</h2>

              <label className="block mb-1 font-medium">
                Required Services
              </label>
              {["Maintenance", "Repair", "Inspection"].map((service) => (
                <label key={service} className="block mb-1">
                  <input
                    type="checkbox"
                    checked={form_data.required_services.includes(service)}
                    onChange={(e) =>
                      handle_checkbox_change(
                        "required_services",
                        service,
                        e.target.checked
                      )
                    }
                  />
                  <span className="ml-2">{service}</span>
                </label>
              ))}
              <input
                type="text"
                placeholder="Other Service"
                value={form_data.other_service}
                onChange={(e) => handle_change("other_service", e.target.value)}
                className="w-full p-2 my-2 border rounded bg-gray-100"
              />

              <label className="block mb-1 font-medium">
                Provider Qualifications
              </label>
              {["ISO 9001", "Certified Technician", "On-site Capability"].map(
                (qual) => (
                  <label key={qual} className="block mb-1">
                    <input
                      type="checkbox"
                      checked={form_data.provider_qualifications.includes(qual)}
                      onChange={(e) =>
                        handle_checkbox_change(
                          "provider_qualifications",
                          qual,
                          e.target.checked
                        )
                      }
                    />
                    <span className="ml-2">{qual}</span>
                  </label>
                )
              )}
              <input
                type="text"
                placeholder="Other Qualification"
                value={form_data.other_qualification}
                onChange={(e) =>
                  handle_change("other_qualification", e.target.value)
                }
                className="w-full p-2 my-2 border rounded bg-gray-100"
              />

              <label className="block mb-1 font-medium">
                Safety Requirements
              </label>
              {["PPE", "Training Certificates", "Site Induction"].map(
                (safety) => (
                  <label key={safety} className="block mb-1">
                    <input
                      type="checkbox"
                      checked={form_data.safety_requirements.includes(safety)}
                      onChange={(e) =>
                        handle_checkbox_change(
                          "safety_requirements",
                          safety,
                          e.target.checked
                        )
                      }
                    />
                    <span className="ml-2">{safety}</span>
                  </label>
                )
              )}
              <input
                type="text"
                placeholder="Other Safety Requirement"
                value={form_data.other_safety}
                onChange={(e) => handle_change("other_safety", e.target.value)}
                className="w-full p-2 my-2 border rounded bg-gray-100"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prev_step}
                  className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={next_step}
                  className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900"
                >
                  Save & Continue
                </button>
              </div>
            </>
          )}

          {/* Step 5: Final Details */}
          {step === 5 && (
            <>
              <h2 className="font-semibold mb-4">5. Final Details</h2>

              <select
                value={form_data.company_size}
                onChange={(e) => handle_change("company_size", e.target.value)}
                className="w-full p-2 mb-2 border rounded bg-gray-100"
              >
                <option value="">Select Company Size</option>
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>201-500</option>
                <option>500+</option>
              </select>

              <textarea
                placeholder="Additional Information"
                value={form_data.additional_info}
                onChange={(e) =>
                  handle_change("additional_info", e.target.value)
                }
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prev_step}
                  className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handle_submit}
                  className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
                >
                  Submit Profile
                </button>
              </div>
            </>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">
                Profile Created!
              </h2>
              <p className="text-gray-700">
                Thank you for submitting your profile.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
