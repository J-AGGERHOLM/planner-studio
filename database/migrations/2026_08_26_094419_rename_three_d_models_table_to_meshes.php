<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('three_d_models', 'meshes');
    }

    public function down(): void
    {
        Schema::rename('meshes', 'three_d_models');
    }
};
