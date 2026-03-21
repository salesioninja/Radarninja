'use client';

import { useState } from 'react';
import { createOfferAction } from '@/actions/create-offer';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, MapPin, Coins, Navigation, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const price = parseInt(formData.get('price') as string, 10);
    const address = formData.get('address') as string;

    try {
      await createOfferAction({ title, price, address });
      toast.success('Oferta publicada!', {
        description: 'Seu estabelecimento agora aparece para clientes na área.',
      });
      router.push('/');
    } catch (error: any) {
      toast.error('Erro ao publicar', {
        description: error.message || 'Verifique os dados e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-900">Painel do Estabelecimento</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">Publicar Nova Oferta</CardTitle>
            <CardDescription className="text-base">
              Preencha os dados abaixo para exibir sua oferta para clientes próximos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="offer-form" onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-primary" /> Título da Oferta
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Almoço executivo com 20% de desconto"
                  required
                  className="h-11 border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Coins className="w-4 h-4 text-primary" /> Pontos de Recompensa
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  placeholder="100"
                  required
                  className="h-11 border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Navigation className="w-4 h-4 text-primary" /> Endereço do Estabelecimento
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Ex: Av. Bertino Warmiling, 570 – Salto do Lontra, PR"
                  required
                  className="h-11 border-slate-300"
                />
                <p className="text-xs text-slate-400">O endereço será convertido automaticamente em localização geográfica.</p>
              </div>

            </form>
          </CardContent>
          <CardFooter className="pt-2 pb-6 px-6">
            <Button
              type="submit"
              form="offer-form"
              size="lg"
              className="w-full text-base h-12 font-semibold"
              disabled={loading}
            >
              {loading ? 'Publicando...' : 'Publicar Nova Oferta'}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
