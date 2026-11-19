import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, StatCard } from '../../components/common/CommonComponents';

const COLORS = ['#2563eb', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#7c3aed', '#0891b2'];
const display = value => String(value || '').replaceAll('_', ' ');

function ChartCard({ title, children }) {
  return <Card className="p-4 md:p-5"><h2 className="mb-3 font-semibold">{title}</h2><div className="h-64">{children}</div></Card>;
}

export function AdminDashboardReal({ data, loading, error, onRefresh, onManageUsers }) {
  if (error) return <Card role="alert" className="border-red-200 text-sm text-red-700 dark:border-red-900 dark:text-red-300">{error}<button className="ml-2 underline" onClick={onRefresh}>Tentar novamente</button></Card>;
  const users = data?.utilizadores || {};
  const occurrences = data?.ocorrencias || {};
  const missions = data?.missoes || {};
  const userChart = (users.por_perfil || []).map(item => ({ name: item.perfil, total: Number(item.total) }));
  const stateChart = (occurrences.por_estado || []).map(item => ({ name: display(item.estado), total: Number(item.total) }));
  const typeChart = (occurrences.por_tipo || []).filter(item => Number(item.total) > 0).map(item => ({ name: item.tipo, total: Number(item.total) }));
  const missionStates = (missions.por_estado || []).map(item => ({ name: display(item.estado), total: Number(item.total) }));
  return <div className="space-y-5">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Administração do sistema</p><h2 className="mt-1 text-2xl font-bold">Visão global do SINGE</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Indicadores agregados da base operacional actualizados a partir da API.</p></div><button onClick={onManageUsers} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">Gerir utilizadores</button></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><StatCard icon="Users" label="Utilizadores" value={loading ? '…' : users.total ?? 0} hint={`${users.activos ?? 0} activos · ${users.inactivos ?? 0} inactivos`} tone="brand" /><StatCard icon="FileText" label="Ocorrências" value={loading ? '…' : occurrences.total ?? 0} tone="orange" /><StatCard icon="Target" label="Missões activas" value={loading ? '…' : missionStates.filter(item => ['atribuida', 'em deslocacao', 'em execucao'].includes(item.name)).reduce((total, item) => total + item.total, 0)} tone="brand" /><StatCard icon="Users" label="Equipas disponíveis" value={loading ? '…' : (data?.equipas?.por_estado || []).find(item => item.estado === 'disponivel')?.total ?? 0} tone="green" /><StatCard icon="AlertOctagon" label="Alertas públicos activos" value={loading ? '…' : data?.alertas_activos ?? 0} tone="red" /></div>
    {loading && !data ? <Card role="status">A carregar indicadores administrativos…</Card> : <div className="grid gap-4 xl:grid-cols-2">

      <ChartCard title="Utilizadores por perfil"><ResponsiveContainer width="100%" height="100%"><BarChart data={userChart}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#2563eb" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Ocorrências por tipo"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={typeChart} dataKey="total" nameKey="name" outerRadius={85} label={({ name, value }) => `${name} (${value})`}>{typeChart.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Ocorrências por estado"><ResponsiveContainer width="100%" height="100%"><BarChart data={stateChart}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#ea580c" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Missões por estado"><ResponsiveContainer width="100%" height="100%"><BarChart data={missionStates}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#0f766e" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>

      {typeChart.length === 0 && <Card className="text-sm text-slate-500">Ainda não existem dados suficientes para apresentar a distribuição por tipo.</Card>}
    </div>}
  </div>;
}

export default AdminDashboardReal;
