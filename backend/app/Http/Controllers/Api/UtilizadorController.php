<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Perfil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UtilizadorController extends Controller
{
    /**
     * Listar todos os utilizadores
     */
    public function index()
    {
        $users = User::with('perfil')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($u) {
                return $this->formatarUtilizador($u);
            });

        return response()->json($users);
    }

    /**
     * Registar novo utilizador [R2: Validação 422 para email duplicado]
     */
    public function store(Request $request)
    {
        $messages = [
            'email.unique'   => 'O email já se encontra registado no sistema.',
            'email.required' => 'O campo email é obrigatório.',
            'nome.required'  => 'O campo nome é obrigatório.',
        ];

        $validated = $request->validate([
            'nome'   => 'required|string|max:100',
            'email'  => 'required|email|max:100|unique:users,email',
            'perfil' => 'nullable|string',
        ], $messages);

        $perfilNome = $validated['perfil'] ?? 'Operador';
        $perfilModel = Perfil::where('nome', $perfilNome)->first();

        $user = User::create([
            'name'      => trim($validated['nome']),
            'email'     => trim($validated['email']),
            'password'  => Hash::make('password123'),
            'perfil_id' => $perfilModel?->id,
            'estado'    => 'Activo',
        ]);

        return response()->json($this->formatarUtilizador($user), 201);
    }

    /**
     * Atualizar utilizador
     */
    public function update(Request $request, $id)
    {
        $numericId = (int)preg_replace('/[^0-9]/', '', (string)$id);
        $user = User::where('id', $numericId)->orWhere('id', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilizador não encontrado.'], 404);
        }

        if ($request->has('nome')) {
            $user->name = $request->input('nome');
        }

        if ($request->has('perfil')) {
            $perfilModel = Perfil::where('nome', $request->input('perfil'))->first();
            if ($perfilModel) {
                $user->perfil_id = $perfilModel->id;
            }
        }

        if ($request->has('estado')) {
            $user->estado = $request->input('estado');
        }

        $user->save();

        return response()->json($this->formatarUtilizador($user));
    }

    /**
     * Desativar utilizador (passa a Inactivo, nunca remove) [RF02/RNF05]
     */
    public function desativar($id)
    {
        $numericId = (int)preg_replace('/[^0-9]/', '', (string)$id);
        $user = User::where('id', $numericId)->orWhere('id', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilizador não encontrado.'], 404);
        }

        $user->estado = 'Inactivo';
        $user->save();

        return response()->json($this->formatarUtilizador($user));
    }

    /**
     * Formatar utilizador para o padrão esperado pelo frontend
     */
    private function formatarUtilizador(User $u)
    {
        return [
            'id'      => 'US-' . str_pad($u->id, 3, '0', STR_PAD_LEFT),
            'nome'    => $u->name,
            'email'   => $u->email,
            'perfil'  => $u->perfil?->nome ?? 'Operador',
            'estado'  => $u->estado ?? 'Activo',
            'registo' => $u->created_at ? $u->created_at->format('Y-m-d') : date('Y-m-d'),
        ];
    }
}
