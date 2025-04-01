"use client";

export default function Testimonials() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What our customers say
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Don't just take our word for it. Here's what our satisfied customers have to say about CoolCare's subscription service.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author.name}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200"
            >
              <div>
                <div className="flex items-center gap-x-2">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg 
                      key={rating} 
                      className={`h-5 w-5 ${rating < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="mt-6 text-lg font-semibold leading-6 text-gray-900">{testimonial.title}</p>
                <p className="mt-2 text-base leading-6 text-gray-600">{testimonial.body}</p>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-4">
                <p className="text-base font-semibold leading-6 text-gray-900">{testimonial.author.name}</p>
                <p className="text-sm text-gray-600">{testimonial.author.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    body: "CoolCare has transformed how I maintain my air conditioners. Their technicians are professional, prompt, and thorough. The regular maintenance has noticeably improved the cooling efficiency and air quality in my home.",
    author: {
      name: "Sarah Tan",
      location: "Petaling Jaya",
    },
    title: "Excellent Service Every Time",
    rating: 5,
  },
  {
    body: "I used to forget about AC maintenance until problems arose. With CoolCare's subscription, I don't have to remember anymore! Their service reminders, quick response to issues, and professional team are worth every penny.",
    author: {
      name: "Ahmad Ismail",
      location: "Kuala Lumpur",
    },
    title: "Worry-Free AC Maintenance",
    rating: 5,
  },
  {
    body: "As a business owner, maintaining a comfortable environment for customers is crucial. CoolCare's business subscription has been reliable and cost-effective. Their 24/7 emergency service has saved us several times!",
    author: {
      name: "David Wong",
      location: "Johor Bahru",
    },
    title: "Perfect for My Business Needs",
    rating: 4,
  },
]; 