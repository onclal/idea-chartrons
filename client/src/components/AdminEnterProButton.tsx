import { useTranslation } from 'react-i18next';
import { Button } from './ui';
import { useAdmin } from '../context/AdminContext';

interface AdminEnterProButtonProps {
  shopName: string;
  onEnter: () => void;
  className?: string;
}

export function AdminEnterProButton({ shopName, onEnter, className = '' }: AdminEnterProButtonProps) {
  const { t } = useTranslation();
  const { isAdminMode } = useAdmin();

  if (!isAdminMode) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(t('admin.enterProConfirm', { name: shopName }))) return;
    onEnter();
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      className={`w-full border-chartrons-bordeaux/30 text-chartrons-bordeaux hover:bg-chartrons-bordeaux/5 ${className}`}
    >
      🔑 {t('admin.enterPro')}
    </Button>
  );
}
