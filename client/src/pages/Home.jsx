import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-surface-50 min-h-screen font-sans selection:bg-primary-100 selection:text-primary-700">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50/50 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="pt-20 pb-24 md:pt-32 md:pb-40 flex flex-col items-center text-center space-y-10">
                        <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-primary-100 mb-2 animate-bounce">
                            <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2"></span>
                            <span className="text-xs font-bold text-primary-700 uppercase tracking-widest">Now serving Hyderabad</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-surface-900 leading-[1.05]">
                            Find your place in <br />
                            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent italic">your neighborhood.</span>
                        </h1>
                        <p className="max-w-2xl text-xl text-surface-500 font-medium leading-relaxed">
                            TrustBridge connects you with verified locals and trusted service providers in HYD. 
                            Experience home, wherever you are.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/register" className="btn-premium bg-primary-600 text-white hover:bg-primary-700 px-10 py-5 text-lg">
                                JOIN THE COMMUNITY
                            </Link>
                            <Link to="/services" className="btn-premium bg-white text-surface-900 border border-surface-200 hover:bg-surface-50 px-10 py-5 text-lg">
                                EXPLORE SERVICES
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Element */}
                <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-primary-200/30 rounded-full blur-[120px]"></div>
                <div className="absolute top-48 -left-48 w-96 h-96 bg-accent-100/40 rounded-full blur-[120px]"></div>
            </div>

            {/* Features Section */}
            <div className="py-32 bg-surface-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-surface-900 mb-6 tracking-tight">The TrustBridge Experience</h2>
                        <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                name: 'Verified Locals',
                                desc: 'Our "Trusted Resident" badge ensures you connect with genuine neighbors.',
                                icon: '🌟',
                            },
                            {
                                name: 'Elite Services',
                                desc: 'Hand-picked providers, vetted and rated by the community.',
                                icon: '💎',
                            },
                            {
                                name: 'Safe haven',
                                desc: 'A moderated environment for meaningful neighborhood discussions.',
                                icon: '🛡️',
                            }
                        ].map((feature) => (
                            <div key={feature.name} className="card-premium p-10 hover:border-primary-200 group">
                                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform shadow-premium">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-surface-900 mb-4">{feature.name}</h3>
                                <p className="text-surface-500 font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonial Section (Gglassmorphism) */}
            <div className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-surface-900 z-0">
                    <img className="w-full h-full object-cover opacity-20 grayscale" src="https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&q=80&w=2669" alt="Cityscape" />
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="glass-dark p-12 md:p-20 rounded-[48px] text-center">
                        <div className="flex justify-center mb-8">
                            {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-primary-400 text-2xl mx-1">★</span>)}
                        </div>
                        <h4 className="text-2xl md:text-4xl font-semibold text-white leading-tight mb-10 italic">
                            "TrustBridge didn't just find me a plumber; it helped me find my footing in Hyderabad. The community is incredible."
                        </h4>
                        <p className="text-primary-400 font-bold tracking-widest uppercase">— Anjali R., Hitech City</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-32 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-primary-900 rounded-[56px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10 space-y-10">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">Ready to join <span className="text-primary-400">TrustBridge</span>?</h2>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link to="/register" className="btn-premium bg-white text-primary-900 hover:bg-primary-50 px-12 py-5 text-xl">
                                    GET STARTED
                                </Link>
                                <Link to="/login" className="btn-premium bg-primary-800 text-white border border-primary-700 hover:bg-primary-700 px-12 py-5 text-xl">
                                    LOG IN
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
