<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('ocorrencias', function (Blueprint $table) {
        $table->id();
        $table->string('ref', 50)->nullable()->unique();
        $table->string('titulo', 150);
        $table->text('descricao');

        // Localização detalhada
        $table->string('provincia', 100)->nullable();
        $table->string('distrito', 100)->nullable();
        $table->string('localidade', 100)->nullable();
        $table->string('localizacao', 255)->nullable();
        $table->decimal('latitude', 10, 7)->nullable();
        $table->decimal('longitude', 10, 7)->nullable();

        // Dados operacionais
        $table->string('tipo', 100)->nullable();
        $table->foreignId('tipo_ocorrencia_id')
            ->nullable()
            ->constrained('tipos_ocorrencia')
            ->nullOnDelete();

        $table->foreignId('prioridade_id')
            ->nullable()
            ->constrained('prioridades')
            ->nullOnDelete();

        $table->foreignId('utilizador_id')
            ->nullable()
            ->constrained('users')
            ->nullOnDelete();

        $table->string('estado', 50)->default('Por validar');
        $table->string('fonte', 100)->nullable()->default('Cidadão');
        $table->integer('afectados')->default(0);
        $table->string('risco', 50)->nullable()->default('A avaliar');
        $table->string('responsavel', 100)->nullable()->default('Operador');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ocorrencias');
    }
};
