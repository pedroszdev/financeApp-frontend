import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Filters from '../components/transactions/Filters';
import Pagination from '../components/transactions/Pagination';
import TransactionCards from '../components/transactions/TransactionCards';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionModal from '../components/transactions/TransactionModal';
import { api } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';

const INITIAL_FILTERS = { search: '', tipo: 'todas', categoria: 'todas', page: 1 };

export default function Transactions() {
  const toast = useToast();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 300);

  const [data, setData] = useState({ transacoes: [], totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ open: false, transacao: null });
  const [confirm, setConfirm] = useState({ open: false, transacao: null, loading: false });

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      tipo: filters.tipo,
      categoria: filters.categoria,
      page: filters.page,
    }),
    [debouncedSearch, filters.tipo, filters.categoria, filters.page]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.transacoes.list(query);
      setData({
        transacoes: res?.transacoes || [],
        totalPages: res?.totalPages || 1,
        currentPage: res?.currentPage || 1,
      });
    } catch (err) {
      if (err.status !== 401) toast.error(err.message || 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  }, [query, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => setModal({ open: true, transacao: null });
  const openEdit = (t) => setModal({ open: true, transacao: t });
  const closeModal = () => setModal({ open: false, transacao: null });

  const askDelete = (t) => setConfirm({ open: true, transacao: t, loading: false });
  const cancelDelete = () => setConfirm({ open: false, transacao: null, loading: false });

  const confirmDelete = async () => {
    if (!confirm.transacao) return;
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await api.transacoes.remove(confirm.transacao.id);
      toast.success('Transação excluída');
      cancelDelete();
      await load();
    } catch (err) {
      toast.error(err.message || 'Não foi possível excluir');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const hasFilter =
    !!filters.search ||
    (filters.tipo && filters.tipo !== 'todas') ||
    (filters.categoria && filters.categoria !== 'todas');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[20px] font-semibold text-ink-900 sm:text-[24px]">
            Transações
          </h1>
          <p className="text-[13px] text-ink-500">
            Cadastre, filtre e gerencie suas receitas e despesas.
          </p>
        </div>
        <Button onClick={openCreate}>
          <span aria-hidden="true">＋</span> Nova transação
        </Button>
      </div>

      <Filters
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={64} className="w-full" />
          ))}
        </div>
      ) : data.transacoes.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Nenhuma transação encontrada"
          description={
            hasFilter
              ? 'Nenhum resultado para os filtros atuais. Tente ajustá-los ou limpar.'
              : 'Você ainda não cadastrou nenhuma transação. Clique em Nova transação para começar.'
          }
          action={
            hasFilter ? (
              <Button variant="secondary" onClick={() => setFilters(INITIAL_FILTERS)}>
                Limpar filtros
              </Button>
            ) : (
              <Button onClick={openCreate}>Nova transação</Button>
            )
          }
        />
      ) : (
        <>
          <TransactionTable items={data.transacoes} onEdit={openEdit} onDelete={askDelete} />
          <TransactionCards items={data.transacoes} onEdit={openEdit} onDelete={askDelete} />
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}

      <TransactionModal
        open={modal.open}
        transacao={modal.transacao}
        onClose={closeModal}
        onSaved={load}
      />

      <ConfirmDialog
        open={confirm.open}
        loading={confirm.loading}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        title="Excluir transação"
        message={
          confirm.transacao
            ? `Tem certeza que deseja excluir "${confirm.transacao.descricao}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir"
      />
    </div>
  );
}
