import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import logo from "./assets/logo.png"

const InvoiceGenerator = () => {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [serviceType, setServiceType] = useState("commercial");
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const pdfRef = useRef(); // Reference for the PDF content

  // Define rates based on service type
  const rates = {
    commercial: {
      termite: 8,
      rodent: 2,
      cockroach: 3,
    },
    residential: {
      termite: 6,
      rodent: 1,
      cockroach: 2,
    },
  };

  const handleServiceChange = (e, pestService) => {
    const isChecked = e.target.checked;
    const updatedServices = isChecked
      ? [...selectedServices, { name: pestService, sqft: 0 }]
      : selectedServices.filter((service) => service.name !== pestService);

    setSelectedServices(updatedServices);
  };

  const handleSqftChange = (index, value) => {
    const updatedServices = [...selectedServices];
    updatedServices[index].sqft = value;

    // Calculate total amount
    setTotalAmount(
      updatedServices.reduce((sum, service) => {
        const serviceRate = rates[serviceType][service.name];
        return sum + (serviceRate * (service.sqft || 0));
      }, 0)
    );

    setSelectedServices(updatedServices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pdfElement = pdfRef.current;

    // Use html2pdf to generate the PDF
    html2pdf()
      .from(pdfElement)
      .save("quotation.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Quotation Form</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium">Client Name:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Client Address:</label>
          <input
            type="text"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Service Type:</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          >
            <option value="commercial">Commercial</option>
            <option value="residential">Residential</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Pest Services:</label>
          {Object.keys(rates[serviceType]).map((service) => (
            <div key={service} className="flex items-center mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => handleServiceChange(e, service)}
                  className="mr-2"
                />
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </label>
              {selectedServices.find((s) => s.name === service) && (
                <input
                  type="number"
                  placeholder="SQFT"
                  onChange={(e) =>
                    handleSqftChange(
                      selectedServices.findIndex((s) => s.name === service),
                      e.target.value
                    )
                  }
                  required
                  className="ml-4 p-2 border border-gray-300 rounded w-1/3"
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Generate Quotation</button>
      </form>

      {/* Hidden PDF content section */}
      <div style={{ display: "none" }}>
        <div ref={pdfRef} className="p-6 bg-white shadow-md" style={{ fontFamily: "Arial, sans-serif" }}>
          <h1 className="text-2xl font-bold text-center mb-4">Quotation</h1>
          <div className="flex justify-between mb-4">
  <div>
  <img src={logo} alt="Nachammai Pest Control Logo" className="h-32" />
  </div>
  <div className="text-right">
    Quotation Date: {new Date().toLocaleDateString()}
  </div>
</div>

<div className="border border-gray-300 p-4 mb-4">
<div className="grid grid-cols-2 gap-4 mb-4">
  <div className="border border-gray-300 p-4">
    <strong>Quotation By:</strong><br />
    Nachammai Pest Control<br />
    Kattupakkam, Chennai - 600056<br />
  </div>

  <div className="border border-gray-300 p-4">
    <strong>Quotation To:</strong><br />
    Client Name: {clientName}<br />
    Client Address: {clientAddress}<br />
  </div>
</div>

          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-200">Service</th>
                <th className="border border-gray-300 p-2 bg-gray-200">SQFT</th>
                <th className="border border-gray-300 p-2 bg-gray-200">Rate</th>
                <th className="border border-gray-300 p-2 bg-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedServices.map((service) => (
                <tr key={service.name}>
                  <td className="border border-gray-300 p-2">{service.name}</td>
                  <td className="border border-gray-300 p-2">{service.sqft}</td>
                  <td className="border border-gray-300 p-2">{rates[serviceType][service.name]}</td>
                  <td className="border border-gray-300 p-2">{rates[serviceType][service.name] * service.sqft}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="font-bold">Total Amount: {totalAmount}</div>
          <div>
            For any inquiries, email us at <a href="mailto:nachammaipestservice@gmail.com" className="text-blue-600">nachammaipestservice@gmail.com</a> or call us at +91 97911-71377
          </div>
        </div>
      </div>
    </div>
    </div>
    )
};

export default InvoiceGenerator;
