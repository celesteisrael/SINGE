<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ocorrencia extends Model
{
    protected $table = 'ocorrencias';

    protected $fillable = [
        'ref',
        'titulo',
        'descricao',
        'provincia',
        'distrito',
        'localidade',
        'localizacao',
        'latitude',
        'longitude',
        'tipo',
        'tipo_ocorrencia_id',
        'prioridade_id',
        'utilizador_id',
        'estado',
        'fonte',
        'afectados',
        'risco',
        'responsavel',
    ];

    protected $appends = ['lat', 'lng', 'prioridade'];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'afectados' => 'integer',
        ];
    }

    public function getLatAttribute()
    {
        return $this->latitude;
    }

    public function getLngAttribute()
    {
        return $this->longitude;
    }

    public function getPrioridadeAttribute()
    {
        return $this->prioridadeRelacao?->nome ?? null;
    }

    public function tipoOcorrencia(): BelongsTo
    {
        return $this->belongsTo(TipoOcorrencia::class, 'tipo_ocorrencia_id');
    }

    public function prioridadeRelacao(): BelongsTo
    {
        return $this->belongsTo(Prioridade::class, 'prioridade_id');
    }

    public function utilizador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'utilizador_id');
    }

    public function missoes(): HasMany
    {
        return $this->hasMany(Missao::class, 'ocorrencia_id');
    }

    public function historico(): HasMany
    {
        return $this->hasMany(HistoricoOcorrencia::class, 'ocorrencia_id');
    }
}
