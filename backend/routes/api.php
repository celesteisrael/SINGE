<?php

use App\Http\Controllers\Api\OcorrenciaController;
use App\Http\Controllers\Api\UtilizadorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rotas de Ocorrências
Route::get('/ocorrencias', [OcorrenciaController::class, 'index']);
Route::get('/ocorrencias/{ref}', [OcorrenciaController::class, 'show']);
Route::post('/ocorrencias', [OcorrenciaController::class, 'store']);

// Rotas de Utilizadores
Route::get('/utilizadores', [UtilizadorController::class, 'index']);
Route::post('/utilizadores', [UtilizadorController::class, 'store']);
Route::put('/utilizadores/{id}', [UtilizadorController::class, 'update']);
Route::patch('/utilizadores/{id}/desativar', [UtilizadorController::class, 'desativar']);
