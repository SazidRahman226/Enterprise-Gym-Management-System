import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { Check, Briefcase } from "lucide-react";

export function LandingPage() {

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            {/* Header Removed (handled by MainLayout) */}

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-32 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Gym" className="w-full h-full object-cover opacity-5" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-950">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Transform Your Body <br />
                        <span className="text-primary-600">Master Your Mind</span>
                    </h1>
                    <p className="mt-6 text-xl text-primary-700 max-w-2xl mx-auto">
                        Join the elite fitness community. Professional trainers, premium equipment, and a plan for every goal.
                    </p>
                    <div className="mt-10">
                        <Link to="/register-member">
                            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary-500/20">Get Started Now</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Subscription Plans */}
            <section id="plans" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary-950">Premium Memberships</h2>
                        <p className="mt-4 text-primary-700">Choose the plan that fits your ambition.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Silver', price: '$29', features: ['Gym Floor Access', 'Locker Room', 'Free WiFi'] },
                            { name: 'Gold', price: '$59', features: ['Gym Floor Access', 'Group Classes', '1 Trainer Session/mo', 'Sauna Access'], popular: true },
                            { name: 'Platinum', price: '$99', features: ['All Access 24/7', 'Unlimited Classes', '5 Trainer Sessions/mo', 'Nutrition Plan'] }
                        ].map((plan) => (
                            <div key={plan.name} className={`relative p-8 border rounded-2xl transition-all hover:shadow-xl ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20 bg-primary-50/30' : 'border-primary-200 bg-white'}`}>
                                {plan.popular && <span className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">Popular</span>}
                                <h3 className="text-2xl font-bold text-primary-950">{plan.name}</h3>
                                <p className="mt-4 mb-6">
                                    <span className="text-4xl font-extrabold text-primary-950">{plan.price}</span>
                                    <span className="text-primary-500">/month</span>
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center text-primary-700">
                                            <Check className="h-5 w-5 text-primary-500 mr-2" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register-member">
                                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>Register Now</Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Our Team */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary-950">Meet Our Team</h2>
                        <p className="mt-4 text-primary-700">World-class trainers ready to guide you.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Alex Rivera", spec: "CrossFit Expert", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                            { name: "Sarah Chen", spec: "Yoga & Pilates", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                            { name: "Mike Tyson", spec: "Boxing", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                            { name: "Jessica Jo", spec: "Strength Coach", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
                        ].map((trainer, i) => (
                            <div key={i} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-primary-100">
                                <div className="h-64 overflow-hidden">
                                    <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-primary-950">{trainer.name}</h3>
                                    <p className="text-primary-600 font-medium">{trainer.spec}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join As Trainer Section */}
            <section className="py-24 bg-primary-50 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <Briefcase className="h-16 w-16 text-primary-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-primary-950 mb-6">Join Our Team of Trainers</h2>
                    <p className="text-xl text-primary-800 mb-10">
                        Are you a certified fitness professional? We're looking for passionate trainers to help our members achieve their best.
                    </p>
                    <Link to="/register-trainer">
                        <Button size="lg" variant="default" className="px-10">Apply as Trainer</Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}