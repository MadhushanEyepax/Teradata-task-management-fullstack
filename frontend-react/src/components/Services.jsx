import { useState, useEffect, useMemo } from "react";
import "./Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect with cleanup
  useEffect(() => {
    console.log("Component mounted - fetching services");

    const timer = setTimeout(() => {
      setServices([
        { id: 1, name: "Task Management", price: 100 },
        { id: 2, name: "Project Planning", price: 200 },
        { id: 3, name: "Team Collaboration", price: 150 },
      ]);
    }, 1000);

    return () => {
      console.log("Cleanup - clearing timer");
      clearTimeout(timer);
    };
  }, []);

  // useMemo - performance hook 
  const filteredServices = useMemo(() => {
    console.log("Filtering services...");
    return services.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  return (
    <div className="services-container">
      <h2 className="services-title">Services</h2>

      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="services-search"
      />

      <ul className="services-list">
        {filteredServices.map((service) => (
          <li key={service.id} className="service-item">
            <span className="service-name">{service.name}</span>
            <span className="service-price">${service.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Services;
