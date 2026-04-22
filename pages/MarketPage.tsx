
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, MapPin, Bell, CheckCircle2, X } from 'lucide-react';
import { MarketPrice } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const historicalData = [
  { name: 'Jan', corn: 1950, wheat: 2100, rice: 2000 },
  { name: 'Feb', corn: 1980, wheat: 2150, rice: 2050 },
  { name: 'Mar', corn: 2020, wheat: 2200, rice: 2100 },
  { name: 'Apr', corn: 2050, wheat: 2250, rice: 2150 },
  { name: 'May', corn: 2090, wheat: 2275, rice: 2180 },
  { name: 'Jun', corn: 2110, wheat: 2300, rice: 2210 },
];

const initialPrices: MarketPrice[] = [
  { crop: 'Maize (Corn)', price: 2090, change: +15, trend: 'up' },
  { crop: 'Wheat', price: 2275, change: -5, trend: 'down' },
  { crop: 'Paddy (Rice)', price: 2183, change: 0, trend: 'stable' },
  { crop: 'Soybeans', price: 4600, change: +45, trend: 'up' },
];

const MarketPage: React.FC = () => {
  const [currentPrices, setCurrentPrices] = useState<MarketPrice[]>(initialPrices);
  const [alertActive, setAlertActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Simulate real-time price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrices(prev => prev.map(p => {
        const fluctuate = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newPrice = p.price + fluctuate;
        const newChange = p.change + fluctuate;
        return {
          ...p,
          price: newPrice,
          change: newChange,
          trend: newChange > 0 ? 'up' : (newChange < 0 ? 'down' : 'stable')
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSetAlert = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      alert("Please login to set price alerts.");
      return;
    }

    setAlertActive(!alertActive);
    
    if (!alertActive) {
      // Save alert to database
      try {
        await addDoc(collection(db, 'market_alerts'), {
          user_id: user.uid,
          crop: 'Maize (Corn)', // Example crop
          alert_price: currentPrices[0].price,
          timestamp: serverTimestamp()
        });
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } catch (err: any) {
        console.error("Alert save failed:", err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/30 backdrop-blur-md">
            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Alerts Activated!</p>
              <p className="text-xs text-emerald-200">You'll be notified of price changes in Pune Mandi.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Market Intelligence</h1>
          <div className="flex items-center text-emerald-600 font-medium">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Pune APMC Mandi, Maharashtra</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Real-time Feed Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
              Live Mandi Prices
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">₹ / Quintal</span>
            </h3>
            <div className="space-y-4">
              {currentPrices.map((p) => (
                <div key={p.crop} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-900">{p.crop}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                    <div className={`flex items-center text-xs font-bold w-14 justify-end ${
                      p.trend === 'up' ? 'text-emerald-600' : 
                      p.trend === 'down' ? 'text-red-600' : 'text-slate-400'
                    }`}>
                      {p.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> :
                       p.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                      {p.change >= 0 ? `+${p.change}` : p.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-600 p-8 rounded-3xl text-white relative overflow-hidden group">
            <Info className="h-8 w-8 mb-4 opacity-50 transition-transform group-hover:scale-110" />
            <h4 className="text-xl font-bold mb-2">Mandi Alert</h4>
            <p className="text-emerald-50 text-sm leading-relaxed mb-6">
              Soybean arrivals in Pune Mandi have increased by 20% today. Expect slight price correction by evening session.
            </p>
            <button 
              onClick={handleSetAlert}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all border flex items-center justify-center gap-2 ${
                alertActive 
                ? 'bg-white text-emerald-600 border-white' 
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {alertActive ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Alerts Active
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Set Price Alerts
                </>
              )}
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-[400px]">
            <h3 className="font-bold text-slate-900 mb-8">Price History - Pune Region</h3>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorCorn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Price']}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                />
                <Area type="monotone" dataKey="corn" stroke="#059669" fillOpacity={1} fill="url(#colorCorn)" strokeWidth={3} />
                <Area type="monotone" dataKey="wheat" stroke="#0ea5e9" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Top Regional Sources</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">Baramati Cluster</span>
                  <span className="font-bold">12.5K Quintals</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">Shirur Region</span>
                  <span className="font-bold">8.1K Quintals</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full w-[65%] bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Mandi Logistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">Truck Availability</span>
                  <span className="text-emerald-600 font-bold">High</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">Storage Capacity</span>
                  <span className="text-amber-600 font-bold">85% Full</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
