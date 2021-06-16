<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {

    return File::get(base_path('public') . '/index.html');

    return $router->app->version() . 'HELLO';
});

$router->get('/hello', function () {
    return 'Hello world!';
});

$router->group(['prefix' => 'api'], function() use ($router) {

    $router->post('login', ['uses' => 'UserController@login']);
    $router->post('logout', ['uses' => 'UserController@logout']);
    $router->get('me', ['uses' => 'UserController@me']);

    //$router->get('users', ['uses' => 'UserController@showAll']);
    $router->post('users', ['uses' => 'UserController@create']);
    //$router->delete('users', ['uses' => 'UserController@delete']);
    $router->post('users/activate', ['uses' => 'UserController@activate']);
    $router->post('users/resetPassword/{email}', ['uses' => 'UserController@requestResetPassword']);
    $router->post('users/resetPassword', ['uses' => 'UserController@resetPassword']);

    $router->get('tournaments', ['uses' => 'TournamentController@showAll']);
    $router->get('tournaments/{id}', ['uses' => 'TournamentController@showOne']);
    $router->delete('tournaments/{id}', ['uses' => 'TournamentController@delete']);
    $router->post('tournaments', ['uses' => 'TournamentController@create']);
    $router->put('tournaments/{id}', ['uses' => 'TournamentController@update']);

    //$router->get('registrations/{tournament}', ['uses' => 'RegistrationController@show']);
    $router->post('registrations', ['uses' => 'RegistrationController@create']);

    $router->get('matches/{tournament}', ['uses' => 'MatchController@show']);
    $router->post('matches/{tournament}/winner', ['uses' => 'MatchController@setWinner']);

    //$router->get('logo/{tournament}', ['uses' => 'LogoController@show']);
    $router->delete('logo/{id}', ['uses' => 'LogoController@delete']);
    $router->post('logo', ['uses' => 'LogoController@create']);

});