import { Card } from '../../../components/ui/card';

interface MetricCardProps {
  label: string;
  value: string | number;
}

export const MetricCard = ({ label, value }: MetricCardProps) => (
  <Card>
    <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </Card>
);
