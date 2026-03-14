
import { useState } from 'react';
import { FeatureGate } from '@/components/FeatureGate';

async function fetchRevenueForecast() {
  const res = await fetch('https://synixbackend.onrender.com/api/revenue-forecast');
  if (!res.ok) throw new Error('Failed to fetch revenue forecast');
  const data = await res.json();
  return data.revenue_forecast;
}

export default function AnalyticsPage() {
  const [forecast, setForecast] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const value = await fetchRevenueForecast();
      setForecast(value);
    } catch (err) {
      setError('Could not fetch forecast');
    }
    setLoading(false);
  };

  return (
    <FeatureGate requiredPlan="pro">
      <div>
        <h1>Analytics Dashboard</h1>
        <button onClick={handleClick} disabled={loading} style={{marginTop: 16, marginBottom: 16}}>
          {loading ? 'Loading...' : 'Show Revenue Forecast'}
        </button>
        {forecast !== null && (
          <div style={{fontWeight: 'bold', fontSize: 18}}>
            Forecast: {forecast.toLocaleString()}
          </div>
        )}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </FeatureGate>
  );
}