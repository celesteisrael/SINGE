<?php

namespace Database\Seeders;

use App\Models\Perfil;
use App\Models\Prioridade;
use App\Models\TipoOcorrencia;
use App\Models\TipoEquipa;
use App\Models\User;
use App\Models\Ocorrencia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Perfis
        $perfisData = [
            ['nome' => 'Administrador', 'descricao' => 'Administrador do Sistema'],
            ['nome' => 'Operador',      'descricao' => 'Operador de Emergências'],
            ['nome' => 'Coordenador',   'descricao' => 'Coordenador Operacional'],
            ['nome' => 'Agente',        'descricao' => 'Agente no Terreno'],
            ['nome' => 'Cidadão',       'descricao' => 'Utilizador Cidadão'],
        ];

        $perfis = [];
        foreach ($perfisData as $p) {
            $perfis[$p['nome']] = Perfil::firstOrCreate(['nome' => $p['nome']], $p);
        }

        // 2. Prioridades
        $prioridadesData = [
            ['nome' => 'Baixo',   'nivel' => 1, 'descricao' => 'Prioridade Baixa'],
            ['nome' => 'Médio',   'nivel' => 2, 'descricao' => 'Prioridade Média'],
            ['nome' => 'Alto',    'nivel' => 3, 'descricao' => 'Prioridade Alta'],
            ['nome' => 'Crítico', 'nivel' => 4, 'descricao' => 'Prioridade Crítica'],
        ];

        $prioridades = [];
        foreach ($prioridadesData as $pr) {
            $prioridades[$pr['nome']] = Prioridade::firstOrCreate(['nome' => $pr['nome']], $pr);
        }

        // 3. Tipos de Ocorrência
        $tiposOcorrenciaData = [
            ['nome' => 'Ciclone',         'descricao' => 'Ciclones e tempestades tropicais'],
            ['nome' => 'Cheia',           'descricao' => 'Inundações e cheias de rios'],
            ['nome' => 'Incêndio',        'descricao' => 'Incêndios florestais ou urbanos'],
            ['nome' => 'Deslizamento',    'descricao' => 'Deslizamento de terras e encostas'],
            ['nome' => 'Acidente',        'descricao' => 'Acidentes rodoviários ou de transporte'],
            ['nome' => 'Seca',            'descricao' => 'Seca severa e falta de água'],
            ['nome' => 'Surto de doença', 'descricao' => 'Epidemias e surtos de saúde pública'],
            ['nome' => 'Outro',           'descricao' => 'Outras ocorrências de emergência'],
        ];

        $tipos = [];
        foreach ($tiposOcorrenciaData as $to) {
            $tipos[$to['nome']] = TipoOcorrencia::firstOrCreate(['nome' => $to['nome']], $to);
        }

        // 4. Tipos de Equipa
        $tiposEquipaData = [
            ['nome' => 'Busca e Salvamento', 'descricao' => 'Equipas de salvamento e resgate'],
            ['nome' => 'Saúde',              'descricao' => 'Equipas médicas e sanitárias'],
            ['nome' => 'Logística',          'descricao' => 'Distribuição de suprimentos e apoio'],
            ['nome' => 'Protecção Civil',    'descricao' => 'Protecção de populações e contenção'],
            ['nome' => 'Avaliação de Danos', 'descricao' => 'Inspeção e levantamento de danos'],
        ];

        foreach ($tiposEquipaData as $te) {
            TipoEquipa::firstOrCreate(['nome' => $te['nome']], $te);
        }

        // 5. Utilizadores Iniciais
        $admin = User::firstOrCreate(
            ['email' => 'admin@singe.gov.mz'],
            [
                'name'      => 'Administrador SINGE',
                'password'  => Hash::make('password123'),
                'perfil_id' => $perfis['Administrador']->id,
                'estado'    => 'Activo',
            ]
        );

        $operador = User::firstOrCreate(
            ['email' => 'ana.sitoe@singe.gov.mz'],
            [
                'name'      => 'Ana Sitoe',
                'password'  => Hash::make('password123'),
                'perfil_id' => $perfis['Operador']->id,
                'estado'    => 'Activo',
            ]
        );

        User::firstOrCreate(
            ['email' => 'carlos.mabunda@singe.gov.mz'],
            [
                'name'      => 'Carlos Mabunda',
                'password'  => Hash::make('password123'),
                'perfil_id' => $perfis['Coordenador']->id,
                'estado'    => 'Activo',
            ]
        );

        User::firstOrCreate(
            ['email' => 'joao.nhampossa@singe.gov.mz'],
            [
                'name'      => 'João Nhampossa',
                'password'  => Hash::make('password123'),
                'perfil_id' => $perfis['Agente']->id,
                'estado'    => 'Activo',
            ]
        );

        // 6. Ocorrências Iniciais
        $ocorrenciasIniciais = [
            [
                'ref'         => 'OC-2025-0142',
                'tipo'        => 'Ciclone',
                'titulo'      => 'Ciclone tropical Filipe',
                'descricao'   => 'Ventos fortes e chuvas intensas afectam a região costeira. População em risco elevado.',
                'provincia'   => 'Sofala',
                'distrito'    => 'Beira',
                'localidade'  => 'Macurungo',
                'localizacao' => 'Macurungo, Beira - Sofala',
                'latitude'    => -19.84,
                'longitude'   => 34.84,
                'estado'      => 'Em análise',
                'prioridade'  => 'Crítico',
                'fonte'       => 'INE — Delegação Sofala',
                'afectados'   => 1240,
                'risco'       => 'Muito elevado',
                'responsavel' => 'Ana Sitoe',
            ],
            [
                'ref'         => 'OC-2025-0141',
                'tipo'        => 'Cheia',
                'titulo'      => 'Cheia do rio Búzi',
                'descricao'   => 'Subida do nível do rio Búzi afecta comunidades ribeirinhas.',
                'provincia'   => 'Sofala',
                'distrito'    => 'Búzi',
                'localidade'  => 'Centro',
                'localizacao' => 'Centro, Búzi - Sofala',
                'latitude'    => -19.96,
                'longitude'   => 34.40,
                'estado'      => 'Validada',
                'prioridade'  => 'Alto',
                'fonte'       => 'DPCC Sofala',
                'afectados'   => 480,
                'risco'       => 'Elevado',
                'responsavel' => 'Ana Sitoe',
            ],
            [
                'ref'         => 'OC-2025-0140',
                'tipo'        => 'Surto de doença',
                'titulo'      => 'Surto de cólera',
                'descricao'   => 'Casos suspeitos de cólera em bairros periféricos.',
                'provincia'   => 'Cabo Delgado',
                'distrito'    => 'Pemba',
                'localidade'  => 'Cariacó',
                'localizacao' => 'Cariacó, Pemba - Cabo Delgado',
                'latitude'    => -12.97,
                'longitude'   => 40.53,
                'estado'      => 'Em resposta',
                'prioridade'  => 'Alto',
                'fonte'       => 'DPS Cabo Delgado',
                'afectados'   => 87,
                'risco'       => 'Elevado',
                'responsavel' => 'Sara Mabote',
            ],
            [
                'ref'         => 'OC-2025-0139',
                'tipo'        => 'Incêndio',
                'titulo'      => 'Incêndio florestal',
                'descricao'   => 'Incêndio em área florestal próxima de comunidades agrícolas.',
                'provincia'   => 'Manica',
                'distrito'    => 'Sussundenga',
                'localidade'  => 'Rotanda',
                'localizacao' => 'Rotanda, Sussundenga - Manica',
                'latitude'    => -19.30,
                'longitude'   => 33.20,
                'estado'      => 'Em análise',
                'prioridade'  => 'Médio',
                'fonte'       => 'Bombeiros Voluntários',
                'afectados'   => 0,
                'risco'       => 'Moderado',
                'responsavel' => 'Ana Sitoe',
            ],
            [
                'ref'         => 'OC-2025-0138',
                'tipo'        => 'Deslizamento',
                'titulo'      => 'Deslizamento de terra',
                'descricao'   => 'Deslizamento bloqueia estrada de acesso.',
                'provincia'   => 'Zambézia',
                'distrito'    => 'Alto Molócuè',
                'localidade'  => 'Nauela',
                'localizacao' => 'Nauela, Alto Molócuè - Zambézia',
                'latitude'    => -15.60,
                'longitude'   => 37.50,
                'estado'      => 'Validada',
                'prioridade'  => 'Médio',
                'fonte'       => 'ANEP',
                'afectados'   => 35,
                'risco'       => 'Moderado',
                'responsavel' => 'Sara Mabote',
            ],
            [
                'ref'         => 'OC-2025-0137',
                'tipo'        => 'Acidente',
                'titulo'      => 'Acidente rodoviário',
                'descricao'   => 'Colisão entre autocarro e camião, várias vítimas.',
                'provincia'   => 'Maputo',
                'distrito'    => 'Marracuene',
                'localidade'  => 'Bobole',
                'localizacao' => 'Bobole, Marracuene - Maputo',
                'latitude'    => -25.72,
                'longitude'   => 32.75,
                'estado'      => 'Resolvida',
                'prioridade'  => 'Baixo',
                'fonte'       => 'PRM',
                'afectados'   => 22,
                'risco'       => 'Baixo',
                'responsavel' => 'Ana Sitoe',
            ],
            [
                'ref'         => 'OC-2025-0136',
                'tipo'        => 'Seca',
                'titulo'      => 'Seca prolongada',
                'descricao'   => 'Escassez de água e pastagens afecta comunidades.',
                'provincia'   => 'Gaza',
                'distrito'    => 'Chicualacuala',
                'localidade'  => 'Centro',
                'localizacao' => 'Centro, Chicualacuala - Gaza',
                'latitude'    => -22.08,
                'longitude'   => 31.68,
                'estado'      => 'Em resposta',
                'prioridade'  => 'Alto',
                'fonte'       => 'DPCC Gaza',
                'afectados'   => 2100,
                'risco'       => 'Elevado',
                'responsavel' => 'Sara Mabote',
            ],
            [
                'ref'         => 'OC-2025-0135',
                'tipo'        => 'Cheia',
                'titulo'      => 'Inundação urbana',
                'descricao'   => 'Inundação em bairro residencial após chuvas intensas.',
                'provincia'   => 'Nampula',
                'distrito'    => 'Nampula',
                'localidade'  => 'Muhala',
                'localizacao' => 'Muhala, Nampula - Nampula',
                'latitude'    => -15.12,
                'longitude'   => 39.26,
                'estado'      => 'Nova',
                'prioridade'  => null,
                'fonte'       => 'Cidadão',
                'afectados'   => 150,
                'risco'       => 'A avaliar',
                'responsavel' => 'Ana Sitoe',
            ],
        ];

        foreach ($ocorrenciasIniciais as $d) {
            $pModel = !empty($d['prioridade']) ? ($prioridades[$d['prioridade']] ?? null) : null;
            $tModel = !empty($d['tipo']) ? ($tipos[$d['tipo']] ?? null) : null;

            Ocorrencia::firstOrCreate(
                ['ref' => $d['ref']],
                [
                    'titulo'             => $d['titulo'],
                    'descricao'          => $d['descricao'],
                    'provincia'          => $d['provincia'],
                    'distrito'           => $d['distrito'],
                    'localidade'         => $d['localidade'],
                    'localizacao'        => $d['localizacao'],
                    'latitude'           => $d['latitude'],
                    'longitude'          => $d['longitude'],
                    'tipo'               => $d['tipo'],
                    'tipo_ocorrencia_id' => $tModel?->id,
                    'prioridade_id'      => $pModel?->id,
                    'estado'             => $d['estado'],
                    'fonte'              => $d['fonte'],
                    'afectados'          => $d['afectados'],
                    'risco'              => $d['risco'],
                    'responsavel'        => $d['responsavel'],
                    'utilizador_id'      => $operador->id,
                ]
            );
        }
    }
}
