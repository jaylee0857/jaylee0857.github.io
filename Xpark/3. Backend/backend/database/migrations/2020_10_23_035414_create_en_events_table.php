<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEnEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('en_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('sort')->default(1);
            $table->string('title');
            $table->string('sub_title');
            $table->string('date');
            $table->string('image');
            $table->mediumText('info');
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
        Schema::dropIfExists('en_events');
    }
}
