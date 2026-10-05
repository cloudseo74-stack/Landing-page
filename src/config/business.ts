export const business = {
  name: 'Ganpati Travel Solutions',
  phone: '+919942853788', phoneDisplay: '+91 9942853788',
  secondaryPhone: '+919304951630', secondaryPhoneDisplay: '+91 9304951630',
  whatsapp: '919942853788',
  email: 'ganpatisolutionsranchi@gmail.com', secondaryEmail: 'jmtdeepakburman@gmail.com',
  address: 'G 17, Ground Floor, Amravati Commercial Complex, Near BIT Extension, Lalpur, Ranchi, Jharkhand 834001',
  gst: '20DDKPK3724B1Z5',
};
export const createWhatsAppUrl = (message: string) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
export const enquiry = (subject = 'a taxi') => `Hello ${business.name}, I would like to book ${subject}. Please share availability and fare details.`;
