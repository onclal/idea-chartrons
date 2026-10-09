import { useState, type FormEvent } from 'react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button, Card, Input } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { loadPricing, pricingLabel, savePricing } from '../../lib/pricing';

/** Prix du Premium Pro : fixés ici par l'administrateur (rédigé en français uniquement). */
export function AdminPricingPage() {
  const { showToast } = useToast();
  const initial = loadPricing();
  const [monthly, setMonthly] = useState(initial.monthly !== null ? String(initial.monthly) : '');
  const [yearly, setYearly] = useState(initial.yearly !== null ? String(initial.yearly) : '');

  const preview = pricingLabel(
    { monthly: Number(monthly.replace(',', '.')) || null, yearly: Number(yearly.replace(',', '.')) || null },
    'fr',
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const saved = savePricing({
      monthly: Number(monthly.replace(',', '.')) || null,
      yearly: Number(yearly.replace(',', '.')) || null,
    });
    setMonthly(saved.monthly !== null ? String(saved.monthly) : '');
    setYearly(saved.yearly !== null ? String(saved.yearly) : '');
    showToast('Tarifs enregistrés.', 'success');
  };

  return (
    <div>
      <AdminPageHeader
        title="Tarifs"
        subtitle="Fixez vous-même le prix du Premium Pro. Une case vide s’affiche « à définir » sur le site."
      />
      <Card className="!p-4 sm:!p-5 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Prix mensuel (en euros)"
            inputMode="decimal"
            placeholder="par exemple 20"
            value={monthly}
            onChange={(event) => setMonthly(event.target.value)}
          />
          <Input
            label="Prix annuel (en euros)"
            inputMode="decimal"
            placeholder="par exemple 200"
            value={yearly}
            onChange={(event) => setYearly(event.target.value)}
          />
          <p className="text-sm text-chartrons-olive-dark">
            Affichage sur le site : <strong>{preview}</strong>
          </p>
          <Button type="submit" variant="gold">
            Enregistrer
          </Button>
        </form>
      </Card>
    </div>
  );
}
