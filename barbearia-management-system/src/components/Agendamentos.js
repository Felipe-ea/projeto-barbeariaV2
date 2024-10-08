import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertCircle, Edit2, Save, X } from 'lucide-react';

const tiposDeCorte = [
  { nome: "Corte Clássico", valor: 30 },
  { nome: "Barba", valor: 25 },
  { nome: "Corte + Barba", valor: 50 },
  { nome: "Acabamento", valor: 20 },
  { nome: "Pacote Completo", valor: 70 },
];

const AgendamentoDashboard = () => {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [tipoCorte, setTipoCorte] = useState('');
  const [valor, setValor] = useState(0);
  const [agendamentos, setAgendamentos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgendamentos(prevAgendamentos => 
        prevAgendamentos.map(agendamento => {
          const agendamentoDateTime = new Date(`${agendamento.data}T${agendamento.hora}`);
          if (!agendamento.pendente && agendamentoDateTime < new Date()) {
            return { ...agendamento, pendente: true };
          }
          return agendamento;
        })
      );
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleTipoCorteChange = (e) => {
    const selectedValue = e.target.value;
    setTipoCorte(selectedValue);
    const corte = tiposDeCorte.find(tipo => tipo.nome === selectedValue);
    setValor(corte ? corte.valor : 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editandoId) {
      saveEdit();
    } else {
      const novoAgendamento = { id: Date.now(), nome, data, hora, tipoCorte, valor, pendente: false };
      setAgendamentos([...agendamentos, novoAgendamento]);
      resetForm();
    }
  };

  const resetForm = () => {
    setNome('');
    setData('');
    setHora('');
    setTipoCorte('');
    setValor(0);
    setEditandoId(null);
  };

  const startEditing = (agendamento) => {
    setEditandoId(agendamento.id);
    setNome(agendamento.nome);
    setData(agendamento.data);
    setHora(agendamento.hora);
    setTipoCorte(agendamento.tipoCorte);
    setValor(agendamento.valor);
  };

  const saveEdit = () => {
    setAgendamentos(agendamentos.map(ag => 
      ag.id === editandoId ? { ...ag, nome, data, hora, tipoCorte, valor } : ag
    ));
    resetForm();
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Agendamento</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Novo Agendamento */}
          <Card className="bg-gray-100 shadow-md rounded-lg overflow-hidden">
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-xl font-semibold">
                {editandoId ? 'Editar Agendamento' : 'Novo Agendamento'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    id="nome"
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      id="data"
                      type="date"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input
                      id="hora"
                      type="time"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="tipoCorte" className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                  <select
                    id="tipoCorte"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={tipoCorte}
                    onChange={handleTipoCorteChange}
                    required
                  >
                    <option value="">Selecione o serviço</option>
                    {tiposDeCorte.map((tipo) => (
                      <option key={tipo.nome} value={tipo.nome}>
                        {tipo.nome} - R$ {tipo.valor.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {valor.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                    {editandoId ? 'Salvar Edição' : 'Agendar'}
                  </Button>
                  {editandoId && (
                    <Button type="button" onClick={cancelEdit} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Agendamentos */}
          <Card className="bg-gray-100 shadow-md rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-800 text-white">
              <CardTitle className="text-xl font-semibold">Agendamentos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {agendamentos.map((agendamento) => (
                  <div key={agendamento.id} className={`bg-white p-4 rounded-md shadow border-l-4 ${agendamento.pendente ? 'border-red-500' : 'border-blue-500'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{agendamento.nome}</h3>
                        <p className="text-gray-600">{agendamento.data} às {agendamento.hora}</p>
                        <p className="text-gray-600">{agendamento.tipoCorte}</p>
                        <p className="text-blue-600 font-semibold">R$ {agendamento.valor.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => startEditing(agendamento)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                          <Edit2 size={16} />
                        </Button>
                        {agendamento.pendente && (
                          <div className="flex items-center text-red-500">
                            <AlertCircle size={16} className="mr-1" />
                            <span className="text-sm">Pendente</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {agendamentos.length === 0 && (
                  <p className="text-center text-gray-500 italic">Nenhum agendamento registrado.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoDashboard;