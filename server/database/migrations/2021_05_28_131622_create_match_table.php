<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament')->constrained('tournaments');
            $table->foreignId('playerA')->nullable()->constrained('users', 'email');
            $table->foreignId('playerB')->nullable()->constrained('users', 'email');
            $table->unsignedTinyInteger('level');
            $table->char('winnerA')->nullable();
            $table->char('winnerB')->nullable();
            $table->foreignId('nextMatch')->nullable()->constrained('matches');
            $table->boolean('nextMatchFirst')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('matches');
    }
}
