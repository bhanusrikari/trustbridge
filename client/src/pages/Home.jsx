import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>

                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left space-y-6">
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-2">
                                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse mr-2"></span>
                                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Now serving Hyderabad</span>
                                </div>
                                <h1 className="text-5xl tracking-tight font-black text-slate-900 sm:text-6xl md:text-7xl leading-[1.1]">
                                    <span className="block xl:inline">New to the City?</span>{' '}
                                    <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent xl:inline pb-2">Feel at home instantly.</span>
                                </h1>
                                <p className="text-lg text-slate-500 sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0 font-medium leading-relaxed">
                                    TrustBridge connects you with verified Hyderabad locals and trusted service providers in Gachibowli, Hitech City, and beyond.
                                </p>
                                <div className="pt-2 sm:flex sm:justify-center lg:justify-start gap-4">
                                    <Link to="/register" className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-200 bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1">
                                        GET STARTED
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                    </Link>
                                    <Link to="/services" className="inline-flex items-center justify-center px-10 py-5 font-black text-slate-700 transition-all duration-200 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 shadow-sm">
                                        FIND SERVICES
                                    </Link>
                                </div>

                                <div className="flex items-center space-x-4 pt-8 border-t border-slate-50">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-2 ring-indigo-50">
                                                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">
                                        <span className="text-indigo-600">5,000+</span> newcomers already joined
                                    </p>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-full w-full relative group">
                        <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&q=80&w=2669" alt="Charminar Hyderabad" />
                        <div className="absolute bottom-8 right-8 z-20 bg-white/90 backdrop-blur-md p-6 rounded-[32px] shadow-2xl border border-white/20 hidden xl:block animate-in slide-in-from-right-10 duration-1000">
                            <div className="flex items-center mb-2">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                </div>
                                <span className="ml-2 text-xs font-black text-slate-400 tracking-widest uppercase">Community Choice</span>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 leading-tight">"Easily the best way to find a trusted plumber in Kondapur"</h4>
                            <p className="mt-2 text-sm font-bold text-slate-500">— Anjali R., Newcomer</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-16 space-y-4">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Our Ecosystem</span>
                        <h2 className="text-4xl font-black text-slate-900 sm:text-5xl tracking-tight">Everything you need to settle</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            We bridge the gap between uncertainty and belonging through human-to-human connection.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                name: 'Local Guides',
                                desc: 'Verified residents to show you the local life.',
                                icon: '🤝',
                                color: 'bg-indigo-100 text-indigo-600'
                            },
                            {
                                name: 'Verified Services',
                                desc: 'Electricians, cleaners, and more with real reviews.',
                                icon: '🔧',
                                color: 'bg-emerald-100 text-emerald-600'
                            },
                            {
                                name: 'Community Forum',
                                desc: 'Ask questions and get answers from neighbors.',
                                icon: '📢',
                                color: 'bg-orange-100 text-orange-600'
                            },
                            {
                                name: 'Real-time Tracking',
                                desc: 'Track your service provider until they reach you.',
                                icon: '📍',
                                color: 'bg-rose-100 text-rose-600'
                            }
                        ].map((feature) => (
                            <div key={feature.name} className="group p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{feature.name}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="py-16 px-4">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] overflow-hidden relative shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] -ml-24 -mb-24"></div>

                    <div className="relative px-8 py-20 text-center space-y-8">
                        <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight max-w-3xl mx-auto">
                            Join the TrustBridge community and feel at home today.
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="px-12 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95 text-lg">
                                JOIN FOR FREE
                            </Link>
                            <Link to="/login" className="px-12 py-5 bg-slate-800 text-white font-black rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all text-lg">
                                LOG IN
                            </Link>
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No credit card required • Join 10k+ locals</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
