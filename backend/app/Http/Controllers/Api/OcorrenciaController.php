<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ocorrencia;
use App\Models\TipoOcorrencia;
use App\Models\Prioridade;
use Illuminate\Http\Request;

class OcorrenciaController extends Controller
{
    /**
     * Listar todas as ocorrências
     */
    public function index()
    {
        $ocorrencias = Ocorrencia::with(['tipoOcorrencia', 'prioridadeRelacao', 'utilizador'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($oc) {
                return $this->formatarOcorrencia($oc);
            });

        return response()->json($ocorrencias);
    }

    /**
     * Obter detalhe de uma ocorrência por ref ou id
     */
    public function show($ref)
    {
        $oc = Ocorrencia::with(['tipoOcorrencia', 'prioridadeRelacao', 'utilizador'])
            ->where('ref', $ref)
            ->orWhere('id', $ref)
            ->first();

        if (!$oc) {
            return response()->json(['message' => 'Ocorrência não encontrada.'], 404);
        }

        return response()->json($this->formatarOcorrencia($oc));
    }

    /**
     * Criar nova ocorrência
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo'     => 'required|string|max:150',
            'descricao'  => 'required|string',
            'tipo'       => 'nullable|string',
            'provincia'  => 'nullable|string',
            'distrito'   => 'nullable|string',
            'localidade' => 'nullable|string',
            'endereco'   => 'nullable|string',
            'lat'        => 'nullable|numeric',
            'lng'        => 'nullable|numeric',
            'fonte'      => 'nullable|string',
            'afectados'  => 'nullable|integer',
            'risco'      => 'nullable|string',
            'responsavel'=> 'nullable|string',
            'data'       => 'nullable|string',
        ]);

        // Gerar referência única (ex: OC-2025-0143)
        $ultimoId = Ocorrencia::max('id') ?? 0;
        $uniqueRef = 'OC-' . date('Y') . '-' . str_pad($ultimoId + 143, 4, '0', STR_PAD_LEFT);

        // Buscar tipo_ocorrencia_id correspondente
        $tipoNome = $validated['tipo'] ?? 'Outro';
        $tipoModel = TipoOcorrencia::where('nome', $tipoNome)->first();

        $localizacao = trim(($validated['localidade'] ?? '') . ', ' . ($validated['distrito'] ?? '') . ' - ' . ($validated['provincia'] ?? 'Maputo'), ' ,-');

        $ocorrencia = Ocorrencia::create([
            'ref'                => $uniqueRef,
            'titulo'             => $validated['titulo'],
            'descricao'          => $validated['descricao'],
            'provincia'          => $validated['provincia'] ?? 'Maputo',
            'distrito'           => $validated['distrito'] ?? '',
            'localidade'         => $validated['localidade'] ?? '',
            'localizacao'        => $localizacao ?: 'Maputo',
            'latitude'           => $validated['lat'] ?? null,
            'longitude'          => $validated['lng'] ?? null,
            'tipo'               => $tipoNome,
            'tipo_ocorrencia_id' => $tipoModel?->id,
            'prioridade_id'      => null, // Conforme RN: 'Por validar' e prioridade nula na criação
            'estado'             => 'Por validar',
            'fonte'              => $validated['fonte'] ?? 'Cidadão',
            'afectados'          => $validated['afectados'] ?? 0,
            'risco'              => $validated['risco'] ?? 'A avaliar',
            'responsavel'        => $validated['responsavel'] ?? 'Operador',
            'utilizador_id'      => auth()->id(),
        ]);

        return response()->json($this->formatarOcorrencia($ocorrencia), 201);
    }

    /**
     * Formatar a ocorrência para manter compatibilidade total com o Frontend
     */
    private function formatarOcorrencia(Ocorrencia $oc)
    {
        return [
            'id'          => $oc->ref ?: (string)$oc->id,
            'ref'         => $oc->ref ?: 'OC-' . date('Y') . '-' . str_pad($oc->id, 4, '0', STR_PAD_LEFT),
            'tipo'        => $oc->tipo ?: ($oc->tipoOcorrencia?->nome ?? 'Emergência'),
            'titulo'      => $oc->titulo,
            'descricao'   => $oc->descricao,
            'provincia'   => $oc->provincia ?: 'Maputo',
            'distrito'    => $oc->distrito ?: '',
            'localidade'  => $oc->localidade ?: '',
            'lat'         => $oc->latitude ? (float)$oc->latitude : null,
            'lng'         => $oc->longitude ? (float)$oc->longitude : null,
            'data'        => $oc->created_at ? $oc->created_at->format('Y-m-d H:i') : date('Y-m-d H:i'),
            'estado'      => $oc->estado ?: 'Por validar',
            'prioridade'  => $oc->prioridadeRelacao?->nome ?? null,
            'fonte'       => $oc->fonte ?: 'Cidadão',
            'afectados'   => (int)$oc->afectados,
            'risco'       => $oc->risco ?: 'A avaliar',
            'responsavel' => $oc->responsavel ?: 'Operador',
            'created_at'  => $oc->created_at?->toISOString(),
        ];
    }
}
