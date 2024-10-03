// PropertyList.js

import React from 'react';

// PropertyItem component to render individual property details
const PropertyItem = ({ property }) => {
  return (
    <div className="property-item border p-4 m-2 rounded shadow">
      <h3 className="font-bold text-lg">{property.title}</h3>
      <p>{property.description}</p>
      <p className="text-xl font-semibold">${property.price.toLocaleString()}</p>
      <p>{property.propertyType}</p>
      <p>
        {property.bedrooms} Bedrooms, {property.bathrooms} Bathrooms
      </p>
      <img src={property.images[0]} alt={property.title} className="w-full h-auto rounded" />
    </div>
  );
};

// Main PropertyList component
const PropertyList = ({ properties }) => {
  return (
    <div className="property-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {properties.map((property) => (
        <PropertyItem key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;
