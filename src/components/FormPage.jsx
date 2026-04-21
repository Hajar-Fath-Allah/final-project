import React, { useState } from 'react';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3, "Name must be 3+ chars"),
  email: z.string().email("Invalid email"),
  bookingDate: z.string().min(1, "Date is required"),
});

export default function FormPage() {
  const [formData, setFormData] = useState({ username: '', email: '', bookingDate: '' });
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = userSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    
    // Step 5: Send data to httpbin
    const res = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResponse(data); // Step 6: Show response
  };

  return (
    <div className="main-content">
      <h2>Register (Task J1)</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={e => setFormData({...formData, username: e.target.value})} />
        {errors.username && <p style={{color: 'red'}}>{errors.username[0]}</p>}
        
        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
        {errors.email && <p style={{color: 'red'}}>{errors.email[0]}</p>}
        
        <input type="date" onChange={e => setFormData({...formData, bookingDate: e.target.value})} />
        {errors.bookingDate && <p style={{color: 'red'}}>{errors.bookingDate[0]}</p>}
        
        <button type="submit">Submit</button>
      </form>
      {response && <pre style={{textAlign: 'left'}}>{JSON.stringify(response.json, null, 2)}</pre>}
    </div>
  );
}