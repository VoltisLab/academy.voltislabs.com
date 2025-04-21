import Image from "next/image";

const companies = [
  { name: "ClickUp", src: "/companies/clickup.png" },
  { name: "Dropbox", src: "/companies/dropbox.png" },
  { name: "Elastic", src: "/companies/elastic.png" },
  { name: "GitHub", src: "/companies/github.png" },
  { name: "FreshBooks", src: "/companies/freshbooks.png" },
  { name: "HelpScout", src: "/companies/helpscout.png" },
  { name: "HubSpot", src: "/companies/hubspot.png" },
  { name: "Intuit", src: "/companies/intuit.png" },
  { name: "Google", src: "/companies/google.png" },
  { name: "Paychex", src: "/companies/paychex.png" },
//   { name: "Salesforce", src: "/companies/salesforce.png" },
//   { name: "SAP", src: "/companies/sap.png" },
//   { name: "Segment", src: "/companies/segment.png" },
//   { name: "ServiceNow", src: "/companies/servicenow.png" },
//   { name: "Shopify", src: "/companies/shopify.png" },
];

export default function GraduateCompanies() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-10">
          Our graduates have worked in
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-center">
          {companies.map((company, idx) => (
            <div key={idx} className="bg-white p-4 rounded-md  w-full h-20 flex items-center justify-center">
              <Image
                src={company.src}
                alt={company.name}
                width={140}
                height={60}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
