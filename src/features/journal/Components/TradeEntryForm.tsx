import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tradeSchema, TradeFormData } from '../schemas/tradeSchema';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

export const TradeEntryForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
  });

  const onSubmit = (data: TradeFormData) => {
    console.log("Saving trade:", data);
    // Placeholder: We will connect this to our store in the next phase
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Log New Trade</h2>
        
        <Input {...register('asset')} label="Asset" placeholder="e.g. BTCUSD" />
        {errors.asset && <p className="text-red-500 text-xs">{errors.asset.message}</p>}

        <div className="grid grid-cols-2 gap-4">
          <Input {...register('entryPrice')} label="Entry Price" type="number" />
          <Input {...register('exitPrice')} label="Exit Price" type="number" />
        </div>

        <Button type="submit" className="w-full">Log Trade</Button>
      </form>
    </Card>
  );
};

