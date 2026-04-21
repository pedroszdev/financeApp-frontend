import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CATEGORIAS, TIPOS } from '../../utils/constants';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { parseCurrencyInput } from '../../utils/formatCurrency';

function initialForm(tr) {
  return {
    descricao: tr?.descricao || '',
    valor: tr != null && tr.valor != null ? String(tr.valor).replace('.', ',') : '',
    tipo: tr?.tipo || 'Despesa',
    categoria: tr?.categoria || CATEGORIAS[0],
  };
}

export default function TransactionModal({ open, transacao, onClose, onSaved }) {
  const toast = useToast();
  const isEditing = !!transacao;
  const [form, setForm] = useState(() => initialForm(transacao));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initialForm(transacao));
      setErrors({});
      setSubmitError('');
    }
  }, [open, transacao]);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    const desc = form.descricao.trim();
    if (desc.length < 3) next.descricao = 'Descrição precisa ter 3 ou mais caracteres';
    if (desc.length > 100) next.descricao = 'Máximo de 100 caracteres';
    const valor = parseCurrencyInput(form.valor);
    if (!valor || valor <= 0) next.valor = 'Informe um valor maior que zero';
    if (!TIPOS.includes(form.tipo)) next.tipo = 'Tipo inválido';
    if (!CATEGORIAS.includes(form.categoria)) next.categoria = 'Escolha uma categoria';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);
    const payload = {
      descricao: form.descricao.trim(),
      valor: parseCurrencyInput(form.valor),
      tipo: form.tipo,
      categoria: form.categoria,
    };
    try {
      if (isEditing) {
        await api.transacoes.update(transacao.id, payload);
        toast.success('Transação atualizada');
      } else {
        await api.transacoes.create(payload);
        toast.success('Transação cadastrada');
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={isEditing ? 'Editar transação' : 'Nova transação'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" form="transacao-form" loading={loading}>
            {isEditing ? 'Salvar alterações' : 'Criar transação'}
          </Button>
        </>
      }
    >
      {submitError && (
        <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-brand-red">
          {submitError}
        </div>
      )}
      <form id="transacao-form" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Descrição"
          value={form.descricao}
          onChange={update('descricao')}
          error={errors.descricao}
          maxLength={100}
          placeholder="Ex.: Supermercado"
          autoFocus
        />
        <Input
          label="Valor (R$)"
          value={form.valor}
          onChange={update('valor')}
          error={errors.valor}
          inputMode="decimal"
          placeholder="0,00"
        />
        <fieldset>
          <legend className="label mb-1">Tipo</legend>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map((t) => {
              const active = form.tipo === t;
              const isReceita = t === 'Receita';
              const activeClass = isReceita
                ? 'border-brand-green bg-emerald-50 text-brand-green'
                : 'border-brand-red bg-red-50 text-brand-red';
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, tipo: t }))}
                  className={`btn justify-center ${
                    active ? activeClass : 'btn-secondary'
                  }`}
                >
                  <span aria-hidden="true">{isReceita ? '↗' : '↘'}</span>
                  {t}
                </button>
              );
            })}
          </div>
        </fieldset>
        <Select
          label="Categoria"
          value={form.categoria}
          onChange={update('categoria')}
          options={CATEGORIAS}
          error={errors.categoria}
        />
      </form>
    </Modal>
  );
}
