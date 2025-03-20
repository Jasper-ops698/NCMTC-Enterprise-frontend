import React, { useState, useEffect } from "react";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [editingService, setEditingService] = useState(null);

  // Fetch services from the backend
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services/");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        // Update service
        await axios.put(`/api/services/${editingService.id}/`, formData);
        setEditingService(null);
      } else {
        // Create new service
        await axios.post("/api/services/", formData);
      }
      setFormData({ title: "", description: "", price: "" });
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}/`);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="services-container">
      <h1>Services</h1>

      {/* Service Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Service Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Service Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editingService ? "Update Service" : "Add Service"}
        </button>
      </form>

      {/* Service List */}
      <div className="services-list">
        {services.map((service) => (
          <div key={service.id} className="service-item">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>Price: ${service.price}</p>
            <button onClick={() => handleEdit(service)}>Edit</button>
            <button onClick={() => handleDelete(service.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;