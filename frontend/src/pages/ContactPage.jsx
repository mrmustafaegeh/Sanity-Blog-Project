import { useState } from "react";
import { useCreateContactMutation } from "../api/contactAPI";
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2 } from "lucide-react";
import Button from "../components/ui/Button";
import SEO from "../components/shared/SEO";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const [createContact, { isLoading }] = useCreateContactMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact(formData).unwrap();
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title="Contact Us | Blogify"
        description="Get in touch with the Blogify team for inquiries, support, or feedback."
      />

      {/* Hero Section */}
      <section className="bg-background pt-24 pb-12 md:pt-32 md:pb-16 px-6 text-center border-b border-border">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto leading-relaxed">
            Have a question, proposal, or just want to say hello? We’d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Contact Info (Minimal Sidebar) */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h2 className="text-lg font-bold text-primary mb-6 uppercase tracking-wider">Contact Info</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Email</h3>
                    <a href="mailto:support@blogify.com" className="block text-secondary hover:text-primary transition-colors">support@blogify.com</a>
                    <a href="mailto:partnerships@blogify.com" className="block text-secondary hover:text-primary transition-colors">partnerships@blogify.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Phone</h3>
                    <p className="text-secondary">+1 (555) 123-4567</p>
                    <p className="text-tertiary text-sm mt-1">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Office</h3>
                    <p className="text-secondary leading-relaxed">
                      123 Innovation Drive<br />
                      Tech District, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
               <p className="text-tertiary text-sm">
                 &copy; {new Date().getFullYear()} Blogify Inc. All rights reserved.
               </p>
            </div>
          </div>

          {/* Contact Form (3D Vibe) */}
          <div className="lg:col-span-8">
            <div className="bg-surface rounded-[2rem] border border-white/50 p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.15)] relative overflow-hidden isolate transition-all duration-300 hover:shadow-[0_25px_60px_-10px_rgba(28,25,23,0.2)] hover:-translate-y-1">
              
              {/* Subtle gradient accent */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-neutral-100 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />

              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500 min-h-[400px]">
                  <div className="w-24 h-24 bg-primary text-white rounded-3xl rotate-3 shadow-xl flex items-center justify-center mb-8">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-primary mb-4">Message Received</h2>
                  <p className="text-secondary text-lg max-w-md mb-8 leading-relaxed font-medium">
                    Thank you for getting in touch. We've received your note and will respond shortly.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="border-2 font-bold px-8 py-3">
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-3">Send us a Message</h2>
                    <p className="text-secondary text-lg">
                      Fill out the form below and we'll reply as soon as possible.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-neutral-50 rounded-xl border-2 border-transparent shadow-inner focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-neutral-50 rounded-xl border-2 border-transparent shadow-inner focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="subject" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full px-5 py-4 bg-neutral-50 rounded-xl border-2 border-transparent shadow-inner focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="message" className="text-sm font-bold text-primary uppercase tracking-wider ml-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-5 py-4 bg-neutral-50 rounded-xl border-2 border-transparent shadow-inner focus:bg-white focus:border-primary focus:shadow-lg focus:shadow-primary/5 outline-none transition-all duration-300 placeholder:text-tertiary font-medium resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full md:w-auto py-4 px-10 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 rounded-xl"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message <Send className="w-5 h-5 ml-1" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
